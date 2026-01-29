// app/api/blog/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Simple in-memory rate limiter (resets on server restart)
const viewTracker = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const lastView = viewTracker.get(key);
  
  if (lastView && now - lastView < RATE_LIMIT_WINDOW) {
    return true;
  }
  
  viewTracker.set(key, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Rate limiting based on IP + blogId
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const rateLimitKey = `${ip}-${blogId}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { success: true, cached: true },
        { status: 200 }
      );
    }

    // Update view count
    const blogRef = doc(db, 'blog-posts', blogId);
    
    // Check if document exists
    const blogSnap = await getDoc(blogRef);
    if (!blogSnap.exists()) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Initialize views field if it doesn't exist, otherwise increment
    const currentData = blogSnap.data();
    if (typeof currentData.views !== 'number') {
      await setDoc(blogRef, { views: 1 }, { merge: true });
    } else {
      await updateDoc(blogRef, {
        views: increment(1)
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}