// app/blog/[slug]/page.tsx
import React from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

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

// Generate static params for all blog posts (SSG)
export async function generateStaticParams() {
  try {
    const q = query(
      collection(db, 'blog-posts'),
      where('status', '==', 'published')
    );
    
    const querySnapshot = await getDocs(q);
    const slugs = querySnapshot.docs.map(doc => ({
      slug: doc.data().slug
    }));
    
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Fetch post data and serialize
async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(
      collection(db, 'blog-posts'),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const data = querySnapshot.docs[0].data();
    
    // Serialize Firestore Timestamps to ISO strings
    return {
      id: querySnapshot.docs[0].id,
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
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch related posts and serialize
async function getRelatedPosts(category: string, currentPostId: string): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, 'blog-posts'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentPostId) {
        const data = doc.data();
        
        // Serialize Firestore Timestamps to ISO strings
        posts.push({
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
      }
    });
    
    return posts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Insights & Research`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || '',
    authors: post.author && post.author.trim() !== '' 
      ? [{ name: post.author }] 
      : [{ name: 'Editorial Team' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.createdAt,
      authors: post.author && post.author.trim() !== '' ? [post.author] : ['Editorial Team'],
      tags: post.tags || [],
      url: `https://www.capitalp.org/blog/${post.slug}`,
      images: [
        {
          url: post.featuredImage || 'https://www.capitalp.org/logo.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || 'https://www.capitalp.org/logo.png'],
    },
    alternates: {
      canonical: `https://www.capitalp.org/blog/${post.slug}`
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
}

// Server Component
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id);
  
  // Calculate reading time
  const text = post.content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage || "https://www.capitalp.org/logo.png",
    "datePublished": post.publishedAt,
    "dateModified": post.createdAt,
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
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.capitalp.org/blog/${post.slug}`
    },
    "keywords": post.tags?.join(", ") || "",
    "articleSection": post.category,
    "wordCount": words,
    "timeRequired": `PT${readingTime}M`
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.capitalp.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.capitalp.org/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.capitalp.org/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Client Component with server-fetched data */}
      <BlogPostClient 
        post={post} 
        relatedPosts={relatedPosts}
        readingTime={readingTime}
      />
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidate every hour