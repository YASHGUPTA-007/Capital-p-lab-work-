// lib/blogUtils.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Make sure this path matches your firebase config

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
};

export const ensureUniqueSlug = async (slug: string, currentId?: string): Promise<string> => {
  let uniqueSlug = slug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    // Check if slug exists
    const q = query(collection(db, "blog-posts"), where("slug", "==", uniqueSlug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      isUnique = true;
    } else {
      // If found, check if it belongs to the current document (editing)
      if (currentId && snapshot.docs[0].id === currentId) {
        isUnique = true;
      } else {
        // If not, append a counter and try again
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
    }
  }

  return uniqueSlug;
};

export const calculateReadingTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};