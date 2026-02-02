import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Add await here

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blogRef = doc(db, 'blog-posts', id);
    
    // Check if blog exists
    const blogSnap = await getDoc(blogRef);
    if (!blogSnap.exists()) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment likes
    await updateDoc(blogRef, {
      likes: increment(1)
    });

    // Get updated likes count
    const updatedSnap = await getDoc(blogRef);
    const updatedLikes = updatedSnap.data()?.likes || 1;

    return NextResponse.json({ 
      success: true,
      likes: updatedLikes 
    });

  } catch (error) {
    console.error('Error incrementing likes:', error);
    return NextResponse.json(
      { error: 'Failed to update likes' },
      { status: 500 }
    );
  }
}