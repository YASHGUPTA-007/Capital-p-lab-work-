// ImageSelectionModal.tsx
'use client';

import { useState } from 'react';
import { Crop, Image as ImageIcon, Zap, X } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

interface ImageSelectionModalProps {
  imageFile: File;
  imageUrl: string;
  onAddDirectly: (imageUrl: string) => void;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  defaultAspectRatio?: number;
  type: 'featured' | 'editor';
}

export default function ImageSelectionModal({
  imageFile,
  imageUrl,
  onAddDirectly,
  onCropComplete,
  onCancel,
  defaultAspectRatio,
  type
}: ImageSelectionModalProps) {
  const [showCropModal, setShowCropModal] = useState(false);

  const handleAddDirectly = () => {
    onAddDirectly(imageUrl);
  };

  const handleCropClick = () => {
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedUrl: string) => {
    setShowCropModal(false);
    onCropComplete(croppedUrl);
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
              <p className="text-[10px] text-gray-500">Choose how to add</p>
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

        {/* Horizontal Layout: Image Left, Options Right */}
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

          {/* Right: Options */}
          <div className="w-1/2 p-4 flex flex-col">
            
            {/* File Info */}
            <div className="mb-4 bg-blue-50 rounded-lg p-2.5 flex items-center gap-2">
              <ImageIcon size={13} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-[11px]">{imageFile.name}</p>
                <p className="text-gray-600 text-[10px]">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 flex flex-col gap-3">
              
              {/* Add Directly Option */}
              <button
                onClick={handleAddDirectly}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 rounded-lg p-3 transition-all duration-200 text-left hover:shadow-md flex-1"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Zap size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                      Add Directly
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-green-500 text-white rounded-full">FAST</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Upload as-is without modifications
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-medium">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Instant upload</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Crop Image Option */}
              <button
                onClick={handleCropClick}
                className="group bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-3 transition-all duration-200 text-left hover:shadow-md flex-1"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Crop size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                      Crop Image
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-purple-500 text-white rounded-full">PRO</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Adjust size, crop & rotate
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-purple-700">
                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                        <span>Crop & resize</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-purple-700">
                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                        <span>Aspect ratios</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
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