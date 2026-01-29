// ImageCropModal-FAST.tsx
// ⚡ High-Performance Image Crop Component
'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCw, Maximize2, Check, Crop as CropIcon, Loader2 } from 'lucide-react';

interface ImageCropModalProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  defaultAspectRatio?: number;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null, desc: 'Any size' },
  { label: '16:9', value: 16 / 9, desc: 'Landscape' },
  { label: '4:3', value: 4 / 3, desc: 'Classic' },
  { label: '1:1', value: 1, desc: 'Square' },
  { label: '3:4', value: 3 / 4, desc: 'Portrait' },
  { label: '9:16', value: 9 / 16, desc: 'Story' },
];

export default function ImageCropModal({
  imageUrl,
  onCropComplete,
  onCancel,
  defaultAspectRatio
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(
    defaultAspectRatio ?? null
  );
  
  // ⚡ Processing state for instant feedback
  const [isProcessing, setIsProcessing] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const processingRef = useRef(false); // Prevent double-processing

  useEffect(() => {
    if (selectedAspectRatio !== null) {
      const newCrop: Crop = {
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
      };
      
      if (selectedAspectRatio > 1) {
        newCrop.height = newCrop.width / selectedAspectRatio;
      } else if (selectedAspectRatio < 1) {
        newCrop.width = newCrop.height * selectedAspectRatio;
      }
      
      newCrop.x = (100 - newCrop.width) / 2;
      newCrop.y = (100 - newCrop.height) / 2;
      
      setCrop(newCrop);
    }
  }, [selectedAspectRatio]);

  // ⚡ OPTIMIZED: Non-blocking, fast image processing
  const handleCropComplete = async () => {
    // Validation
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    // Prevent double-clicks
    if (processingRef.current) {
      return;
    }

    // 🚀 INSTANT UI feedback
    processingRef.current = true;
    setIsProcessing(true);

    // Use requestAnimationFrame to prevent UI blocking
    requestAnimationFrame(async () => {
      try {
        const image = imgRef.current!;
        const canvas = previewCanvasRef.current!;
        const crop = completedCrop;

        // Calculate scale factors
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // ⚡ Performance: Optimized context settings
        const ctx = canvas.getContext('2d', { 
          willReadFrequently: false,
          alpha: false // Faster for JPEG output
        });

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // ⚡ Performance: Cap pixel ratio at 2 to prevent huge canvases
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        // Calculate output dimensions
        const outputWidth = crop.width * scaleX;
        const outputHeight = crop.height * scaleY;

        // ⚡ Performance: Limit max dimensions to prevent memory issues
        const MAX_DIMENSION = 3000;
        let scale = 1;
        if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
          scale = Math.min(MAX_DIMENSION / outputWidth, MAX_DIMENSION / outputHeight);
        }

        // Set canvas size
        canvas.width = outputWidth * pixelRatio * scale;
        canvas.height = outputHeight * pixelRatio * scale;

        // Configure context for quality
        ctx.setTransform(pixelRatio * scale, 0, 0, pixelRatio * scale, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Handle rotation if needed
        if (rotation !== 0) {
          const centerX = outputWidth / 2;
          const centerY = outputHeight / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
        }

        // Draw the cropped image
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          outputWidth,
          outputHeight,
          0,
          0,
          outputWidth,
          outputHeight
        );

        // ⚡ Convert to blob with optimized quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('Failed to create blob');
              setIsProcessing(false);
              processingRef.current = false;
              alert('Failed to process image. Please try again.');
              return;
            }

            // Create URL and pass to parent
            const croppedUrl = URL.createObjectURL(blob);
            
            // Let parent handle the upload
            onCropComplete(croppedUrl);
            
            // Note: Don't reset processing state here - parent will close modal
          },
          'image/jpeg',
          0.90 // Balanced quality/speed (90% is plenty good for web)
        );

      } catch (error) {
        console.error('Error processing crop:', error);
        alert('Failed to process image. Please try again.');
        setIsProcessing(false);
        processingRef.current = false;
      }
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitImage = () => {
    const newCrop: Crop = {
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    };
    
    if (selectedAspectRatio !== null) {
      if (selectedAspectRatio > 1) {
        newCrop.height = newCrop.width / selectedAspectRatio;
      } else if (selectedAspectRatio < 1) {
        newCrop.width = newCrop.height * selectedAspectRatio;
      }
      newCrop.x = (100 - newCrop.width) / 2;
      newCrop.y = (100 - newCrop.height) / 2;
    }
    
    setCrop(newCrop);
  };

  const handleAspectRatioChange = (ratio: number | null) => {
    setSelectedAspectRatio(ratio);
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      
      {/* ⚡ Processing Overlay - Shows immediately */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] pointer-events-none">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm animate-in zoom-in duration-200">
            <Loader2 className="w-16 h-16 text-[#755eb1] animate-spin" />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 mb-2">Processing Image...</p>
              <p className="text-sm text-gray-600">This will only take a moment</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <CropIcon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Crop Image</h3>
              <p className="text-xs text-gray-500">Adjust and crop your image</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Image Area */}
          <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
            <div className="relative max-w-full max-h-full">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={selectedAspectRatio ?? undefined}
                className="max-w-full"
                disabled={isProcessing}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop preview"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    maxHeight: 'calc(95vh - 200px)',
                    maxWidth: '100%',
                    opacity: isProcessing ? 0.5 : 1,
                    pointerEvents: isProcessing ? 'none' : 'auto',
                    transition: 'opacity 0.2s'
                  }}
                  className="rounded-lg shadow-xl"
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
            
            {/* Aspect Ratios */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <label className="text-sm font-bold text-gray-900 mb-4 block">Aspect Ratio</label>
              <div className="space-y-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => handleAspectRatioChange(ratio.value)}
                    disabled={isProcessing}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 border-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedAspectRatio === ratio.value
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold text-sm ${
                          selectedAspectRatio === ratio.value ? 'text-white' : 'text-gray-900'
                        }`}>
                          {ratio.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          selectedAspectRatio === ratio.value ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {ratio.desc}
                        </div>
                      </div>
                      {selectedAspectRatio === ratio.value && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <label className="text-sm font-bold text-gray-900 mb-4 block">Tools</label>
              <div className="space-y-2">
                <button
                  onClick={handleRotate}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCw size={18} />
                  <span>Rotate 90°</span>
                </button>
                <button
                  onClick={handleFitImage}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Maximize2 size={18} />
                  <span>Fit to View</span>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex-1 flex flex-col justify-end">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Crop Size</span>
                  {completedCrop && (
                    <span className="text-gray-900 font-bold">
                      {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Rotation</span>
                  <span className="text-gray-900 font-bold">{rotation}°</span>
                </div>
                {selectedAspectRatio !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Ratio</span>
                    <span className="text-gray-900 font-bold">
                      {ASPECT_RATIOS.find(r => r.value === selectedAspectRatio)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-gray-500 space-y-1">
            <div>💡 Drag to select area</div>
            <div>📐 Resize with corners</div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-semibold rounded-xl transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              disabled={isProcessing || !completedCrop}
              className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Apply Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}