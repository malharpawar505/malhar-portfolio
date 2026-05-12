import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import sql from '@/lib/neon';
import { getSeedData } from '@/lib/db';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  if (body.token !== adminPass) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!sql) {
    return NextResponse.json({ message: 'No DB connected — seed data is used automatically' });
  }

  // Ensure new columns exist
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS impact_metric TEXT DEFAULT ''`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS impact_outcome TEXT DEFAULT ''`;
  } catch (e) {
    // columns may already exist, continue
  }

  const projects = getSeedData('projects');
  const results = [];

  for (const p of projects) {
    const id = parseInt(p.id);
    try {
      await sql`
        INSERT INTO projects (id, title, industry, category, status, problem, architecture, tools, modeling, pipeline, dashboards, insights, timeline, tags, description, impact_metric, impact_outcome)
        VALUES (
          ${id}, ${p.title}, ${p.industry || ''}, ${p.category}, ${p.status},
          ${p.problem || ''}, ${p.architecture || ''}, ${JSON.stringify(p.tools || [])}::jsonb,
          ${p.modeling || ''}, ${p.pipeline || ''}, ${p.dashboards || ''}, ${p.insights || ''},
          ${p.timeline || ''}, ${JSON.stringify(p.tags || [])}::jsonb,
          ${p.description || ''}, ${p.impactMetric || ''}, ${p.impactOutcome || ''}
        )
        ON CONFLICT (id) DO UPDATE SET
          title          = EXCLUDED.title,
          industry       = EXCLUDED.industry,
          category       = EXCLUDED.category,
          status         = EXCLUDED.status,
          problem        = EXCLUDED.problem,
          architecture   = EXCLUDED.architecture,
          tools          = EXCLUDED.tools,
          modeling       = EXCLUDED.modeling,
          pipeline       = EXCLUDED.pipeline,
          dashboards     = EXCLUDED.dashboards,
          insights       = EXCLUDED.insights,
          timeline       = EXCLUDED.timeline,
          tags           = EXCLUDED.tags,
          description    = EXCLUDED.description,
          impact_metric  = EXCLUDED.impact_metric,
          impact_outcome = EXCLUDED.impact_outcome,
          updated_at     = NOW()
      `;
      results.push({ id, title: p.title, action: 'upserted' });
    } catch (err) {
      results.push({ id, title: p.title, action: 'error', error: err.message });
    }
  }

  // Keep BIGSERIAL sequence ahead of manually-inserted IDs
  try {
    await sql`SELECT setval('projects_id_seq', GREATEST((SELECT MAX(id) FROM projects), ${projects.length}))`;
  } catch {}

  return NextResponse.json({ success: true, synced: results.length, results });
}
