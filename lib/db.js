import { supabase } from './supabase';

// ─── SUPABASE-BACKED OPERATIONS ────────────────────────────────

export async function readCollection(collection) {
  if (!supabase) return getSeedData(collection);

  try {
    const { data, error } = await supabase
      .from(collection)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return getSeedData(collection);

    // Normalize snake_case DB columns to camelCase for frontend
    return data.map(row => normalizeRow(collection, row));
  } catch (e) {
    console.error(`Error reading ${collection}:`, e.message);
    return getSeedData(collection);
  }
}

export async function addItem(collection, item) {
  if (!supabase) return { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };

  try {
    const dbRow = toDbRow(collection, item);
    const { data, error } = await supabase
      .from(collection)
      .insert(dbRow)
      .select()
      .single();

    if (error) throw error;
    return normalizeRow(collection, data);
  } catch (e) {
    console.error(`Error adding to ${collection}:`, e.message);
    return { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };
  }
}

export async function updateItem(collection, id, updates) {
  if (!supabase) return null;

  try {
    const dbUpdates = toDbRow(collection, updates);
    delete dbUpdates.id;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(collection)
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return normalizeRow(collection, data);
  } catch (e) {
    console.error(`Error updating ${collection}:`, e.message);
    return null;
  }
}

export async function deleteItem(collection, id) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from(collection)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`Error deleting from ${collection}:`, e.message);
    return false;
  }
}

