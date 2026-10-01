import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings, { DEFAULT_RESUME_URL } from '@/models/Settings';
import { getCurrentAdmin } from '@/lib/auth';

/**
 * GET: Retrieve site settings (e.g. dynamic resume link)
 */
export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({ key: 'site_settings' }).lean();

    if (!settings) {
      settings = {
        key: 'site_settings',
        resumeUrl: DEFAULT_RESUME_URL,
      };
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Failed to fetch settings from MongoDB:', error.message);
    // Return fallback settings gracefully
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        data: {
          key: 'site_settings',
          resumeUrl: DEFAULT_RESUME_URL,
        },
      },
      { status: 200 }
    );
  }
}

/**
 * POST / PUT: Update site settings (Admin Only)
 */
async function handleUpdateSettings(request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Only the authorized administrator can update settings.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resumeUrl } = body;

    if (!resumeUrl || typeof resumeUrl !== 'string' || !resumeUrl.trim()) {
      return NextResponse.json(
        { error: 'A valid resume URL is required.' },
        { status: 400 }
      );
    }

    const cleanUrl = resumeUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Resume URL must start with http:// or https://' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Settings.findOneAndUpdate(
      { key: 'site_settings' },
      { $set: { resumeUrl: cleanUrl } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Resume link updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating settings in MongoDB:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return handleUpdateSettings(request);
}

export async function PUT(request) {
  return handleUpdateSettings(request);
}
