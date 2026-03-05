import { NextResponse } from 'next/server';
import { getItemById, updateItem, deleteItem } from '@/lib/db';

export async function GET(request, { params }) {
  const blog = await getItemById('blogs', params.id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const updated = await updateItem('blogs', params.id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  await deleteItem('blogs', params.id);
  return NextResponse.json({ success: true });
}
