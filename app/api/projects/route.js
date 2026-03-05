import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  try {
    const projects = readCollection('projects');
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, industry, category, status, problem, architecture, tools, modeling, pipeline, dashboards, insights, timeline, tags } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newProject = addItem('projects', {
      title,
      industry: industry || '',
      category: category || 'BI',
      status: status || 'draft',
      problem: problem || '',
      architecture: architecture || '',
      tools: Array.isArray(tools) ? tools : (tools || '').split(',').map(s => s.trim()).filter(Boolean),
      modeling: modeling || '',
      pipeline: pipeline || '',
      dashboards: dashboards || '',
      insights: insights || '',
      timeline: timeline || '',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(s => s.trim()).filter(Boolean),
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
