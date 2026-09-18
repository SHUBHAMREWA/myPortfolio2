import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

      // Attempt server-side compression via sharp if supported on host runtime
      let uploadBuffer = rawBuffer;
      try {
        const sharpModule = await import('sharp');
        const sharp = sharpModule.default || sharpModule;
        uploadBuffer = await sharp(rawBuffer)
          .webp({ quality: 80, effort: 4 })
          .toBuffer();
      } catch (sharpError) {
        // If native sharp binary is missing in host environment (e.g. AWS Lambda / Vercel),
        // Cloudinary handles WebP format conversion and auto-compression natively.
        console.warn('Sharp compression unavailable on runtime, delegating to Cloudinary:', sharpError?.message);
      }

      // Upload to Cloudinary in the "portfoliophoto" folder
      const result = await uploadToCloudinary(uploadBuffer, 'portfoliophoto');
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
      url: uploadResults[0].url,
    });
  } catch (error) {
    console.error('Cloudinary upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
