// app/admin/_Components/blogEditor.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Bold,
  Italic,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  List,
  ListOrdered,
  Table as TableIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import ImageSelectionModal, { ImageMetadata } from "./ImageSelectionModal";
import ImageEditModal from "./ImageEditModal";
import {
  uploadToCloudinary,
  blobUrlToFile,
  deleteCloudinaryImage,
  extractImagesFromHTML,
} from "@/lib/cloudinary-utils";

// Custom FontSize Extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
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
    const level =
      hasLevels && this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : hasLevels
          ? this.options.levels[0]
          : node.attrs.level;

    const classes: { [key: number]: string } = {
      1: "text-4xl font-bold mb-6 mt-10 text-gray-900 leading-tight",
      2: "text-3xl font-bold mb-5 mt-8 text-gray-900 leading-tight",
      3: "text-2xl font-bold mb-4 mt-6 text-gray-900 leading-snug",
    };

    const className = classes[level] || classes[3];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: className,
      }),
      0,
    ];
  },
});

// Helper Functions
const calculateReadingTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

const generateSlugRaw = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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
  featuredImageAlt?: string;
  featuredImageName?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  likes?: number;
}

interface BlogEditorModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

const BLOG_FONTS = [
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Inter (Sans)", value: "Inter, sans-serif" },
  { label: "Merriweather (Serif)", value: "Merriweather, serif" },
];

const TEXT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "20px" },
  { label: "X-Large", value: "24px" },
];

const categories = [
  "Technology",
  "Sustainability",
  "Policy",
  "Research",
  "ESG",
  "Climate",
  "Inclusion",
  "Custom",
];

export default function BlogEditorModal({
  blog,
  onClose,
  onSave,
}: BlogEditorModalProps) {
  // State
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    author: blog?.author || "",
    category: blog?.category || "Technology",
    customCategory: "",
    featuredImage: blog?.featuredImage || "",
    featuredImageAlt: blog?.featuredImageAlt || "",
    featuredImageName: blog?.featuredImageName || "",
    status: (blog?.status || "draft") as "draft" | "published",
  });

  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [slugChecking, setSlugChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

  // Image selection/crop state
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"featured" | "editor">("featured");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Image edit state
  const [editingImage, setEditingImage] = useState<{
    src: string;
    alt: string;
    title: string;
  } | null>(null);

  // Track images for cleanup
  const originalFeaturedImage = useRef<string>(blog?.featuredImage || "");
  const originalContentImages = useRef<string[]>([]);
  const uploadedImagesThisSession = useRef<string[]>([]);

  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 });

  useEffect(() => {
    if (blog?.category && !categories.includes(blog.category)) {
      setFormData((prev) => ({
        ...prev,
        category: "Custom",
        customCategory: blog.category,
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
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-6 my-6 space-y-3" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-6 my-6 space-y-3" },
        },
        listItem: {
          HTMLAttributes: { class: "text-gray-900 text-lg leading-relaxed" },
        },
      }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse w-full my-8",
          style: "border: 2px solid #000000;",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          style: "border: 2px solid #000000;",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          style:
            "border: 2px solid #000000; padding: 12px; background-color: #755eb1; color: white; font-weight: bold;",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: "border: 2px solid #000000; padding: 12px; min-width: 100px;",
        },
      }),
      Image.configure({
  HTMLAttributes: {
    class: "max-w-full h-auto rounded-lg my-8 shadow-md cursor-pointer hover:shadow-xl transition-shadow",
    loading: 'lazy',
  },
  inline: false,
  allowBase64: false,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
    };
  },
}),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#755eb1] underline hover:text-[#6b54a5] font-medium",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({ types: ["textStyle"] }),
    ],
    content: blog?.content || "<p>Start writing your blog post...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-gray-900",
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Backspace') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          
          if ($from.node(-1)?.type.name === 'table') {
            const cell = $from.node(0);
            if (cell && cell.textContent === '') {
              editor?.chain().focus().deleteTable().run();
              return true;
            }
          }
        }
        return false;
      },
      // ✅ Handle image clicks for editing
      handleClickOn: (view, pos, node, nodePos, event) => {
        if (node.type.name === 'image') {
          event.preventDefault();
          const attrs = node.attrs;
          setEditingImage({
            src: attrs.src || '',
            alt: attrs.alt || '',
            title: attrs.title || '',
          });
          return true;
        }
        return false;
      },
    },
  });
