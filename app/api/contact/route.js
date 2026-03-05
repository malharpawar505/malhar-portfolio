import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';

export async function GET() {
  const data = await readCollection('messages');
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  const msg = await addItem('messages', {
    name: body.name,
    email: body.email,
    message: body.message,
    read: false,
  });
  return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
}
