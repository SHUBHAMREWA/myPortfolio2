import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getCurrentAdmin } from '@/lib/auth';
import { projectsData } from '@/data/projectsData';
import { en } from '@/locales/en';

export async function POST(request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin login required to seed database.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const count = await Project.countDocuments();
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    if (count > 0 && !force) {
      return NextResponse.json({
        message: `Database already has ${count} project(s). Use ?force=true to re-seed.`,
        count,
      });
    }

    if (force) {
      await Project.deleteMany({});
    }

    const seededProjects = [];

    for (let i = 0; i < projectsData.length; i++) {
      const p = projectsData[i];
      const indexNum = i + 1;
      
      const title = en.projects?.[`project${indexNum}Title`] || p.id.toUpperCase();
      const category = en.projects?.[`project${indexNum}Category`] || "Web Development";
      const desc = en.projects?.[`project${indexNum}Desc`] || "";
      const overview = en.projects?.[`project${indexNum}Overview`] || "";

      const doc = await Project.create({
        id: p.id,
        title,
        titleKey: p.titleKey,
        category,
        categoryKey: p.categoryKey,
        desc,
        descKey: p.descKey,
        overview,
        overviewKey: p.overviewKey,
        year: p.year,
        detailsLink: p.detailsLink,
        stack: p.stack,
        images: p.images,
        featured: true,
        order: i,
      });

      seededProjects.push(doc);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seededProjects.length} initial projects into MongoDB!`,
      data: seededProjects,
    });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed projects into database' },
      { status: 500 }
    );
  }
}
