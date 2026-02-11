// app/research/page.tsx
import React from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ResearchItem } from "@/types/research";
import { Metadata } from "next";
import ResearchClientPage from "./ResearchClientPage";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Research & Insights | Evidence-Based Analysis",
  description: "Access evidence-based research on sustainability, policy, and social impact. Download documents and resources.",
  keywords: ["research", "sustainability", "policy", "social impact", "evidence-based"],
  authors: [{ name: "Capital P" }],
  openGraph: {
    title: "Research & Insights",
    description: "Evidence-based research on sustainability and social impact",
    type: "website",
    url: "https://www.capitalp.org/research",
  },
  alternates: {
    canonical: "https://www.capitalp.org/research"
  },
};

// Fetch research items on server side
async function getResearchItems(): Promise<ResearchItem[]> {
  try {
    const q = query(
      collection(db, "research-items"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc")
    );

    const snapshot = await getDocs(q);
    const items: ResearchItem[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
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
      } as ResearchItem);
    });

    return items;
  } catch (error) {
    console.error("Error fetching research items:", error);
    return [];
  }
}

export default async function ResearchPage() {
  const items = await getResearchItems();
  
  return <ResearchClientPage initialItems={items} />;
}