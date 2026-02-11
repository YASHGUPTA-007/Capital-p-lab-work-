// types/research.ts

export interface ResearchItem {
  id: string;
  title: string;
  slug: string;
  category: string; // ✅ Changed from union to string to allow custom categories
  description: string; // TipTap HTML content
  coverImage: string;
  coverImageAlt?: string;
  coverImageName?: string;
  
  // Document or Link
  type: 'document' | 'link';
  documentUrl?: string; // Cloudinary URL for uploaded file
  documentName?: string; // Original filename
  documentSize?: string; // e.g., "2.4 MB"
  externalLink?: string; // For type='link'
  
  // Metadata
  author: string;
  readTime: string; // e.g., "12 min"
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