export async function getItemById(collection, id) {
  if (!supabase) {
    const seed = getSeedData(collection);
    return seed.find(item => item.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from(collection)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return normalizeRow(collection, data);
  } catch (e) {
    console.error(`Error getting item from ${collection}:`, e.message);
    return null;
  }
}

// ─── ROW NORMALIZATION ─────────────────────────────────────────

function normalizeRow(collection, row) {
  if (!row) return null;

  const base = {
    id: String(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at || null,
  };

  switch (collection) {
    case 'projects':
      return {
        ...base,
        title: row.title,
        industry: row.industry,
        category: row.category,
        status: row.status,
        problem: row.problem,
        architecture: row.architecture,
        tools: row.tools || [],
        modeling: row.modeling,
        pipeline: row.pipeline,
        dashboards: row.dashboards,
        insights: row.insights,
        timeline: row.timeline,
        tags: row.tags || [],
        github: row.github || null,
      };

    case 'blogs':
      return {
        ...base,
        title: row.title,
        category: row.category,
        date: row.date,
        excerpt: row.excerpt,
        content: row.content,
        status: row.status,
      };

    case 'activities':
      return {
        ...base,
        title: row.title,
        description: row.description,
        date: row.date,
        tags: row.tags || [],
      };

    case 'messages':
      return {
        ...base,
        name: row.name,
        email: row.email,
        message: row.message,
        read: row.read || false,
        date: row.created_at,
      };

    default:
      return { ...row, ...base };
  }
}

function toDbRow(collection, item) {
  const row = { ...item };

  // Convert camelCase to snake_case for timestamps
  if (row.createdAt) { row.created_at = row.createdAt; delete row.createdAt; }
  if (row.updatedAt) { row.updated_at = row.updatedAt; delete row.updatedAt; }

  // Ensure arrays are actual arrays (not comma-separated strings)
  if (collection === 'projects') {
    if (typeof row.tools === 'string') {
      row.tools = row.tools.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof row.tags === 'string') {
      row.tags = row.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (collection === 'activities' && typeof row.tags === 'string') {
    row.tags = row.tags.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Remove id for inserts (let Supabase auto-generate)
  if (row.id && collection !== 'messages') {
    delete row.id;
  }

  return row;
}

// ─── SEED DATA (fallback when Supabase not connected) ──────────

function getSeedData(collection) {
  const seeds = {
    projects: [
      {
        id: "1", title: "QSR Sales Performance Analytics Platform", industry: "Quick Service Restaurant", category: "BI", status: "published",
        problem: "A major QSR chain lacked real-time visibility into multi-location sales performance, making it difficult for regional managers to identify underperforming outlets and respond to trends quickly.",
        architecture: "Built an end-to-end analytics platform using Microsoft Fabric with Medallion Architecture (Bronze to Silver to Gold layers). Raw POS data landed in a lakehouse, was cleaned and transformed through notebooks, and served through a semantic model to Power BI dashboards.",
        tools: ["Power BI", "Microsoft Fabric", "DAX", "SQL", "Azure Data Factory"],
        modeling: "Implemented a star schema with fact tables for daily sales transactions and dimension tables for stores, products, time periods, and promotional campaigns. Used DAX measures for YoY comparisons, rolling averages, and contribution analysis.",
        pipeline: "Automated daily data extraction from POS systems via Azure Data Factory, landing raw data in Fabric Lakehouse. Spark notebooks performed cleansing, deduplication, and business rule application across Bronze to Gold layers.",
        dashboards: "Executive summary dashboard with filterable KPIs, store-level drill-through pages, product mix analysis, and trend visualization with anomaly detection highlights.",
        insights: "Identified 15% revenue variance across comparable stores, enabling targeted operational improvements. Promotional ROI analysis revealed underperforming campaigns, saving significant marketing spend.",
        timeline: "2024", tags: ["Power BI", "Fabric", "DAX"], createdAt: "2024-06-01T00:00:00.000Z"
      },
      {
        id: "2", title: "Financial Profitability Reporting System", industry: "Finance & Operations", category: "BI", status: "published",
        problem: "Finance teams relied on manual Excel processes for monthly P&L reporting across multiple business units, resulting in delayed reports, inconsistent calculations, and audit trail gaps.",
        architecture: "Designed a centralized data warehouse on Azure Synapse with automated ETL pipelines pulling from ERP, CRM, and financial systems. Power BI connected via DirectQuery and Import modes based on data freshness requirements.",
        tools: ["Power BI", "Azure Synapse", "SQL", "Python", "DAX"],
        modeling: "Financial data model with fact tables for GL entries, budgets, and forecasts. Complex DAX calculations for margin analysis, cost allocation, and multi-currency conversions.",
        pipeline: "Azure Data Factory orchestrated nightly loads from ERP systems. Python scripts handled complex financial transformations, currency conversions, and intercompany elimination logic.",
        dashboards: "Multi-page financial cockpit with P&L waterfall charts, balance sheet summaries, cash flow tracking, and variance analysis. Row-Level Security ensured business unit heads saw only their data.",
        insights: "Reduced monthly reporting cycle from 10 days to 2 days. Automated reconciliation detected recurring data quality issues in source systems.",
        timeline: "2024", tags: ["Azure Synapse", "Power BI", "ETL"], createdAt: "2024-05-01T00:00:00.000Z"
      },
      {
        id: "3", title: "Multi-Level Hierarchy Reporting Engine", industry: "Enterprise Operations", category: "Data Engineering", status: "published",
        problem: "An enterprise organization with complex parent-child hierarchies across regions, divisions, and cost centers needed dynamic reporting that could aggregate and drill through any level of the org structure.",
        architecture: "Built a recursive hierarchy resolution engine in SQL, flattened through Fabric notebooks, and exposed as a Power BI semantic model with dynamic security.",
        tools: ["SQL", "Microsoft Fabric", "Power BI", "DAX", "Python"],
        modeling: "Parent-child hierarchy tables with bridge tables for many-to-many relationships. PATH() and PATHITEM() DAX functions for navigation.",
        pipeline: "Spark notebooks processed hierarchy changes, maintaining history through SCD Type 2 patterns. Automated validation ensured no circular references.",
        dashboards: "Interactive org-level explorer with expandable tree navigation, contextual KPIs that changed based on hierarchy level.",
        insights: "Enabled self-service analytics for 200+ managers, reducing ad-hoc report requests by 70%.",
        timeline: "2024", tags: ["Fabric", "SQL", "DAX"], createdAt: "2024-04-01T00:00:00.000Z"
      },
      {
        id: "4", title: "Executive BI Dashboard Suite", industry: "Cross-Industry", category: "BI", status: "published",
        problem: "C-suite executives needed a single pane of glass view across operations, finance, sales, and HR metrics, with mobile-friendly access.",
        architecture: "Consolidated semantic model spanning multiple data domains, served through Power BI Premium with paginated reports for board materials.",
        tools: ["Power BI", "DAX", "SQL", "Azure", "AI/ML"],
        modeling: "Composite model connecting Import and DirectQuery sources. Calculation groups for dynamic time intelligence.",
        pipeline: "Hybrid refresh strategy: finance data on schedule, operational metrics near real-time via DirectQuery.",
        dashboards: "Minimalist executive dashboard with traffic-light KPIs, sparkline trends, and drill-to-detail capabilities.",
        insights: "Increased executive engagement with data from quarterly reviews to daily check-ins. Anomaly detection flagged issues 3 days earlier.",
        timeline: "2023-2024", tags: ["Power BI", "DAX", "Executive"], createdAt: "2024-03-01T00:00:00.000Z"
      },
      {
        id: "5", title: "Data Warehouse Pipeline Framework", industry: "Data Platform", category: "Data Engineering", status: "published",
        problem: "Multiple teams built siloed data pipelines with no standardization, leading to duplicated effort and inconsistent transformations.",
        architecture: "Designed a reusable ETL framework on Azure Data Factory with parameterized pipeline templates and automated data quality checks.",
        tools: ["Azure Data Factory", "SQL", "Python", "Microsoft Fabric", "Azure DevOps"],
        modeling: "Metadata-driven pipeline design: pipeline configurations stored in control tables, enabling new source onboarding without code changes.",
        pipeline: "Parameterized ADF pipelines with dynamic mapping, error handling, retry logic, and SLA monitoring. CI/CD through Azure DevOps.",
        dashboards: "Pipeline monitoring dashboard showing execution history, data quality scores, SLA compliance, and cost tracking.",
        insights: "Reduced new data source onboarding from 2 weeks to 2 days. Standardized error handling caught 95% of issues early.",
        timeline: "2024", tags: ["ADF", "Fabric", "DevOps"], createdAt: "2024-02-01T00:00:00.000Z"
      }
    ],
    blogs: [
      { id: "1", title: "Medallion Architecture: Why It Changes Everything", category: "Data Engineering", date: "2025-02-15", excerpt: "Deep dive into implementing Bronze, Silver, Gold layers using Microsoft Fabric.", status: "published", createdAt: "2025-02-15T00:00:00.000Z" },
      { id: "2", title: "Integrating LLMs with Power BI via MCP Servers", category: "AI + BI", date: "2025-01-28", excerpt: "How to build an AI copilot that queries your Power BI semantic model using natural language.", status: "published", createdAt: "2025-01-28T00:00:00.000Z" },
      { id: "3", title: "DAX Optimization Patterns for Large Models", category: "Power BI", date: "2025-01-10", excerpt: "Performance patterns from working with enterprise-scale Power BI models.", status: "published", createdAt: "2025-01-10T00:00:00.000Z" },
      { id: "4", title: "From Data Analyst to Analytics Engineer", category: "Career", date: "2024-12-20", excerpt: "My journey transitioning from building reports to building data platforms.", status: "published", createdAt: "2024-12-20T00:00:00.000Z" },
    ],
    activities: [
      { id: "1", date: "2025-03-04", title: "Explored Claude + Power BI MCP integration", description: "Built a prototype connecting Claude to Power BI semantic models for natural language querying.", tags: ["AI", "MCP", "Power BI"], createdAt: "2025-03-04T00:00:00.000Z" },
      { id: "2", date: "2025-03-01", title: "Deep dive into Microsoft Fabric capacity tiers", description: "Researched licensing constraints and capacity options for enterprise Fabric deployments.", tags: ["Fabric", "Azure"], createdAt: "2025-03-01T00:00:00.000Z" },
      { id: "3", date: "2025-02-26", title: "Data quality audit across multi-country dataset", description: "Identified systemic data quality issues in operations scorecard data spanning 5 countries.", tags: ["SQL", "Data Quality"], createdAt: "2025-02-26T00:00:00.000Z" },
      { id: "4", date: "2025-02-20", title: "Azure Specialization audit preparation", description: "Created presentation materials for Microsoft Azure cloud migration specialization audit.", tags: ["Azure", "Fabric"], createdAt: "2025-02-20T00:00:00.000Z" },
      { id: "5", date: "2025-02-15", title: "Agentic AI chatbot deployment to Vercel", description: "Deployed an AI-powered analytics chatbot with both static and live data modes.", tags: ["AI", "Vercel", "LLM"], createdAt: "2025-02-15T00:00:00.000Z" },
    ],
    messages: [],
  };
  return seeds[collection] || [];
}
