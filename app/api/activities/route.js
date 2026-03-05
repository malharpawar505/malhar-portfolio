import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  return NextResponse.json(readCollection('activities'));
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
  const item = addItem('activities', {
    title: body.title,
    description: body.description || '',
    date: body.date || new Date().toISOString().split('T')[0],
    tags: Array.isArray(body.tags) ? body.tags : (body.tags || '').split(',').map(s => s.trim()).filter(Boolean),
  });
  return NextResponse.json(item, { status: 201 });
}
