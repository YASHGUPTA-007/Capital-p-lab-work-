"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  Type,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Tag as TagIcon,
  Plus,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageSelectionModal, { ImageMetadata } from "./ImageSelectionModal";
import {
  uploadToCloudinary,
  blobUrlToFile,
  deleteCloudinaryImage,
} from "@/lib/cloudinary-utils";
import {
  uploadDocumentToCloudinary,
  calculateReadTime,
  isValidUrl,
  formatFileSize,
  deleteDocumentFromCloudinary,
} from "@/lib/research-utils";
import { ResearchItem } from "@/types/research";

interface ResearchEditorProps {
  item: ResearchItem | null;
  onClose: () => void;
  onSave: () => void;
}

const predefinedCategories = [
  "Environment",
  "Social",
  "Economic",
  "Policy",
  "Technology",
];

export default function ResearchEditor({
  item,
  onClose,
  onSave,
}: ResearchEditorProps) {
  // Form state
  const [formData, setFormData] = useState({
    title: item?.title || "",
    slug: item?.slug || "",
    category: item?.category || "Environment",
    customCategory: "",
    author: item?.author || "",
    coverImage: item?.coverImage || "",
    coverImageAlt: item?.coverImageAlt || "",
    coverImageName: item?.coverImageName || "",
    type: (item?.type || "document") as "document" | "link",
    documentUrl: item?.documentUrl || "",
    documentName: item?.documentName || "",
    documentSize: item?.documentSize || "",
    externalLink: item?.externalLink || "",
    status: (item?.status || "draft") as "draft" | "published",
  });

  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // ✅ Deferred upload states
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [pendingCoverPreview, setPendingCoverPreview] = useState<string | null>(null);
  const [pendingDocumentFile, setPendingDocumentFile] = useState<File | null>(null);
  const [pendingDocumentPreview, setPendingDocumentPreview] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);

  // ✅ Track original URLs for deletion
  const originalCoverImage = useRef<string>(item?.coverImage || "");
  const originalDocumentUrl = useRef<string>(item?.documentUrl || "");

  // TipTap Editor with fixed placeholder configuration
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Write a compelling description of your research...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: item?.description || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-4 text-gray-800",
      },
    },
  });

  useEffect(() => {
    if (formData.title && !item) {
      const autoSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, item]);

  useEffect(() => {
    // Check if current category is custom
    if (item && !predefinedCategories.includes(item.category)) {
      setShowCustomCategory(true);
      setFormData((prev) => ({
        ...prev,
        category: "Custom",
        customCategory: item.category,
      }));
    }
  }, [item]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // ✅ Cover Image: Store file locally, create preview
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Please upload a valid image under 5MB");
      return;
    }

    setTempImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setSelectionModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDirectly = async (imageUrl: string, metadata: ImageMetadata) => {
    setSelectionModalOpen(false);

    if (!tempImageFile) return;

    // ✅ Store file for deferred upload
    setPendingCoverFile(tempImageFile);
    setPendingCoverPreview(imageUrl);
    setFormData((prev) => ({
      ...prev,
      coverImageAlt: metadata.altText,
      coverImageName: metadata.name,
    }));

    setImageToCrop(null);
    setTempImageFile(null);
  };

  const handleCropComplete = async (
    croppedImageUrl: string,
    metadata: ImageMetadata,
  ) => {
    setSelectionModalOpen(false);

    try {
      const croppedFile = await blobUrlToFile(
        croppedImageUrl,
        tempImageFile?.name || "cropped-image.jpg",
      );

      // ✅ Store file for deferred upload
      setPendingCoverFile(croppedFile);
      setPendingCoverPreview(croppedImageUrl);
      setFormData((prev) => ({
        ...prev,
        coverImageAlt: metadata.altText,
        coverImageName: metadata.name,
      }));
    } catch (error) {
      console.error("Error processing cropped image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setImageToCrop(null);
      setTempImageFile(null);
    }
  };

  const handleSelectionCancel = () => {
    setSelectionModalOpen(false);
    setImageToCrop(null);
    setTempImageFile(null);
  };

  // ✅ Document: Store file locally, create preview
  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid document (PDF, DOC, XLS, PPT)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be under 25MB");
      return;
    }

    // ✅ Store file for deferred upload
    setPendingDocumentFile(file);
    setPendingDocumentPreview({
      name: file.name,
      size: formatFileSize(file.size),
    });
  };

  // Tag Management
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // ✅ Save with deferred uploads
  const handleSave = async () => {
    if (!formData.title || !editor?.getHTML()) {
      alert("Title and description are required");
      return;
    }

    // Check if we have either existing or pending cover image
    if (!formData.coverImage && !pendingCoverFile) {
      alert("Cover image is required");
      return;
    }

    if (!formData.slug) {
      alert("URL slug is required");
      return;
    }

    // Get final category
    const finalCategory =
      formData.category === "Custom"
        ? formData.customCategory.trim()
        : formData.category;

    if (!finalCategory) {
      alert("Category is required");
      return;
    }

    if (formData.type === "document" && !formData.documentUrl && !pendingDocumentFile) {
      alert("Please upload a document");
      return;
    }

    if (formData.type === "link") {
      if (!formData.externalLink) {
        alert("Please provide an external link");
        return;
      }
      if (!isValidUrl(formData.externalLink)) {
        alert(
          "Please provide a valid URL (must start with http:// or https://)",
        );
        return;
      }
    }

    setSaving(true);

    try {
      let finalCoverImage = formData.coverImage;
      let finalDocumentUrl = formData.documentUrl;
      let finalDocumentName = formData.documentName;
      let finalDocumentSize = formData.documentSize;

      // ✅ Upload pending cover image
      if (pendingCoverFile) {
        console.log("Uploading cover image...");
        finalCoverImage = await uploadToCloudinary(pendingCoverFile);
      }

      // ✅ Upload pending document
      if (pendingDocumentFile && formData.type === "document") {
        console.log("Uploading document...");
        const result = await uploadDocumentToCloudinary(pendingDocumentFile);
        finalDocumentUrl = result.url;
        finalDocumentName = result.name;
        finalDocumentSize = result.size;
      }

      const description = editor.getHTML();
      const readTime = calculateReadTime(description);

      const data: any = {
        title: formData.title,
        slug: formData.slug,
        category: finalCategory,
        description,
        coverImage: finalCoverImage,
        coverImageAlt: formData.coverImageAlt || "",
        coverImageName: formData.coverImageName || "",
        type: formData.type,
        author: formData.author,
        readTime,
        tags,
        status: formData.status,
        updatedAt: serverTimestamp(),
      };

      if (formData.type === "document") {
        data.documentUrl = finalDocumentUrl;
        data.documentName = finalDocumentName;
        data.documentSize = finalDocumentSize;
        data.externalLink = null;
      } else {
        data.externalLink = formData.externalLink;
        data.documentUrl = null;
        data.documentName = null;
        data.documentSize = null;
      }

      if (item) {
        await updateDoc(doc(db, "research-items", item.id), data);
      } else {
        await addDoc(collection(db, "research-items"), {
          ...data,
          createdAt: serverTimestamp(),
          publishedAt:
            formData.status === "published" ? serverTimestamp() : null,
          downloads: 0,
          views: 0,
        });
      }

      // ✅ Delete old files AFTER successful save
      if (item) {
        // Delete old cover if replaced
        if (
          pendingCoverFile &&
          originalCoverImage.current &&
          originalCoverImage.current !== finalCoverImage
        ) {
          console.log("Deleting old cover image:", originalCoverImage.current);
          deleteCloudinaryImage(originalCoverImage.current).catch((err) =>
            console.error("Failed to delete old cover:", err),
          );
        }

        // Delete old document if replaced
        if (
          pendingDocumentFile &&
          originalDocumentUrl.current &&
          originalDocumentUrl.current !== finalDocumentUrl
        ) {
          console.log("Deleting old document:", originalDocumentUrl.current);
          deleteDocumentFromCloudinary(originalDocumentUrl.current).catch((err) =>
            console.error("Failed to delete old document:", err),
          );
        }
      }

      setSaveStatus("success");
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (error) {
      console.error("Error saving research item:", error);
      setSaveStatus("error");
      alert("Failed to save. Please try again.");
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Clean up preview URLs
    if (pendingCoverPreview) {
      URL.revokeObjectURL(pendingCoverPreview);
    }
    onClose();
  };

  // Get display values for cover and document
  const displayCoverImage = pendingCoverPreview || formData.coverImage;
  const displayDocumentName =
    pendingDocumentPreview?.name || formData.documentName;
  const displayDocumentSize =
    pendingDocumentPreview?.size || formData.documentSize;

  if (!editor) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col my-4 shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-blue-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {item ? "Edit Research Item" : "New Research Item"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Create compelling research content with rich descriptions
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            title="Close"
          >
            <X size={18} className="text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Type size={14} className="text-purple-600" />
                Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                placeholder="e.g., Urban Resilience in Coastal Cities"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <LinkIcon size={14} className="text-purple-600" />
                URL Slug
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5">
                  <span className="text-xs text-gray-500 font-mono">/research/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      setFormData({ ...formData, slug });
                    }}
                    className="flex-1 bg-transparent focus:outline-none text-gray-900 font-mono text-sm placeholder:text-gray-400"
                    placeholder="urban-resilience-coastal-cities"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.title) {
                      const autoSlug = generateSlug(formData.title);
                      setFormData({ ...formData, slug: autoSlug });
                    }
                  }}
                  disabled={!formData.title}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Category, Author, Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Custom") {
                      setShowCustomCategory(true);
                    } else {
                      setShowCustomCategory(false);
                    }
                    setFormData({ ...formData, category: value });
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm appearance-none bg-white cursor-pointer transition-all"
                >
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">Custom...</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {showCustomCategory && (
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm placeholder:text-gray-400"
                  placeholder="Enter custom category"
                />
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm placeholder:text-gray-400 transition-all"
                placeholder="Dr. Jane Smith"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon size={14} className="text-purple-600" />
              Cover Image
              <span className="text-red-500">*</span>
              {pendingCoverFile && (
                <span className="text-xs font-normal text-orange-600">
                  (Will upload on save)
                </span>
              )}
            </label>
            {displayCoverImage ? (
              <div className="relative group">
                <img
                  src={displayCoverImage}
                  alt={formData.coverImageAlt || "Cover"}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => {
                      if (pendingCoverPreview) {
                        URL.revokeObjectURL(pendingCoverPreview);
                      }
                      setPendingCoverFile(null);
                      setPendingCoverPreview(null);
                      setFormData({
                        ...formData,
                        coverImage: "",
                        coverImageAlt: "",
                        coverImageName: "",
                      });
                    }}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <X size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all group">
                <Upload className="w-10 h-10 text-gray-400 group-hover:text-purple-500 mb-2 transition-colors" />
                <span className="text-sm text-gray-600 font-medium">
                  Click to upload cover image
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG or WEBP (max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "document" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type === "document"
                    ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FileText
                  className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === "document"
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                />
                <p
                  className={`font-semibold text-sm mb-0.5 ${
                    formData.type === "document"
                      ? "text-purple-900"
                      : "text-gray-700"
                  }`}
                >
                  Document Upload
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, XLS, PPT</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "link" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type === "link"
                    ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ExternalLink
                  className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === "link" ? "text-purple-600" : "text-gray-400"
                  }`}
                />
                <p
                  className={`font-semibold text-sm mb-0.5 ${
                    formData.type === "link" ? "text-purple-900" : "text-gray-700"
                  }`}
                >
                  External Link
                </p>
                <p className="text-xs text-gray-500">Link to resource</p>
              </button>
            </div>
          </div>

          {/* Document Upload or External Link */}
          {formData.type === "document" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Upload <span className="text-red-500">*</span>
                {pendingDocumentFile && (
                  <span className="text-xs font-normal text-orange-600 ml-2">
                    (Will upload on save)
                  </span>
                )}
              </label>
              {displayDocumentName ? (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {displayDocumentName}
                      </p>
                      <p className="text-xs text-gray-600">{displayDocumentSize}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPendingDocumentFile(null);
                      setPendingDocumentPreview(null);
                      setFormData({
                        ...formData,
                        documentUrl: "",
                        documentName: "",
                        documentSize: "",
                      });
                    }}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all group">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2 transition-colors" />
                  <span className="text-sm text-gray-600 font-medium">
                    Click to upload document
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS, PPT (max 25MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                External Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData({ ...formData, externalLink: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm placeholder:text-gray-400 font-mono transition-all"
                placeholder="https://example.com/research-paper"
              />
            </div>
          )}

          {/* Rich Text Editor */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Sparkles size={16} className="text-purple-600" />
              Description
              <span className="text-red-500">*</span>
            </label>
            {/* Enhanced Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
              {/* Text Formatting */}
              <div className="flex items-center gap-0.5 pr-2 border-r border-gray-300">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive("bold")
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Bold (Ctrl+B)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive("italic")
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Italic (Ctrl+I)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive("underline")
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Underline (Ctrl+U)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
                  </svg>
                </button>
              </div>

              {/* Headings */}
              <div className="flex items-center gap-0.5 px-2 border-r border-gray-300">
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Heading 3"
                >
                  H3
                </button>
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-0.5 px-2 border-r border-gray-300">
                <button
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive({ textAlign: "left" })
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive({ textAlign: "right" })
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Align Right"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center gap-0.5 px-2 border-r border-gray-300">
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive("bulletList")
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition-all ${
                    editor.isActive("orderedList")
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  type="button"
                  title="Numbered List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                    <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041z"/>
                  </svg>
                </button>
              </div>

              {/* Undo/Redo */}
              <div className="flex items-center gap-0.5 px-2">
                <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  type="button"
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                  </svg>
                </button>
                <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  type="button"
                  title="Redo (Ctrl+Y)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="min-h-[300px] max-h-[400px] overflow-y-auto border border-gray-200 rounded-b-lg">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <TagIcon size={14} className="text-purple-600" />
              Tags
              <span className="text-xs font-normal text-gray-500">(max 10)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-purple-900 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm placeholder:text-gray-400 transition-all"
                placeholder="Add a tag..."
                disabled={tags.length >= 10}
              />
              <button
                onClick={handleAddTag}
                disabled={tags.length >= 10}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-gray-700 text-sm font-semibold hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {saveStatus === "success" && (
              <span className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <CheckCircle size={18} />
                Saved!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                <AlertCircle size={18} />
                Failed
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md transition-all"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Save Item
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Selection Modal */}
      {selectionModalOpen && imageToCrop && tempImageFile && (
        <ImageSelectionModal
          imageFile={tempImageFile}
          imageUrl={imageToCrop}
          onAddDirectly={handleAddDirectly}
          onCropComplete={handleCropComplete}
          onCancel={handleSelectionCancel}
          type="featured"
        />
      )}

      {/* Editor Styles - FIXED PLACEHOLDER */}
      <style jsx global>{`
        /* Fix placeholder visibility */
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .ProseMirror p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
}