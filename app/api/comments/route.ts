import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogId, authorName, authorEmail, content } = body;

    if (!blogId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (content.length < 5 || content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 5 and 1000 characters' },
        { status: 400 }
      );
    }

    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      blogId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.toLowerCase().trim(),
      content: content.trim(),
      status: 'pending',
      createdAt: serverTimestamp(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Comment submitted for approval',
        id: docRef.id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error submitting comment:', error);
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}