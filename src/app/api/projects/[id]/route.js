import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getCurrentAdmin } from '@/lib/auth';

/**
 * GET: Single project by slug ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const project = await Project.findOne({ id }).lean();
    if (!project) {
      return NextResponse.json(
        { error: `Project not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project by id:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update an existing project (Admin Only)
 */
export async function PUT(request, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required to modify projects.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const existing = await Project.findOne({ id });
    if (!existing) {
      return NextResponse.json(
        { error: `Project not found with id: ${id}` },
        { status: 404 }
      );
    }

    // Process stack if provided
    let parsedStack = existing.stack;
    if (body.stack !== undefined) {
      if (Array.isArray(body.stack)) {
        parsedStack = body.stack.map(s => String(s).trim()).filter(Boolean);
      } else if (typeof body.stack === 'string') {
        parsedStack = body.stack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Update fields
    if (body.title !== undefined) existing.title = body.title.trim();
    if (body.category !== undefined) existing.category = body.category.trim();
    if (body.desc !== undefined) existing.desc = body.desc.trim();
    if (body.overview !== undefined) existing.overview = body.overview.trim();
    if (body.year !== undefined) existing.year = body.year.trim();
    if (body.detailsLink !== undefined) existing.detailsLink = body.detailsLink.trim();
    if (body.images !== undefined && Array.isArray(body.images) && body.images.length > 0) {
      existing.images = body.images;
    }
    if (body.featured !== undefined) existing.featured = Boolean(body.featured);
    if (body.order !== undefined) {
      const newOrder = Math.max(1, Number(body.order) || 1);
      if (newOrder === 1 && existing.order !== 1) {
        await Project.updateMany({ id: { $ne: existing.id }, order: { $gte: 1 } }, { $inc: { order: 1 } });
      }
      existing.order = newOrder;
    }
    existing.stack = parsedStack;

    await existing.save();

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: existing,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a project (Admin Only)
 */
export async function DELETE(request, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required to delete projects.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Project.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json(
        { error: `Project not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Project "${deleted.title}" deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
