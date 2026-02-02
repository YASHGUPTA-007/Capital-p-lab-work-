// app/admin/_Components/blogEditor.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, Bold, Italic, 
  Link as LinkIcon, Underline as UnderlineIcon, Heading1, Heading2, 
  Heading3, AlignLeft, AlignCenter, AlignRight, Undo, 
  Redo, RefreshCw, CheckCircle, AlertCircle, List, ListOrdered
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  doc, updateDoc, addDoc, collection, serverTimestamp, 
  query, where, getDocs 
} from 'firebase/firestore';
import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import FontFamily from '@tiptap/extension-font-family';
import ImageSelectionModal from './ImageSelectionModal';
import { 
  uploadToCloudinary, 
  blobUrlToFile, 
  deleteCloudinaryImage,
  extractImagesFromHTML
} from '@/lib/cloudinary-utils';


// Custom FontSize Extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

// Custom Heading Extension with Tailwind Classes
const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevels = this.options.levels && this.options.levels.length > 0;
    const level = hasLevels && this.options.levels.includes(node.attrs.level) 
      ? node.attrs.level 
      : (hasLevels ? this.options.levels[0] : node.attrs.level);
    
    const classes: { [key: number]: string } = {
      1: 'text-4xl font-bold mb-6 mt-10 text-gray-900 leading-tight',
      2: 'text-3xl font-bold mb-5 mt-8 text-gray-900 leading-tight',
      3: 'text-2xl font-bold mb-4 mt-6 text-gray-900 leading-snug',
    };

    const className = classes[level] || classes[3];

    return [
      `h${level}`, 
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 
        class: className
      }), 
      0
    ];
  },
});

// Helper Functions
const calculateReadingTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

const generateSlugRaw = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  readTime?: number;
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

interface BlogEditorModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

const BLOG_FONTS = [
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Inter (Sans)', value: 'Inter, sans-serif' },
  { label: 'Merriweather (Serif)', value: 'Merriweather, serif' }
];

const TEXT_SIZES = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Medium', value: '18px' },
  { label: 'Large', value: '20px' },
  { label: 'X-Large', value: '24px' }
];

const categories = ["Technology", "Sustainability", "Policy", "Research", "ESG", "Climate", "Inclusion", "Custom"];

export default function BlogEditorModal({ blog, onClose, onSave }: BlogEditorModalProps) {
  // State
const [formData, setFormData] = useState({
  title: blog?.title || '',
  slug: blog?.slug || '',
  excerpt: blog?.excerpt || '',
  author: blog?.author || '',
  category: blog?.category || 'Technology',
  customCategory: '',
  featuredImage: blog?.featuredImage || '',
  status: (blog?.status || 'draft') as 'draft' | 'published'
});

// Separate state for tags
const [tags, setTags] = useState<string[]>(blog?.tags || []);
const [tagInput, setTagInput] = useState('');

  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [slugChecking, setSlugChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  
  // Image selection/crop state
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'featured' | 'editor'>('featured');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Track images for cleanup
  const originalFeaturedImage = useRef<string>(blog?.featuredImage || '');
  const originalContentImages = useRef<string[]>([]);
  const uploadedImagesThisSession = useRef<string[]>([]);

  useEffect(() => {
    if (blog?.category && !categories.includes(blog.category)) {
      setFormData(prev => ({
        ...prev,
        category: 'Custom',
        customCategory: blog.category
      }));
    }

    if (blog?.content) {
      originalContentImages.current = extractImagesFromHTML(blog.content);
    }
  }, [blog]);

  // Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: { HTMLAttributes: { class: 'list-disc pl-6 my-6 space-y-3' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-6 my-6 space-y-3' } },
        listItem: { HTMLAttributes: { class: 'text-gray-900 text-lg leading-relaxed' } },
      }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-8 shadow-md' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#755eb1] underline hover:text-[#6b54a5] font-medium' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({ types: ['textStyle'] })
    ],
    content: blog?.content || '<p>Start writing your blog post...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-gray-900'
      }
    }
  });

  const handleTitleChange = (title: string) => {
    setFormData(prev => {
      const newState = { ...prev, title };
      if (!useCustomSlug) {
        newState.slug = generateSlugRaw(title);
      }
      return newState;
    });
  };

  // Tag management functions
