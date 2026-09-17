import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error verifying auth session:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
