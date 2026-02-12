// app/research/[slug]/page.tsx
import React from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ResearchItem } from "@/types/research";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ResearchDetailClient from "./ResearchDetailClient";
import CommentSection from "../Components/CommentSection";

// Generate metadata for SEO - PARAMS IS NOW A PROMISE
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params; // ✅ AWAIT THE PARAMS
  const item = await getResearchItem(slug);

  if (!item) {
    return {
      title: "Research Not Found",
    };
  }

  const description = item.description.replace(/<[^>]*>/g, "").substring(0, 160);

  return {
    title: `${item.title} | Research`,
    description,
    keywords: item.tags.join(", "),
    authors: [{ name: item.author }],
    openGraph: {
      title: item.title,
      description,
      type: "article",
      images: [item.coverImage],
      url: `https://www.capitalp.org/research/${item.slug}`,
    },
    alternates: {
      canonical: `https://www.capitalp.org/research/${item.slug}`
    },
  };
}

// Fetch research item by slug
async function getResearchItem(slug: string): Promise<ResearchItem | null> {
  try {
    console.log("🔍 Searching for slug:", slug);

    // Query with just slug (no status filter due to Firestore rules)
    const q = query(
      collection(db, "research-items"),
      where("slug", "==", slug)
    );

    const snapshot = await getDocs(q);

    console.log("📊 Query results:", {
      empty: snapshot.empty,
      size: snapshot.size,
      slug: slug
    });

    if (snapshot.empty) {
      console.log("❌ No documents found with slug:", slug);
      
      // Debug: Get all documents to see what slugs exist
      const allDocs = await getDocs(collection(db, "research-items"));
      console.log("📋 All available slugs:");
      allDocs.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${data.slug} (status: ${data.status})`);
      });
      
      return null;
    }

    const docSnapshot = snapshot.docs[0];
    const data = docSnapshot.data();

    console.log("✅ Found document:", {
      id: docSnapshot.id,
      title: data.title,
      slug: data.slug,
      status: data.status
    });

    // Check if published
    if (data.status !== "published") {
      console.log("⚠️ Document found but not published");
      return null;
    }

    return {
      id: docSnapshot.id,
      title: data.title || '',
      slug: data.slug || '',
      category: data.category || 'Environment',
      description: data.description || '',
      coverImage: data.coverImage || '',
      coverImageAlt: data.coverImageAlt || '',
      coverImageName: data.coverImageName || '',
      type: data.type || 'document',
      documentUrl: data.documentUrl || '',
      documentName: data.documentName || '',
      documentSize: data.documentSize || '',
      externalLink: data.externalLink || '',
      author: data.author || '',
      readTime: data.readTime || '5 min',
      tags: data.tags || [],
      status: data.status || 'published',
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      publishedAt: data.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      downloads: data.downloads || 0,
      views: data.views || 0,
       likes: data.likes || 0,
    } as ResearchItem;
  } catch (error) {
    console.error("❌ Error fetching research item:", error);
    return null;
  }
}

// Main page component - PARAMS IS NOW A PROMISE
export default async function ResearchDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; // ✅ AWAIT THE PARAMS
  const item = await getResearchItem(slug);

  if (!item) {
    console.log("🚫 Item not found, showing 404");
    notFound();
  }

  console.log("✅ Rendering page for:", item.title);
  return (
    <>
      <ResearchDetailClient item={item} />
      <CommentSection researchId={item.id} />
    </>
  );
}