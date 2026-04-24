import { NextResponse } from 'next/server';
import { deleteItem } from '@/lib/db';

export async function DELETE(request, { params }) {
  const { id } = params;
  const result = await deleteItem('activities', id);
  return NextResponse.json(result);
}
