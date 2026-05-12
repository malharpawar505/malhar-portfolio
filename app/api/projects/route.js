import { NextResponse } from 'next/server';
import { getSeedData } from '@/lib/db';

export async function GET() {
  const projects = getSeedData('projects');
  return NextResponse.json(projects);
}
