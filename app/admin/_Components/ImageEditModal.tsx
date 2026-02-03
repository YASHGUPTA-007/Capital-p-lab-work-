// app/admin/_Components/ImageEditModal.tsx
'use client';

import { useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

interface ImageEditModalProps {
  imageUrl: string;
  currentAlt: string;
  currentTitle: string;
  onSave: (metadata: { altText: string; title: string }) => void;
  onCancel: () => void;
}

export default function ImageEditModal({
  imageUrl,
  currentAlt,
  currentTitle,
  onSave,
  onCancel,
}: ImageEditModalProps) {
  const [altText, setAltText] = useState(currentAlt);
  const [title, setTitle] = useState(currentTitle);

  const handleSave = () => {
    if (!altText.trim()) {
      alert('⚠️ Alt text is required for accessibility');
      return;
    }

    onSave({
      altText: altText.trim(),
      title: title.trim() || altText.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#755eb1] flex items-center justify-center">
              <ImageIcon size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Image Metadata</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content - Left-Right Layout */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-5 h-full">
            
            {/* Left Side - Image Preview */}
            <div className="flex flex-col gap-4">
              <div className="rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 p-3 flex items-center justify-center min-h-[250px]">
                <img
                  src={imageUrl}
                  alt={currentAlt || 'Preview'}
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-900 mb-1.5">💡 Alt Text Tips:</p>
                <ul className="text-xs text-blue-800 space-y-0.5 list-disc list-inside">
                  <li>Describe content, not "image of"</li>
                  <li>Be specific but concise (≤125 chars)</li>
                  <li>Skip decorative details</li>
                  <li>Focus on key information</li>
                </ul>
              </div>
            </div>

            {/* Right Side - Form Fields */}
            <div className="flex flex-col gap-4">
              
              {/* Alt Text Field */}
              <div>
                <label htmlFor="edit-alt-text" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Alt Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent resize-none text-sm text-gray-900"
                  placeholder="Describe what's in the image for screen readers..."
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {altText.length}/150 characters
                  </p>
                  {!altText.trim() && (
                    <p className="text-xs text-red-600 font-medium">
                      ⚠️ Required
                    </p>
                  )}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Image Title <span className="text-gray-500 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent text-sm text-gray-900"
                  placeholder="Brief title for the image"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 flex-shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!altText.trim()}
            className="px-5 py-2 bg-[#755eb1] hover:bg-[#6b54a5] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}