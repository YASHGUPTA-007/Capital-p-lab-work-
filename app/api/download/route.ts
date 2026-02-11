import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename') || 'document';

  if (!url) {
    return NextResponse.json({ error: 'No URL' }, { status: 400 });
  }

  console.log('📥 Fetching:', url);

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error('❌ Status:', res.status);
      return NextResponse.json({ error: `File not found: ${res.status}` }, { status: res.status });
    }

    // ✅ Get actual blob, don't convert to arrayBuffer
    const blob = await res.blob();
    
    // ✅ Use Cloudinary's content type
    const contentType = res.headers.get('Content-Type') || 'application/octet-stream';
    
    // ✅ Don't add extension if filename already has one
    const finalFilename = filename.includes('.') ? filename : `${filename}.pdf`;
    
    console.log('✅ Downloaded:', blob.size, 'bytes', contentType);

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Content-Length': blob.size.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}