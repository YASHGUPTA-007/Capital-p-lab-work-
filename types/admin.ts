// types/admin.ts
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  createdAt: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscribedAt: any;
  status: string;
  source: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
  views?: number;
  likes?: number; 
}

export interface Comment {
  id: string;
  blogId?: string;
  researchId?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  ipAddress?: string;
  userAgent?: string;
}