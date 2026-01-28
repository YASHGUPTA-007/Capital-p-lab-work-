import { MetadataRoute } from 'next'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.capitalp.org'

  // Static routes (Admin routes excluded as per request)
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
      priority: 0.8,
    },
  ]

  try {
    const q = query(
      collection(db, "blog-posts"), 
      where("status", "==", "published")
    );
    
    const querySnapshot = await getDocs(q);
    const blogRoutes: MetadataRoute.Sitemap = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.slug) {
        blogRoutes.push({
          url: `${baseUrl}/blog/${data.slug}`,
          lastModified: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    });

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}