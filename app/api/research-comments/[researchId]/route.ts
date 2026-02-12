import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ researchId: string }> }
) {
  try {
    const { researchId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageLimit = parseInt(searchParams.get('limit') || '5');

    const commentsRef = collection(db, 'comments');
    
    const q = query(
      commentsRef,
      where('researchId', '==', researchId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
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
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}