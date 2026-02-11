// lib/research-utils.ts

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Generate slug from title
 */
export function generateResearchSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Ensure slug is unique by checking Firebase
 */
export async function ensureUniqueResearchSlug(
  slug: string,
  currentId?: string
): Promise<string> {
  let uniqueSlug = slug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const q = query(
      collection(db, 'research-items'),
      where('slug', '==', uniqueSlug)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      isUnique = true;
    } else {
      if (currentId && snapshot.docs[0].id === currentId) {
        isUnique = true;
      } else {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
    }
  }

  return uniqueSlug;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate read time from HTML content
 */
export function calculateReadTime(htmlContent: string): string {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min`;
}

/**
 * Upload document to Cloudinary using research_documents preset
 * ✅ Uses /raw/upload endpoint for documents
 */
export async function uploadDocumentToCloudinary(file: File): Promise<{
  url: string;
  size: string;
  name: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'research_documents');
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary not configured');
  }

  console.log('📤 Uploading:', file.name, file.size, 'bytes');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Upload failed:', error);
    throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  
  console.log('✅ Uploaded:', data.secure_url);
  
  return {
    url: data.secure_url,
    size: formatFileSize(data.bytes),
    name: data.original_filename || file.name
  };
}
/**
 * Validate external link format
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Delete document from Cloudinary
 * ✅ Works with raw files (documents)
 */
export async function deleteDocumentFromCloudinary(url: string): Promise<boolean> {
  try {
    // Extract public_id with extension for raw files
    const regex = /\/upload\/(?:v\d+\/)?(.+)$/;
    const match = url.match(regex);
    
    if (!match) {
      console.error('Could not extract public_id from URL:', url);
      return false;
    }
    
    const publicId = match[1];

    const response = await fetch('/api/cloudinary/delete-raw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to delete document:', data.error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}