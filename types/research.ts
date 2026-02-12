// types/research.ts

import { Timestamp } from "firebase/firestore";

export interface ResearchItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  coverImageAlt?: string;
  coverImageName?: string;
  
  // Document or Link
  type: 'document' | 'link';
  documentUrl?: string;
  documentName?: string;
  documentSize?: string;
  externalLink?: string;
  
  // Metadata
  author: string;
  readTime: string;
  tags: string[];
  
  // Status
  status: 'draft' | 'published';
  
  // Timestamps
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
  
  // Stats
  downloads?: number;
  views?: number;
  likes?: number; // ✅ Added this property
}

export interface ResearchLead {
  id: string;
  researchId: string;
  researchTitle: string;
  
  // Lead info
  name: string;
  email: string;
  organization?: string;
  purpose?: string;
  
  // Metadata
  createdAt: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface ResearchComment {
  id: string;
  researchId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  ipAddress: string;
  userAgent: string;
}