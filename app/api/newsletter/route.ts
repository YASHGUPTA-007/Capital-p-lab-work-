// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const subscribersRef = collection(db, 'newsletter-subscribers');
    const emailQuery = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const existingSubscribers = await getDocs(emailQuery);

    if (!existingSubscribers.empty) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Save to Firestore
    const docRef = await addDoc(subscribersRef, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subscribedAt: serverTimestamp(),
      status: 'active',
      source: 'website',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        id: docRef.id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}