// ✅ Make tables keyboard accessible
useEffect(() => {
  if (!editor) return;

  const makeTablesAccessible = () => {
    const editorElement = document.querySelector('.ProseMirror');
    if (!editorElement) return;

    const tables = editorElement.querySelectorAll('table');
    tables.forEach((table) => {
      // Check if table has horizontal scroll
      if (table.scrollWidth > table.clientWidth) {
        table.setAttribute('tabindex', '0');
        table.setAttribute('role', 'region');
        table.setAttribute('aria-label', 'Scrollable data table - use arrow keys to scroll');
      }
    });
  };

  // Run on editor update
  makeTablesAccessible();
  
  // Re-run when editor content changes
  const observer = new MutationObserver(makeTablesAccessible);
  const editorElement = document.querySelector('.ProseMirror');
  
  if (editorElement) {
    observer.observe(editorElement, {
      childList: true,
      subtree: true,
    });
  }

  return () => observer.disconnect();
}, [editor]);

  
  const insertTable = () => {
    setShowTablePicker(true);
  };

  const confirmInsertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({
        rows: tableSize.rows,
        cols: tableSize.cols,
        withHeaderRow: true,
      })
      .run();
    setShowTablePicker(false);
    setTableSize({ rows: 3, cols: 3 });
  };

  const addColumnBefore = () => editor?.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor?.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor?.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor?.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor?.chain().focus().addRowAfter().run();
  const deleteRow = () => editor?.chain().focus().deleteRow().run();
  const deleteTable = () => editor?.chain().focus().deleteTable().run();
  const toggleHeaderRow = () => editor?.chain().focus().toggleHeaderRow().run();

  const handleTitleChange = (title: string) => {
    setFormData((prev) => {
      const newState = { ...prev, title };
      if (!useCustomSlug) {
        newState.slug = generateSlugRaw(title);
      }
      return newState;
    });
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const checkSlugUniqueness = async (slugToCheck: string) => {
    if (!slugToCheck) return;
    setSlugChecking(true);
    try {
      const q = query(
        collection(db, "blog-posts"),
        where("slug", "==", slugToCheck),
      );
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

  const handleFeaturedImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Please upload a valid image under 5MB");
      return;
    }

    setPendingImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setCropType("featured");
      setSelectionModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Please upload a valid image under 5MB");
      return;
    }

    setPendingImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setCropType("editor");
      setSelectionModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDirectly = async (imageUrl: string, metadata: ImageMetadata) => {
    setSelectionModalOpen(false);

    if (cropType === "featured") {
      setUploadingFeaturedImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      if (!pendingImageFile) {
        throw new Error("No file selected");
      }

      const uploadedUrl = await uploadToCloudinary(pendingImageFile);
      uploadedImagesThisSession.current.push(uploadedUrl);

      if (cropType === "featured") {
        const oldFeaturedImage = formData.featuredImage;
        setFormData((prev) => ({ 
          ...prev, 
          featuredImage: uploadedUrl,
          featuredImageAlt: metadata.altText,
          featuredImageName: metadata.name
        }));

        if (oldFeaturedImage && oldFeaturedImage !== originalFeaturedImage.current) {
          deleteCloudinaryImage(oldFeaturedImage).catch((err) =>
            console.error("Background cleanup failed:", err),
          );
        }
    } else if (cropType === "editor" && editor) {
  // Get image dimensions
  const img = new window.Image();
  img.onload = () => {
    editor.chain().focus().setImage({ 
      src: uploadedUrl,
      alt: metadata.altText,
      title: metadata.name || metadata.altText,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }).run();
  };
  img.src = uploadedUrl;
}
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingFeaturedImage(false);
      setUploadingImage(false);
      setImageToCrop(null);
      setPendingImageFile(null);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string, metadata: ImageMetadata) => {
    setSelectionModalOpen(false);

    if (cropType === "featured") {
      setUploadingFeaturedImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      const croppedFile = await blobUrlToFile(
        croppedImageUrl,
        pendingImageFile?.name || "cropped-image.jpg",
      );
      const uploadedUrl = await uploadToCloudinary(croppedFile);
      uploadedImagesThisSession.current.push(uploadedUrl);

      if (cropType === "featured") {
        const oldFeaturedImage = formData.featuredImage;
        setFormData((prev) => ({ 
          ...prev, 
          featuredImage: uploadedUrl,
          featuredImageAlt: metadata.altText,
          featuredImageName: metadata.name
        }));

        if (oldFeaturedImage && oldFeaturedImage !== originalFeaturedImage.current) {
          deleteCloudinaryImage(oldFeaturedImage).catch((err) =>
            console.error("Background cleanup failed:", err),
          );
        }
      } else if (cropType === "editor" && editor) {
  // Get image dimensions
  const img = new window.Image();
  img.onload = () => {
    editor.chain().focus().setImage({ 
      src: uploadedUrl,
      alt: metadata.altText,
      title: metadata.name || metadata.altText,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }).run();
  };
  img.src = uploadedUrl;
}
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      alert("Failed to upload cropped image. Please try again.");
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

  // ✅ NEW: Handle image edit save
  const handleImageEditSave = (metadata: { altText: string; title: string }) => {
    if (!editor || !editingImage) return;

    // Find and update the image in the editor
    const { state } = editor;
    const { doc } = state;
    
    let imagePos: number | null = null;
    
    doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === editingImage.src) {
        imagePos = pos;
        return false;
      }
    });

    if (imagePos !== null) {
      editor
  .chain()
  .focus()
  .setNodeSelection(imagePos)
  .updateAttributes('image', {
    alt: metadata.altText,
    title: metadata.title || metadata.altText,
    // Preserve existing width/height if present
    ...(editingImage.src && {}),
  })
  .run();
    }

    setEditingImage(null);
  };

  const handleRemoveFeaturedImage = async () => {
    const imageToRemove = formData.featuredImage;
    setFormData((prev) => ({ 
      ...prev, 
      featuredImage: "",
      featuredImageAlt: "",
      featuredImageName: ""
    }));

    if (imageToRemove && uploadedImagesThisSession.current.includes(imageToRemove)) {
      deleteCloudinaryImage(imageToRemove).catch((err) =>
        console.error("Failed to delete image:", err),
      );
      uploadedImagesThisSession.current =
        uploadedImagesThisSession.current.filter(
          (url) => url !== imageToRemove,
        );
    }
  };

  const handleCancel = async () => {
    const imagesToCleanup = uploadedImagesThisSession.current;

    if (imagesToCleanup.length > 0) {
      Promise.all(
        imagesToCleanup.map((url) => deleteCloudinaryImage(url)),
      ).catch((err) => console.error("Cleanup failed:", err));
    }

    onClose();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  const setFontFamily = (font: string) => {
    if (editor && font) editor.chain().focus().setFontFamily(font).run();
  };

  const setFontSize = (size: string) => {
    if (editor && size)
      editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const handleSave = async () => {
    if (!formData.title || !editor?.getHTML()) {
      alert("Title and content are required");
      return;
    }

    if (!isSlugUnique) {
      alert("This URL slug is already taken. Please choose another.");
      return;
    }

    if (formData.category === "Custom" && !formData.customCategory) {
      alert("Please enter a custom category name");
      return;
    }

    // ✅ Validate featured image has alt text
    if (formData.featuredImage && !formData.featuredImageAlt) {
      alert("⚠️ Featured image is missing alt text. Please provide it for accessibility.");
      return;
    }

    // ✅ Validate all content images have alt text
    const currentContent = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentContent;
    const contentImages = tempDiv.querySelectorAll('img');
    
    const imagesWithoutAlt: string[] = [];
    contentImages.forEach((img) => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      if (!alt || alt.trim() === '') {
        // Get a preview of the image URL for the alert
        const urlPreview = src ? new URL(src).pathname.split('/').pop()?.substring(0, 30) : 'Unknown';
        imagesWithoutAlt.push(urlPreview || 'Unknown image');
      }
    });

    if (imagesWithoutAlt.length > 0) {
      alert(`⚠️ ${imagesWithoutAlt.length} image(s) in content are missing alt text:\n\n${imagesWithoutAlt.join('\n')}\n\nAll images must have alt text for accessibility.\n\nClick on images in the editor to add alt text.`);
      return;
    }

    setSaving(true);
    try {
      const tagsArray = tags;
      const finalCategory =
        formData.category === "Custom"
          ? formData.customCategory
          : formData.category;
      const readTime = calculateReadingTime(editor.getText());

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        author: formData.author,
        category: finalCategory,
        tags: tagsArray,
        featuredImage: formData.featuredImage,
        featuredImageAlt: formData.featuredImageAlt,
        featuredImageName: formData.featuredImageName,
        status: formData.status,
        content: currentContent,
        readTime: readTime,
        updatedAt: serverTimestamp(),
        ...(formData.status === "published" &&
          !blog?.publishedAt && { publishedAt: serverTimestamp() }),
      };

      if (blog) {
        if (
          originalFeaturedImage.current &&
          originalFeaturedImage.current !== formData.featuredImage &&
          formData.featuredImage
        ) {
          deleteCloudinaryImage(originalFeaturedImage.current).catch((err) =>
            console.error("Failed to cleanup old featured image:", err),
          );
        }

        const currentContentImages = extractImagesFromHTML(currentContent);
        const unusedImages = originalContentImages.current.filter(
          (img) =>
            !currentContentImages.includes(img) &&
            img !== formData.featuredImage,
        );

        if (unusedImages.length > 0) {
          Promise.all(
            unusedImages.map((img) => deleteCloudinaryImage(img)),
          ).catch((err) =>
            console.error("Failed to cleanup unused images:", err),
          );
        }

        await updateDoc(doc(db, "blog-posts", blog.id), blogData);
      } else {
        await addDoc(collection(db, "blog-posts"), {
          ...blogData,
          createdAt: serverTimestamp(),
        });
      }

      uploadedImagesThisSession.current = [];
      onSave();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog post");
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
              {blog ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
              aria-label="Close editor"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Loading Overlay */}
            {(uploadingFeaturedImage || uploadingImage) && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-none">
                <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center gap-4">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#755eb1]" />
                  <div>
                    <p className="font-bold text-gray-900">
                      Uploading image...
                    </p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              slug: generateSlugRaw(e.target.value),
                            }))
                          }
                          disabled={!useCustomSlug}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 ${!useCustomSlug ? "bg-gray-50 text-gray-500" : "bg-white"}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {slugChecking ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin text-gray-400"
                            />
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
                      <p className="text-xs text-red-500 font-medium">
                        This slug is already in use.
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Preview: /blogs/{formData.slug}
                    </p>
                  </div>
                </div>

                {/* Author & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "draft" | "published",
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white mb-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {formData.category === "Custom" && (
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customCategory: e.target.value,
                        }))
                      }
                      placeholder="Enter custom category name"
                      className="w-full px-4 py-2 border border-purple-300 bg-purple-50 rounded-lg focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-300"
                    />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>

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
                    {tags.length === 0
                      ? "No tags added yet"
                      : `${tags.length} tag${tags.length !== 1 ? "s" : ""} added`}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <div className="space-y-3">
                    {formData.featuredImage ? (
                      <div className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                          <img
                            src={formData.featuredImage}
                            alt={formData.featuredImageAlt || "Featured"}
                            className="w-full h-56 object-cover"
                          />
                          <button
                            onClick={handleRemoveFeaturedImage}
                            disabled={uploadingFeaturedImage}
                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            aria-label="Remove featured image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {/* Display Alt Text */}
                        {formData.featuredImageAlt && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs font-bold text-green-900 mb-1">✅ Alt Text:</p>
                            <p className="text-xs text-green-800">{formData.featuredImageAlt}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 w-full h-56 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 hover:bg-gray-50 cursor-pointer transition-all">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Upload size={24} className="text-gray-500" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700 block">
                            {uploadingFeaturedImage
                              ? "Uploading..."
                              : "Click to upload & add alt text"}
                          </span>
                          <span className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (max. 5MB)
                          </span>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt / Subtitle *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
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
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Content *
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <p className="text-xs font-medium text-blue-900">
                    💡 Click images to edit alt text
                  </p>
                </div>
              </div>

              {/* Editor Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap items-center gap-1 sticky top-0 z-10">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
                    title="Bold"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
                    title="Italic"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
                    title="Underline"
                  >
                    <UnderlineIcon size={18} />
                  </button>
                </div>

                {/* Font Family */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <select
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="text-xs px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Font Family"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Font
                    </option>
                    {BLOG_FONTS.map((font) => (
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
                    <option value="" disabled hidden>
                      Size
                    </option>
                    {TEXT_SIZES.map((size) => (
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
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 1 })
                        .unsetMark("textStyle")
                        .run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
                    title="Heading 1"
                  >
                    <Heading1 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .unsetMark("textStyle")
                        .run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
                    title="Heading 2"
                  >
                    <Heading2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 3 })
                        .unsetMark("textStyle")
                        .run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""}`}
                    title="Heading 3"
                  >
                    <Heading3 size={18} />
                  </button>
                </div>

                {/* Text Alignment */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().setTextAlign("left").run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""}`}
                    title="Align Left"
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().setTextAlign("center").run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""}`}
                    title="Align Center"
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().setTextAlign("right").run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""}`}
                    title="Align Right"
                  >
                    <AlignRight size={18} />
                  </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
                    title="Bullet List"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
                    title="Numbered List"
                  >
                    <ListOrdered size={18} />
                  </button>
                </div>

                {/* Tables */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={insertTable}
                    className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Insert Custom Table"
                  >
                    <TableIcon size={18} />
                  </button>
                  {editor.isActive("table") && (
                    <>
                      <button
                        type="button"
                        onClick={addColumnAfter}
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
                        title="Add Column After"
                      >
                        Col+
                      </button>
                      <button
                        type="button"
                        onClick={deleteColumn}
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
                        title="Delete Column"
                      >
                        Col-
                      </button>
                      <button
                        type="button"
                        onClick={addRowAfter}
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
                        title="Add Row After"
                      >
                        Row+
                      </button>
                      <button
                        type="button"
                        onClick={deleteRow}
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
                        title="Delete Row"
                      >
                        Row-
                      </button>
                      <button
                        type="button"
                        onClick={deleteTable}
                        className="px-2 py-1 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
                        title="Delete Table"
                      >
                        Del
                      </button>
                    </>
                  )}
                </div>

                {/* Media */}
                <div className="flex items-center gap-1 px-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${editor.isActive("link") ? "bg-gray-300" : ""}`}
                    title="Add Link"
                  >
                    <LinkIcon size={18} />
                  </button>
                  <label
                    className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Upload Image with Alt Text"
                  >
                    <ImageIcon size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditorImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Undo/Redo */}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                    title="Undo"
                  >
                    <Undo size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                    title="Redo"
                  >
                    <Redo size={18} />
                  </button>
                </div>
              </div>

              {/* Editor Input */}
              <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white min-h-[400px] overflow-x-auto">
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
              ) : blog ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table Size Picker Modal */}
      {showTablePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Insert Table
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rows: {tableSize.rows}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tableSize.rows}
                  onChange={(e) =>
                    setTableSize((prev) => ({
                      ...prev,
                      rows: parseInt(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns: {tableSize.cols}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={tableSize.cols}
                  onChange={(e) =>
                    setTableSize((prev) => ({
                      ...prev,
                      cols: parseInt(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                Creating {tableSize.rows} × {tableSize.cols} table
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTablePicker(false);
                  setTableSize({ rows: 3, cols: 3 });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmInsertTable}
                className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Selection Modal */}
      {selectionModalOpen && imageToCrop && pendingImageFile && (
        <ImageSelectionModal
          imageFile={pendingImageFile}
          imageUrl={imageToCrop}
          onAddDirectly={handleAddDirectly}
          onCropComplete={handleCropComplete}
          onCancel={handleSelectionCancel}
          defaultAspectRatio={cropType === "featured" ? 16 / 9 : undefined}
          type={cropType}
        />
      )}

      {/* Image Edit Modal */}
      {editingImage && (
        <ImageEditModal
          imageUrl={editingImage.src}
          currentAlt={editingImage.alt}
          currentTitle={editingImage.title}
          onSave={handleImageEditSave}
          onCancel={() => setEditingImage(null)}
        />
      )}
    </>
  );
}