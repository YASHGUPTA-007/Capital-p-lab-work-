// lib/blog-deletion-utils.ts
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteCloudinaryImage, extractImagesFromHTML } from './cloudinary-utils';

export async function deleteBlogWithImages(blogId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // First, fetch the blog post to get all images
    const blogRef = doc(db, 'blog-posts', blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (!blogSnap.exists()) {
      return { success: false, error: 'Blog post not found' };
    }

    const blogData = blogSnap.data();
    const imagesToDelete: string[] = [];

    // Add featured image if exists
    if (blogData.featuredImage) {
      imagesToDelete.push(blogData.featuredImage);
    }

    // Extract and add all content images
    if (blogData.content) {
      const contentImages = extractImagesFromHTML(blogData.content);
      imagesToDelete.push(...contentImages);
    }

    // Delete all images from Cloudinary
    const deleteResults = await Promise.allSettled(
      imagesToDelete.map(imageUrl => deleteCloudinaryImage(imageUrl))
    );

    // Log any failed deletions
    deleteResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to delete image ${imagesToDelete[index]}:`, result.reason);
      }
    });

    // Delete the blog post from Firestore
    await deleteDoc(blogRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting blog with images:', error);
    return { success: false, error: error.message };
  }
}