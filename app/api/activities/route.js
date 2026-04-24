import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  const data = await readCollection('activities');
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
  // Handle tags: convert comma-separated string to array if needed
  let tagsArray = [];
  if (Array.isArray(body.tags)) {
    tagsArray = body.tags;
  } else if (typeof body.tags === 'string') {
    tagsArray = body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  const item = await addItem('activities', {
    title: body.title,
    description: body.description || '',
    date: body.date || new Date().toISOString().split('T')[0],
    tags: tagsArray,
  });
  return NextResponse.json(item, { status: 201 });
}
