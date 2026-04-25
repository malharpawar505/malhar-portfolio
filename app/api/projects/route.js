import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  try {
    const projects = await readCollection('projects');
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newProject = await addItem('projects', {
      title: body.title,
      industry: body.industry || '',
      category: body.category || 'BI',
      status: body.status || 'draft',
      problem: body.problem || '',
      architecture: body.architecture || '',
      tools: body.tools || '',
      modeling: body.modeling || '',
      pipeline: body.pipeline || '',
      dashboards: body.dashboards || '',
      insights: body.insights || '',
      timeline: body.timeline || '',
      tags: body.tags || '',
      github: body.github || null,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
