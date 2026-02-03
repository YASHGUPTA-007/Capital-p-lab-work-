// app/admin/_Components/ImageSelectionModal.tsx
"use client";

import { useState } from "react";
import { Crop, Image as ImageIcon, Zap, X } from "lucide-react";
import ImageCropModal from "./ImageCropModal";

interface ImageSelectionModalProps {
  imageFile: File;
  imageUrl: string;
  onAddDirectly: (imageUrl: string, metadata: ImageMetadata) => void;
  onCropComplete: (croppedImageUrl: string, metadata: ImageMetadata) => void;
  onCancel: () => void;
  defaultAspectRatio?: number;
  type: "featured" | "editor";
}

export interface ImageMetadata {
  name: string;
  altText: string;
}

export default function ImageSelectionModal({
  imageFile,
  imageUrl,
  onAddDirectly,
  onCropComplete,
  onCancel,
  defaultAspectRatio,
  type,
}: ImageSelectionModalProps) {
  const [showCropModal, setShowCropModal] = useState(false);

  // Image metadata state
  const [imageName, setImageName] = useState(
    imageFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
  );
  const [altText, setAltText] = useState("");

  const handleAddDirectly = () => {
    if (!altText.trim()) {
      alert("⚠️ Alt text is required for accessibility and SEO");
      return;
    }

    const metadata: ImageMetadata = {
      name: imageName.trim() || imageFile.name,
      altText: altText.trim(),
    };

    onAddDirectly(imageUrl, metadata);
  };

  const handleCropClick = () => {
    if (!altText.trim()) {
      alert("⚠️ Alt text is required for accessibility and SEO");
      return;
    }
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedUrl: string) => {
    setShowCropModal(false);

    const metadata: ImageMetadata = {
      name: imageName.trim() || imageFile.name,
      altText: altText.trim(),
    };

    onCropComplete(croppedUrl, metadata);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
  };

  if (showCropModal) {
    return (
      <ImageCropModal
        imageUrl={imageUrl}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        defaultAspectRatio={defaultAspectRatio}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center">
              <ImageIcon size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Add Image</h3>
              <p className="text-[10px] text-gray-500">
                Add details and choose upload method
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Horizontal Layout */}
        <div className="flex">
          {/* Left: Image Preview */}
          <div className="w-1/2 bg-gray-50 p-4 border-r border-gray-200">
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-white h-full flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[300px] object-contain"
              />
            </div>
          </div>

          {/* Right: Metadata + Options */}
          <div className="w-1/2 p-4 flex flex-col">
            {/* File Info */}
            <div className="mb-3 bg-blue-50 rounded-lg p-2.5 flex items-center gap-2">
              <ImageIcon size={13} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-[11px]">
                  {imageFile.name}
                </p>
                <p className="text-gray-600 text-[10px]">
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Metadata Form */}
            <div className="mb-4 space-y-3 pb-4 border-b border-gray-200">
              <div>
                <label
                  htmlFor="image-name"
                  className="block text-xs font-bold text-gray-700 mb-1.5"
                >
                  Image Name{" "}
                  <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  id="image-name"
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent text-gray-900"
                  placeholder="My awesome image"
                />
              </div>

              <div>
                <label
                  htmlFor="alt-text"
                  className="block text-xs font-bold text-gray-700 mb-1.5"
                >
                  Alt Text <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-1">
                    (for accessibility & SEO)
                  </span>
                </label>
                <textarea
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent resize-none text-gray-900"
                  placeholder="Describe what's in the image for screen readers..."
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-gray-500">
                    {altText.length}/150 characters
                  </p>
                  {altText.length > 150 && (
                    <p className="text-[10px] text-amber-600 font-medium">
                      ⚠️ Keep it concise
                    </p>
                  )}
                </div>
              </div>

              {/* Alt Text Guidelines */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                <p className="text-[10px] font-bold text-purple-900 mb-1">
                  💡 Alt Text Tips:
                </p>
                <ul className="text-[9px] text-purple-800 space-y-0.5 list-disc list-inside">
                  <li>Describe what you see, not "image of"</li>
                  <li>Be specific and concise</li>
                  <li>Skip decorative details</li>
                </ul>
              </div>
            </div>

            {/* Upload Options */}
            <div className="flex-1 flex flex-col gap-2">
              {/* Add Directly */}
              <button
                onClick={handleAddDirectly}
                disabled={!altText.trim()}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 rounded-lg p-2.5 transition-all duration-200 text-left hover:shadow-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900 mb-0.5 flex items-center gap-1.5">
                      Add Directly
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-green-500 text-white rounded-full">
                        FAST
                      </span>
                    </h4>
                    <p className="text-[10px] text-gray-600">
                      Upload as-is without modifications
                    </p>
                  </div>
                </div>
              </button>

              {/* Crop Image */}
              <button
                onClick={handleCropClick}
                disabled={!altText.trim()}
                className="group bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-2.5 transition-all duration-200 text-left hover:shadow-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Crop size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900 mb-0.5 flex items-center gap-1.5">
                      Crop Image
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-purple-500 text-white rounded-full">
                        PRO
                      </span>
                    </h4>
                    <p className="text-[10px] text-gray-600">
                      Adjust size, crop & rotate
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-[10px] text-gray-500">
                Max: <span className="font-semibold">5 MB</span>
              </p>
              <button
                onClick={onCancel}
                className="px-2.5 py-1 text-[11px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
