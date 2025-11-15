import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.' },
        { status: 500 }
      );
    }

    // Verify API key or admin authentication here if needed
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tripeloo/destinations',
          resource_type: 'image',
          transformation: [
            { width: 1600, height: 900, crop: 'limit', quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve(
              NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
              )
            );
          } else if (result) {
            // Add f_auto,q_auto to the URL for automatic format and quality optimization
            let optimizedUrl = result.secure_url;
            const uploadIndex = optimizedUrl.indexOf('/upload/');
            if (uploadIndex !== -1) {
              const beforeUpload = optimizedUrl.substring(0, uploadIndex + 8);
              const afterUpload = optimizedUrl.substring(uploadIndex + 8);
              // Check if transformations already exist
              if (!afterUpload.includes('/f_auto') && !afterUpload.includes('/q_auto')) {
                optimizedUrl = `${beforeUpload}f_auto,q_auto/${afterUpload}`;
              }
            }
            
            resolve(
              NextResponse.json({
                url: optimizedUrl,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
              })
            );
          } else {
            resolve(
              NextResponse.json(
                { error: 'Upload failed: No result returned' },
                { status: 500 }
              )
            );
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

