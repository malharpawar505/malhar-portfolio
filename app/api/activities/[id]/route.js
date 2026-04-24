import { NextResponse } from 'next/server';
import { deleteItem } from '@/lib/db';

export async function DELETE(request, { params }) {
  const { id } = params;
  await deleteItem('activities', id);
  return NextResponse.json({ success: true });
}
