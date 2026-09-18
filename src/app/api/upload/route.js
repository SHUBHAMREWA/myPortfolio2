import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin login required to upload media.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    const singleFile = formData.get('file');

    const filesToProcess = files.length > 0 ? files : (singleFile ? [singleFile] : []);

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'No files provided for upload' },
        { status: 400 }
      );
    }

    const uploadResults = [];

    for (const file of filesToProcess) {
      if (typeof file === 'string' || !file.name) continue;

      const arrayBuffer = await file.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);

      // 1. Compress & convert to WebP format using sharp (high compression, optimal web delivery)
      const compressedWebpBuffer = await sharp(rawBuffer)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      // 2. Upload compressed WebP to Cloudinary in the "portfoliophoto" folder
      const result = await uploadToCloudinary(compressedWebpBuffer, 'portfoliophoto');
      uploadResults.push({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format || 'webp',
        bytes: result.bytes,
      });
    }

    if (uploadResults.length === 0) {
      return NextResponse.json(
        { error: 'Failed to process any uploaded files' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${uploadResults.length} file(s) converted to WebP and uploaded to portfoliophoto successfully!`,
      files: uploadResults,
      // For single file convenience
      url: uploadResults[0].url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
