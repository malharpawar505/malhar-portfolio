import { NextResponse } from 'next/server';
import { deleteItem } from '@/lib/db';

export async function DELETE(request, { params }) {
  const { id } = params;
  const success = await deleteItem('activities', id);
  return NextResponse.json({ success });
}
