import { NextResponse } from 'next/server';
import { readCollection, updateItem, deleteItem } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const projects = readCollection('projects');
    const project = projects.find(p => p.id === params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    if (body.tools && typeof body.tools === 'string') {
      body.tools = body.tools.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    const updated = updateItem('projects', params.id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const deleted = deleteItem('projects', params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
