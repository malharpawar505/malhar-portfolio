import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  const data = await readCollection('activities');
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
  const item = await addItem('activities', {
    title: body.title,
    description: body.description || '',
    date: body.date || new Date().toISOString().split('T')[0],
    tags: body.tags || '',
  });
  return NextResponse.json(item, { status: 201 });
}
