import { MetadataRoute } from 'next'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.capitalp.org'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, // Increased slightly since it's a main section
    },
  ]

  try {
    const q = query(
      collection(db, "blog-posts"), 
      where("status", "==", "published"),
      orderBy("publishedAt", "desc") // Add ordering for consistency
    );
    
    const querySnapshot = await getDocs(q);
    const blogRoutes: MetadataRoute.Sitemap = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.slug) {
        blogRoutes.push({
          url: `${baseUrl}/blog/${data.slug}`,
          lastModified: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8, // Slightly higher priority for individual posts
        });
      }
    });

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes even if blog fetch fails
    return staticRoutes;
  }
}

// Enable caching for sitemap (Next.js 14+)
export const revalidate = 3600; // Revalidate every hour