import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, limit as firestoreLimit } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageLimit = parseInt(searchParams.get('limit') || '5');

    const commentsRef = collection(db, 'comments');
    
    // Simplified query - fetch all approved comments for this blog
    const q = query(
      commentsRef,
      where('blogId', '==', blogId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    // Get all comments
    const allComments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    // Manual pagination
    const total = allComments.length;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedComments = allComments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      comments: paginatedComments,
      total,
      page,
      totalPages: Math.ceil(total / pageLimit),
    });

  } catch (error: any) {
    console.error('Error fetching comments:', error);
    
    // Check if it's a missing index error
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      return NextResponse.json(
        { 
          error: 'Database index required. Please create the index in Firebase Console.',
          indexUrl: error.message?.match(/https:\/\/[^\s]+/)?.[0]
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}
