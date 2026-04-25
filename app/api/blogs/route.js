import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  try {
    const blogs = await readCollection('blogs');
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    const newBlog = await addItem('blogs', {
      title: body.title,
      category: body.category || '',
      date: body.date || new Date().toISOString().split('T')[0],
      excerpt: body.excerpt || '',
      content: body.content || '',
      status: body.status || 'draft',
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
