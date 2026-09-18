import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getCurrentAdmin } from '@/lib/auth';

/**
 * POST: Batch update project indexing / display order (Admin Only)
 * Expected payload: { orderedIds: string[] }
 */
export async function POST(request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Only admin can reorder projects.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload. An array of orderedIds is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Perform atomic bulk write setting order = index + 1 (1-based indexing)
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { id },
        update: { $set: { order: index + 1 } },
      },
    }));

    await Project.bulkWrite(bulkOps);

    // Fetch and return the updated projects in order
    const updatedProjects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      message: `Successfully reordered ${orderedIds.length} projects`,
      data: updatedProjects,
    });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}
