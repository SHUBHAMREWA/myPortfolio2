import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getCurrentAdmin } from '@/lib/auth';

/**
 * GET: Retrieve all projects from MongoDB
 */
export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Failed to fetch projects from MongoDB:', error.message);
    // Return gracefully so client can use fallback
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        fallback: true,
        data: [],
      },
      { status: 200 }
    );
  }
}

/**
 * POST: Create a new project (Admin Only)
 */
export async function POST(request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Only the authorized administrator can add works.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      id,
      category,
      desc,
      overview,
      year,
      detailsLink,
      stack,
      images,
      featured,
      order,
    } = body;

    if (!title || !category || !desc) {
      return NextResponse.json(
        { error: 'Title, category, and description are required fields.' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one project image is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate or clean slug
    const cleanId = (id || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Check for collision
    const existing = await Project.findOne({ id: cleanId });
    if (existing) {
      return NextResponse.json(
        { error: `A project with slug "${cleanId}" already exists. Please pick a unique slug.` },
        { status: 409 }
      );
    }

    // Parse stack if passed as string or array
    let parsedStack = [];
    if (Array.isArray(stack)) {
      parsedStack = stack.map(s => String(s).trim()).filter(Boolean);
    } else if (typeof stack === 'string') {
      parsedStack = stack.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newProject = await Project.create({
      id: cleanId,
      title: title.trim(),
      category: category.trim(),
      desc: desc.trim(),
      overview: (overview || '').trim(),
      year: (year || new Date().getFullYear().toString()).trim(),
      detailsLink: (detailsLink || '#').trim(),
      stack: parsedStack,
      images,
      featured: featured !== undefined ? Boolean(featured) : true,
      order: Number(order) || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project in MongoDB:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project in database' },
      { status: 500 }
    );
  }
}
