'use client';

import { useState, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, Bold, Italic, 
  Link as LinkIcon, Underline as UnderlineIcon, Heading1, Heading2, 
  Heading3, AlignLeft, AlignCenter, AlignRight, Undo, 
  Redo, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  doc, updateDoc, addDoc, collection, serverTimestamp, 
  query, where, getDocs 
} from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';

// --- Helper Functions ---

const calculateReadingTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
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

export default function BlogEditorModal({ blog, onClose, onSave }: BlogEditorModalProps) {
  // --- State ---
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    author: blog?.author || '',
    category: blog?.category || 'Technology',
    customCategory: '',
    tags: blog?.tags?.join(', ') || '',
    featuredImage: blog?.featuredImage || '',
    status: (blog?.status || 'draft') as 'draft' | 'published'
  });

  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [slugChecking, setSlugChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

  // Categories list
  const categories = ["Technology", "Sustainability", "Policy", "Research", "ESG", "Climate", "Inclusion", "Custom"];

  // Initialize Custom Category if needed
  useEffect(() => {
    if (blog?.category && !categories.includes(blog.category)) {
      setFormData(prev => ({
        ...prev,
        category: 'Custom',
        customCategory: blog.category
      }));
    }
  }, [blog]);

  // --- Tiptap Editor ---
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, 
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-bold text-gray-900',
        },
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          
          const classes: { [key: number]: string } = {
            1: 'text-4xl mb-4 mt-6',
            2: 'text-3xl mb-3 mt-5',
            3: 'text-2xl mb-2 mt-4',
          };

          return [
            `h${level}`, 
            { ...HTMLAttributes, class: `${classes[level]} ${HTMLAttributes.class}` }, 
            0
          ];
        },
      }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4 shadow-md' } }),
      Link.configure({ 
        openOnClick: false, 
        HTMLAttributes: { class: 'text-[#755eb1] underline hover:text-[#6b54a5]' } 
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true })
    ],
    content: blog?.content || '<p>Start writing your blog post...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl'
      }
    }
  });

  // --- Handlers ---

  const handleTitleChange = (title: string) => {
    setFormData(prev => {
      const newState = { ...prev, title };
      if (!useCustomSlug) {
        newState.slug = generateSlugRaw(title);
      }
      return newState;
    });
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
        // If editing, it's valid if the found doc is the current doc
        const isCurrentDoc = blog && snapshot.docs[0].id === blog.id;
        setIsSlugUnique(!!isCurrentDoc);
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    } finally {
      setSlugChecking(false);
    }
  };

  // Debounce slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.slug) checkSlugUniqueness(formData.slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blog_images');
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return data.secure_url;
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Please upload a valid image under 5MB');
      return;
    }

    setUploadingFeaturedImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    
    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
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
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const finalCategory = formData.category === 'Custom' ? formData.customCategory : formData.category;
      const readTime = calculateReadingTime(editor.getText());

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        author: formData.author,
        category: finalCategory,
        tags: tagsArray,
        featuredImage: formData.featuredImage,
        status: formData.status,
        content: editor.getHTML(),
        readTime: readTime,
        updatedAt: serverTimestamp(),
        ...(formData.status === 'published' && !blog?.publishedAt && { publishedAt: serverTimestamp() })
      };

      if (blog) {
        await updateDoc(doc(db, 'blog-posts', blog.id), blogData);
      } else {
        await addDoc(collection(db, 'blog-posts'), {
          ...blogData,
          createdAt: serverTimestamp()
        });
      }

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl my-8 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">
            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          
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
                    className="w-full px-4 py-2 border border-purple-300 bg-purple-50 rounded-lg focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-300 animate-in fade-in slide-in-from-top-1"
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900"
                  placeholder="tech, news, update (comma separated)"
                />
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
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
                          {uploadingFeaturedImage ? 'Uploading...' : 'Click to upload'}
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
              {/* Toolbar Groups */}
              <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}><Bold size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}><Italic size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}><UnderlineIcon size={18} /></button>
              </div>

              <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}><Heading1 size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}><Heading2 size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}><Heading3 size={18} /></button>
              </div>

              <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}><AlignLeft size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}><AlignCenter size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}><AlignRight size={18} /></button>
              </div>

              <div className="flex items-center gap-1 px-2">
                <button type="button" onClick={addLink} className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive('link') ? 'bg-gray-300' : ''}`}><LinkIcon size={18} /></button>
                <label className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}>
                  <ImageIcon size={18} />
                  <input type="file" accept="image/*" onChange={handleEditorImageUpload} disabled={uploadingImage} className="hidden" />
                </label>
              </div>
              
              <div className="ml-auto flex items-center gap-1">
                <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30"><Undo size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30"><Redo size={18} /></button>
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
            onClick={onClose}
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
  );
}