const handleAddTag = () => {
  const trimmedTag = tagInput.trim();
  if (trimmedTag && !tags.includes(trimmedTag)) {
    setTags([...tags, trimmedTag]);
    setTagInput('');
  }
};

const handleRemoveTag = (tagToRemove: string) => {
  setTags(tags.filter(tag => tag !== tagToRemove));
};

const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleAddTag();
  }
};


  const checkSlugUniqueness = async (slugToCheck: string) => {
    if (!slugToCheck) return;
    setSlugChecking(true);
    try {
      const q = query(collection(db, 'blog-posts'), where('slug', '==', slugToCheck));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setIsSlugUnique(true);
      } else {
        const isCurrentDoc = blog && snapshot.docs[0].id === blog.id;
        setIsSlugUnique(!!isCurrentDoc);
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    } finally {
      setSlugChecking(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.slug) checkSlugUniqueness(formData.slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Please upload a valid image under 5MB');
      return;
    }

    setPendingImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setCropType('featured');
      setSelectionModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Please upload a valid image under 5MB');
      return;
    }

    setPendingImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setCropType('editor');
      setSelectionModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // ⚡ NEW: Add image directly without cropping
  const handleAddDirectly = async (imageUrl: string) => {
    setSelectionModalOpen(false);
    
    if (cropType === 'featured') {
      setUploadingFeaturedImage(true);
    } else {
      setUploadingImage(true);
    }
    
    try {
      if (!pendingImageFile) {
        throw new Error('No file selected');
      }

      const uploadedUrl = await uploadToCloudinary(pendingImageFile);
      
      // Track uploaded image
      uploadedImagesThisSession.current.push(uploadedUrl);
      
      if (cropType === 'featured') {
        const oldFeaturedImage = formData.featuredImage;
        setFormData(prev => ({ ...prev, featuredImage: uploadedUrl }));
        
        // Non-blocking cleanup
        if (oldFeaturedImage && oldFeaturedImage !== originalFeaturedImage.current) {
          deleteCloudinaryImage(oldFeaturedImage).catch(err => 
            console.error('Background cleanup failed:', err)
          );
        }
      } else if (cropType === 'editor' && editor) {
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingFeaturedImage(false);
      setUploadingImage(false);
      setImageToCrop(null);
      setPendingImageFile(null);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    }
  };

  // ✅ Handle crop complete (existing optimized function)
  const handleCropComplete = async (croppedImageUrl: string) => {
    // 🚀 IMMEDIATELY close selection modal and show loading state
    setSelectionModalOpen(false);
    
    if (cropType === 'featured') {
      setUploadingFeaturedImage(true);
    } else {
      setUploadingImage(true);
    }
    
    try {
      const croppedFile = await blobUrlToFile(croppedImageUrl, pendingImageFile?.name || 'cropped-image.jpg');
      const uploadedUrl = await uploadToCloudinary(croppedFile);
      
      // Track uploaded image
      uploadedImagesThisSession.current.push(uploadedUrl);
      
      if (cropType === 'featured') {
        const oldFeaturedImage = formData.featuredImage;
        setFormData(prev => ({ ...prev, featuredImage: uploadedUrl }));
        
        // 🔥 Non-blocking cleanup - don't wait for this
        if (oldFeaturedImage && oldFeaturedImage !== originalFeaturedImage.current) {
          deleteCloudinaryImage(oldFeaturedImage).catch(err => 
            console.error('Background cleanup failed:', err)
          );
        }
      } else if (cropType === 'editor' && editor) {
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
      }
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('Failed to upload cropped image. Please try again.');
    } finally {
      setUploadingFeaturedImage(false);
      setUploadingImage(false);
      setImageToCrop(null);
      setPendingImageFile(null);
      URL.revokeObjectURL(croppedImageUrl);
    }
  };

  const handleSelectionCancel = async () => {
    setSelectionModalOpen(false);
    setImageToCrop(null);
    setPendingImageFile(null);
  };

  const handleRemoveFeaturedImage = async () => {
    const imageToRemove = formData.featuredImage;
    setFormData(prev => ({ ...prev, featuredImage: '' }));
    
    // Non-blocking cleanup
    if (imageToRemove && uploadedImagesThisSession.current.includes(imageToRemove)) {
      deleteCloudinaryImage(imageToRemove).catch(err => 
        console.error('Failed to delete image:', err)
      );
      uploadedImagesThisSession.current = uploadedImagesThisSession.current.filter(url => url !== imageToRemove);
    }
  };

  const handleCancel = async () => {
    const imagesToCleanup = uploadedImagesThisSession.current;
    
    if (imagesToCleanup.length > 0) {
      // Fire and forget cleanup
      Promise.all(imagesToCleanup.map(url => deleteCloudinaryImage(url)))
        .catch(err => console.error('Cleanup failed:', err));
    }
    
    onClose();
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  const setFontFamily = (font: string) => {
    if (editor && font) editor.chain().focus().setFontFamily(font).run();
  };

  const setFontSize = (size: string) => {
    if (editor && size) editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const handleSave = async () => {
    if (!formData.title || !editor?.getHTML()) {
      alert('Title and content are required');
      return;
    }

    if (!isSlugUnique) {
      alert('This URL slug is already taken. Please choose another.');
      return;
    }

    if (formData.category === 'Custom' && !formData.customCategory) {
      alert('Please enter a custom category name');
      return;
    }

    setSaving(true);
    try {
    const tagsArray = tags;
      const finalCategory = formData.category === 'Custom' ? formData.customCategory : formData.category;
      const readTime = calculateReadingTime(editor.getText());
      const currentContent = editor.getHTML();

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        author: formData.author,
        category: finalCategory,
        tags: tagsArray,
        featuredImage: formData.featuredImage,
        status: formData.status,
        content: currentContent,
        readTime: readTime,
        updatedAt: serverTimestamp(),
        ...(formData.status === 'published' && !blog?.publishedAt && { publishedAt: serverTimestamp() })
      };

      if (blog) {
        // Non-blocking cleanup of old images
        if (originalFeaturedImage.current && 
            originalFeaturedImage.current !== formData.featuredImage &&
            formData.featuredImage) {
          deleteCloudinaryImage(originalFeaturedImage.current).catch(err => 
            console.error('Failed to cleanup old featured image:', err)
          );
        }

        const currentContentImages = extractImagesFromHTML(currentContent);
        const unusedImages = originalContentImages.current.filter(
          img => !currentContentImages.includes(img) && img !== formData.featuredImage
        );
        
        // Fire and forget cleanup
        if (unusedImages.length > 0) {
          Promise.all(unusedImages.map(img => deleteCloudinaryImage(img)))
            .catch(err => console.error('Failed to cleanup unused images:', err));
        }

        await updateDoc(doc(db, 'blog-posts', blog.id), blogData);
      } else {
        await addDoc(collection(db, 'blog-posts'), {
          ...blogData,
          createdAt: serverTimestamp()
        });
      }

      uploadedImagesThisSession.current = [];
      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-6xl my-8 shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-900">
              {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            
            {/* ✅ Loading Overlay for Better UX */}
            {(uploadingFeaturedImage || uploadingImage) && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-none">
                <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center gap-4">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#755eb1]" />
                  <div>
                    <p className="font-bold text-gray-900">Uploading image...</p>
                    <p className="text-sm text-gray-500">Please wait</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 text-lg"
                    placeholder="Enter an engaging title"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlugRaw(e.target.value) }))}
                          disabled={!useCustomSlug}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 ${!useCustomSlug ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {slugChecking ? (
                            <RefreshCw size={16} className="animate-spin text-gray-400" />
                          ) : isSlugUnique ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-red-500" />
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setUseCustomSlug(!useCustomSlug)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium"
                      >
                        {useCustomSlug ? "Auto" : "Custom"}
                      </button>
                    </div>
                    {!isSlugUnique && (
                      <p className="text-xs text-red-500 font-medium">This slug is already in use.</p>
                    )}
                    <p className="text-xs text-gray-500">Preview: /blog/{formData.slug}</p>
                  </div>
                </div>

                {/* Author & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white mb-2"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  {formData.category === 'Custom' && (
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                      placeholder="Enter custom category name"
                      className="w-full px-4 py-2 border border-purple-300 bg-purple-50 rounded-lg focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-300"
                    />
                  )}
                </div>

                {/* Tags */}
             {/* Tags */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
  
  {/* Tag Input */}
  <div className="flex gap-2 mb-3">
    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyPress={handleTagInputKeyPress}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900"
      placeholder="Type a tag and press Enter"
    />
    <button
      type="button"
      onClick={handleAddTag}
      className="px-4 py-2 bg-[#755eb1] hover:bg-[#6b54a5] text-white font-medium rounded-lg transition-colors"
    >
      Add
    </button>
  </div>
  
  {/* Display Tags */}
  {tags.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-[#c7d6c1]/30 to-[#c1b4df]/30 text-[#2b2e34] text-sm font-medium rounded-full border border-gray-200"
        >
          <span>#{tag}</span>
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="hover:text-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}
  
  <p className="text-xs text-gray-500 mt-2">
    {tags.length === 0 ? 'No tags added yet' : `${tags.length} tag${tags.length !== 1 ? 's' : ''} added`}
  </p>
</div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                  <div className="space-y-3">
                    {formData.featuredImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                        <img 
                          src={formData.featuredImage} 
                          alt="Featured" 
                          className="w-full h-56 object-cover"
                        />
                        <button
                          onClick={handleRemoveFeaturedImage}
                          disabled={uploadingFeaturedImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 w-full h-56 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 hover:bg-gray-50 cursor-pointer transition-all">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Upload size={24} className="text-gray-500" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700 block">
                            {uploadingFeaturedImage ? 'Uploading...' : 'Click to upload & crop'}
                          </span>
                          <span className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageUpload}
                          disabled={uploadingFeaturedImage}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt / Subtitle *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 resize-none text-gray-900"
                    placeholder="Brief description of the blog post..."
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Used for SEO and blog cards</span>
                    <span>{formData.excerpt.length} chars</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Editor Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Content *</label>
              
              {/* Editor Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap items-center gap-1 sticky top-0 z-10">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-300' : ''}`} title="Bold"><Bold size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-300' : ''}`} title="Italic"><Italic size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('underline') ? 'bg-gray-300' : ''}`} title="Underline"><UnderlineIcon size={18} /></button>
                </div>

                {/* Font Family */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <select
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="text-xs px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Font Family"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Font</option>
                    {BLOG_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <select
                    onChange={(e) => setFontSize(e.target.value)}
                    className="text-xs px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Font Size"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Size</option>
                    {TEXT_SIZES.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).unsetMark('textStyle').run()} 
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`} 
                    title="Heading 1"
                  >
                    <Heading1 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).unsetMark('textStyle').run()} 
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`} 
                    title="Heading 2"
                  >
                    <Heading2 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).unsetMark('textStyle').run()} 
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`} 
                    title="Heading 3"
                  >
                    <Heading3 size={18} />
                  </button>
                </div>

                {/* Text Alignment */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`} title="Align Left"><AlignLeft size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`} title="Align Center"><AlignCenter size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`} title="Align Right"><AlignRight size={18} /></button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`} title="Bullet List"><List size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`} title="Numbered List"><ListOrdered size={18} /></button>
                </div>

                {/* Media */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button type="button" onClick={addLink} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('link') ? 'bg-gray-300' : ''}`} title="Add Link"><LinkIcon size={18} /></button>
                  <label className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`} title="Upload & Crop Image">
                    <ImageIcon size={18} />
                    <input type="file" accept="image/*" onChange={handleEditorImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                </div>
                
                {/* Undo/Redo */}
                <div className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30" title="Undo"><Undo size={18} /></button>
                  <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30" title="Redo"><Redo size={18} /></button>
                </div>
              </div>

              {/* Editor Input */}
              <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white min-h-[400px]">
                <EditorContent editor={editor} />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors border border-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !isSlugUnique}
              className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              type="button"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                blog ? 'Update Post' : 'Create Post'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Selection Modal */}
      {selectionModalOpen && imageToCrop && pendingImageFile && (
        <ImageSelectionModal
          imageFile={pendingImageFile}
          imageUrl={imageToCrop}
          onAddDirectly={handleAddDirectly}
          onCropComplete={handleCropComplete}
          onCancel={handleSelectionCancel}
          defaultAspectRatio={cropType === 'featured' ? 16 / 9 : undefined}
          type={cropType}
        />
      )}
    </>
  );
}