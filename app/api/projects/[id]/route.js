import { NextResponse } from 'next/server';
import { getSeedData } from '@/lib/db';

export async function GET(request, { params }) {
  const projects = getSeedData('projects');
  const project = projects.find(p => String(p.id) === String(params.id));
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}
