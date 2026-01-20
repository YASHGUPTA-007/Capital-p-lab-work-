import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Verify credentials
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary credentials');
      return NextResponse.json(
        { success: false, error: 'Cloudinary not configured' },
        { status: 500 }
      );
    }

    console.log('🗑️  Deleting image with public_id:', publicId);

    // ✅ Use Admin API instead of uploader.destroy
    const result = await cloudinary.api.delete_resources([publicId], {
      type: 'upload',
      resource_type: 'image'
    });

    console.log('📡 Cloudinary response:', result);

    // Admin API returns different structure
    if (result.deleted && result.deleted[publicId]) {
      const status = result.deleted[publicId];
      
      if (status === 'deleted') {
        console.log('✅ Image deleted successfully');
        return NextResponse.json({ 
          success: true, 
          message: 'Image deleted successfully',
        });
      } else if (status === 'not_found') {
        console.log('ℹ️  Image not found (already deleted)');
        return NextResponse.json({ 
          success: true, 
          message: 'Image not found (already deleted)',
        });
      }
    }

    // If we get here, something unexpected happened
    console.error('❌ Unexpected response:', result);
    return NextResponse.json(
      { success: false, error: 'Unexpected response from Cloudinary', details: result },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('❌ Error deleting from Cloudinary:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete image',
        details: error.error?.message || error.toString()
      },
      { status: 500 }
    );
  }
}