import sql from './neon';

// ─── NEON-BACKED OPERATIONS ─────────────────────────────────────

export async function readCollection(collection) {
  if (!sql) return getSeedData(collection);

  try {
    let data;
    // Neon requires literal table names in tagged templates for safety
    if (collection === 'projects') data = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    else if (collection === 'blogs') data = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
    else if (collection === 'activities') data = await sql`SELECT * FROM activities ORDER BY created_at DESC`;
    else if (collection === 'messages') data = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
    else return [];

    if (!data || data.length === 0) return getSeedData(collection);
    return data.map(row => normalizeRow(collection, row));
  } catch (e) {
    console.error(`Error reading ${collection}:`, e.message);
    return getSeedData(collection);
  }
}

export async function addItem(collection, item) {
  if (!sql) return { success: false, error: 'No database connection' };

  try {
    const dbRow = toDbRow(collection, item);
    let result;

    if (collection === 'projects') {
      result = await sql`INSERT INTO projects (title, industry, category, status, problem, architecture, tools, modeling, pipeline, dashboards, insights, timeline, tags) 
        VALUES (${dbRow.title}, ${dbRow.industry}, ${dbRow.category}, ${dbRow.status}, ${dbRow.problem}, ${dbRow.architecture}, ${dbRow.tools}, ${dbRow.modeling}, ${dbRow.pipeline}, ${dbRow.dashboards}, ${dbRow.insights}, ${dbRow.timeline}, ${dbRow.tags}) RETURNING *`;
    } else if (collection === 'blogs') {
      result = await sql`INSERT INTO blogs (title, category, date, excerpt, content, status, link) 
        VALUES (${dbRow.title}, ${dbRow.category}, ${dbRow.date}, ${dbRow.excerpt}, ${dbRow.content}, ${dbRow.status}, ${dbRow.link}) RETURNING *`;
    } else if (collection === 'activities') {
      result = await sql`INSERT INTO activities (title, description, date, tags) 
        VALUES (${dbRow.title}, ${dbRow.description}, ${dbRow.date}, ${dbRow.tags}) RETURNING *`;
    } else if (collection === 'messages') {
      result = await sql`INSERT INTO messages (name, email, message) 
        VALUES (${dbRow.name}, ${dbRow.email}, ${dbRow.message}) RETURNING *`;
    }

    return normalizeRow(collection, result[0]);
  } catch (e) {
    console.error(`Error adding to ${collection}:`, e.message);
    return { success: false, error: e.message };
  }
}

export async function deleteItem(collection, id) {
  if (!sql) return { success: false, error: 'No database connection (Demo Mode)' };

  try {
    const intId = parseInt(id);
    if (collection === 'projects') await sql`DELETE FROM projects WHERE id = ${intId}`;
    else if (collection === 'blogs') await sql`DELETE FROM blogs WHERE id = ${intId}`;
    else if (collection === 'activities') await sql`DELETE FROM activities WHERE id = ${intId}`;
    else if (collection === 'messages') await sql`DELETE FROM messages WHERE id = ${intId}`;
    
    return { success: true };
  } catch (e) {
    console.error(`Error deleting from ${collection}:`, e.message);
    return { success: false, error: e.message };
  }
}

export async function getItemById(collection, id) {
  if (!sql) return getSeedData(collection).find(item => item.id === String(id)) || null;

  try {
    const intId = parseInt(id);
    let result;
    if (collection === 'projects') result = await sql`SELECT * FROM projects WHERE id = ${intId}`;
    else if (collection === 'blogs') result = await sql`SELECT * FROM blogs WHERE id = ${intId}`;
    else return null;

    if (!result[0]) return null;
    return normalizeRow(collection, result[0]);
  } catch (e) {
    console.error(`Error getting item from ${collection}:`, e.message);
    return null;
  }
}

// ─── ROW NORMALIZATION ─────────────────────────────────────────

function normalizeRow(collection, row) {
  if (!row) return null;
  const base = { id: String(row.id), createdAt: row.created_at, updatedAt: row.updated_at || null };

  switch (collection) {
    case 'projects':
      return { ...base, title: row.title, industry: row.industry, category: row.category, status: row.status, problem: row.problem, architecture: row.architecture, tools: row.tools || [], modeling: row.modeling, pipeline: row.pipeline, dashboards: row.dashboards, insights: row.insights, timeline: row.timeline, tags: row.tags || [] };
    case 'blogs':
      return { ...base, title: row.title, category: row.category, date: row.date, excerpt: row.excerpt, content: row.content, status: row.status, link: row.link };
    case 'activities':
      return { ...base, title: row.title, description: row.description, date: row.date, tags: row.tags || [] };
    case 'messages':
      return { ...base, name: row.name, email: row.email, message: row.message, date: row.date, read: row.read };
    default:
      return { ...base, ...row };
  }
}

function toDbRow(collection, item) {
  const row = { ...item };
  delete row.id;
  delete row.createdAt;
  delete row.updatedAt;
  return row;
}

// ─── SEED DATA (FALLBACK) ───────────────────────────────────────
export function getSeedData(collection) {
  const seeds = {
    projects: [
      { id: "1", title: "Enterprise Data Lakehouse & BI Ecosystem", industry: "QSR (Quick Service Restaurant)", category: "Data Engineering", status: "published", problem: "A major QSR brand struggled with siloed data across 500+ outlets...", architecture: "Implemented a Medallion Architecture (Bronze/Silver/Gold) on Microsoft Fabric...", tools: ["Microsoft Fabric", "Direct Lake", "PySpark", "SQL", "Power BI"], timeline: "2024", tags: ["Fabric", "Lakehouse", "Real-time"], createdAt: "2024-12-01T00:00:00.000Z" },
      { id: "2", title: "Predictive Maintenance Pipeline for Global Operations", industry: "Manufacturing/IoT", category: "Data Engineering", status: "published", problem: "Frequent unplanned equipment downtime was costing the client over $200k/month...", architecture: "Built a robust streaming pipeline using Databricks and Azure Event Hubs...", tools: ["Databricks", "Azure Event Hubs", "Python", "Delta Lake", "MLflow"], timeline: "2024", tags: ["Databricks", "IoT", "Predictive"], createdAt: "2024-10-15T00:00:00.000Z" }
    ],
    blogs: [
      { id: "1", title: "5 High-Impact Uses of AI in Business Intelligence That Actually Drive Value", category: "AI & BI", date: "2025-04-24", excerpt: "AI in BI is moving from simple 'Ask a Question' features...", status: "published", link: "https://www.linkedin.com/pulse/5-high-impact-uses-ai-business-intelligence-power-bi-microsoft-pawar-1susf/", createdAt: "2025-04-24T00:00:00.000Z" }
    ],
    activities: [
      { id: "1", date: "2025-03-04", title: "Explored Claude + Power BI MCP integration", description: "Built a prototype connecting Claude to Power BI semantic models...", tags: ["AI", "MCP", "Power BI"], createdAt: "2025-03-04T00:00:00.000Z" }
    ],
    messages: [],
  };
  return seeds[collection] || [];
}
