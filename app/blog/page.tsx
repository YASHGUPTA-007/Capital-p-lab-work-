// app/blog/page.tsx
import React from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Metadata } from "next";
import BlogClientPage from "./BlogclientPage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  createdAt: string; // Changed to string for serialization
  publishedAt?: string; // Changed to string for serialization
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Insights & Research Blog | Evidence-Based Analysis",
  description: "Explore evidence-based analysis on sustainability, policy, and social impact. Latest research, insights, and thought leadership.",
  keywords: ["sustainability", "social impact", "policy", "research", "insights", "blog"],
  authors: [{ name: "Capital P" }],
  openGraph: {
    title: "Insights & Research Blog",
    description: "Evidence-based analysis on sustainability and social impact",
    type: "website",
    url: "https://www.capitalp.org/blog",
    images: [
      {
        url: "/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Blog Insights"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Research Blog",
    description: "Evidence-based analysis on sustainability and social impact",
    images: ["/og-blog.png"],
  },
  alternates: {
    canonical: "https://www.capitalp.org/blog"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Fetch posts on server side and serialize data
async function getPosts(): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, "blog-posts"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const postsData: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Serialize Firestore Timestamps to ISO strings
      postsData.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || '',
        category: data.category || '',
        tags: data.tags || [],
        featuredImage: data.featuredImage || '',
        status: data.status || 'published',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    return postsData;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Server Component
export default async function BlogPage() {
  const posts = await getPosts();
  
  // Extract unique categories
  const categoriesSet = new Set<string>();
  posts.forEach(post => {
    if (post.category) {
      categoriesSet.add(post.category);
    }
  });
  const categories = ["All", ...Array.from(categoriesSet).sort()];

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Insights & Research Blog",
    "description": "Evidence-based analysis on sustainability and social impact",
    "url": "https://www.capitalp.org/blog",
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.featuredImage || "https://www.capitalp.org/logo.png",
      "datePublished": post.publishedAt,
      "author": {
        "@type": post.author && post.author.trim() !== "" ? "Person" : "Organization",
        "name": post.author && post.author.trim() !== "" ? post.author : "Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Capital P",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.capitalp.org/logo.png"
        }
      },
      "url": `https://www.capitalp.org/blog/${post.slug}`,
      "keywords": post.tags?.join(", ") || ""
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Client Component with server-fetched data */}
      <BlogClientPage initialPosts={posts} initialCategories={categories} />
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60;  