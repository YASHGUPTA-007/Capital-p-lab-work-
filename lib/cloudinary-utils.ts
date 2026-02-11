// lib/cloudinary-utils.ts

/**
 * Extract Cloudinary public_id from URL
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
    const match = cloudinaryUrl.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

/**
 * Extract all Cloudinary image URLs from HTML content
 */
export function extractImagesFromHTML(html: string): string[] {
  const cloudinaryUrls: string[] = [];
  const regex = /https?:\/\/res\.cloudinary\.com\/[^"'\s]+/g;
  const matches = html.match(regex);
  
  if (matches) {
    matches.forEach(url => {
      if (!cloudinaryUrls.includes(url)) {
        cloudinaryUrls.push(url);
      }
    });
  }
  
  return cloudinaryUrls;
}

/**
 * Delete single image from Cloudinary via API route
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<boolean> {
  try {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
      console.error('Could not extract public_id from URL:', imageUrl);
      return false;
    }

    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to delete image:', data.error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteCloudinaryImages(imageUrls: string[]): Promise<{
  successful: string[];
  failed: string[];
}> {
  const results = {
    successful: [] as string[],
    failed: [] as string[]
  };

  for (const url of imageUrls) {
    const success = await deleteCloudinaryImage(url);
    if (success) {
      results.successful.push(url);
    } else {
      results.failed.push(url);
    }
  }

  return results;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blog_images');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Failed to upload image');
  const data = await response.json();
  return data.secure_url;
}

/**
 * Get download URL with fl_attachment flag to force download
 * ✅ Uses URL parameter for raw files (documents)
 * 
 * @param cloudinaryUrl - Original Cloudinary URL
 * @returns URL with fl_attachment parameter
 */
export function getDownloadUrl(cloudinaryUrl: string): string {
  try {
    const url = new URL(cloudinaryUrl);
    
    // ✅ Add both fl_attachment flag AND Content-Disposition header request
    url.searchParams.set('fl_attachment', '');
    url.searchParams.set('attachment', ''); // Additional browser hint
    
    return url.toString();
  } catch (error) {
    console.error('Error generating download URL:', error);
    return cloudinaryUrl;
  }
}
/**
 * Convert blob URL to File
 */
export async function blobUrlToFile(blobUrl: string, fileName: string): Promise<File> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}