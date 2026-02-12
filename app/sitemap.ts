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
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  try {
    // Fetch published blog posts
    const blogsQuery = query(
      collection(db, "blog-posts"), 
      where("status", "==", "published"),
      orderBy("publishedAt", "desc") 
    );
    
    const blogsSnapshot = await getDocs(blogsQuery);
    const blogRoutes: MetadataRoute.Sitemap = [];

    blogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.slug) {
        blogRoutes.push({
          url: `${baseUrl}/blogs/${data.slug}`,
          lastModified: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8, 
        });
      }
    });

    // Fetch published research items
    const researchQuery = query(
      collection(db, "research-items"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc")
    );

    const researchSnapshot = await getDocs(researchQuery);
    const researchRoutes: MetadataRoute.Sitemap = [];

    researchSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.slug) {
        researchRoutes.push({
          url: `${baseUrl}/research/${data.slug}`,
          lastModified: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });

    return [...staticRoutes, ...blogRoutes, ...researchRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

export const revalidate = 3600;