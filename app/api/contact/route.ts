// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Save to Firestore
    const contactRef = collection(db, 'contacts');
    const docRef = await addDoc(contactRef, {
      name,
      email,
      subject,
      message,
      createdAt: serverTimestamp(),
      status: 'new', // new, read, archived
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: docRef.id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}