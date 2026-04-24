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
        link: row.link || null,
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
      {
        id: "1",
        title: "5 High-Impact Uses of AI in Business Intelligence (Power BI & Microsoft Fabric) That Actually Drive Value",
        category: "AI + BI",
        date: "2026-04-15",
        excerpt: "Every BI team is trying to 'add AI' to something. But the technology almost never fails — the use case does. Here are five AI use cases in Power BI and Microsoft Fabric that consistently earn their place, months after the novelty is gone.",
        content: "Every BI team I talk to right now is trying to \"add AI\" to something. A dashboard, a pipeline, a report, a chatbot on top of a semantic model. The technology almost never fails. The use case does. In my recent work across Power BI and Microsoft Fabric, I've found a handful of AI use cases that consistently earn their place — natural language querying on governed semantic models, AI-powered data cleaning and enrichment, anomaly detection and proactive alerts, automated executive narratives, and predictive analytics embedded in existing reports.",
        status: "published",
        link: "https://www.linkedin.com/pulse/5-high-impact-uses-ai-business-intelligence-power-bi-microsoft-pawar-1susf/",
        createdAt: "2026-04-15T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Data Security in AI-Powered Business Intelligence: How MCP Servers Keep Your Power BI Data Safe with Claude",
        category: "AI + Security",
        date: "2026-02-21",
        excerpt: "A practical, no-jargon guide for business leaders and IT teams worried about what happens to their data when AI meets BI. Covering the 5-layer security architecture of MCP servers, from authentication to network security.",
        content: "Let me start with something I hear in almost every client meeting: 'This AI dashboard thing looks amazing — but where is my data going?' This blog covers the complete security architecture of connecting Claude to Power BI through MCP servers — authentication via OAuth 2.0 and Microsoft Entra ID, authorization with Row-Level Security, transport encryption with TLS 1.2+, data handling policies, and network security with VNet integration.",
        status: "published",
        link: "https://www.linkedin.com/pulse/data-security-ai-powered-business-intelligence-how-mcp-malhar-pawar-2y0cf/",
        createdAt: "2026-02-21T00:00:00.000Z"
      },
      {
        id: "3",
        title: "The Good, the Bad, and the PBIP: Mastering Power BI Version Control",
        category: "Power BI",
        date: "2025-11-14",
        excerpt: "Managing Power BI reports in a team is notoriously tricky. Traditional PBIX files are monolithic binaries — Git can't diff or merge them. Enter PBIP format and Azure DevOps for true source control, code reviews, and CI/CD pipelines.",
        content: "Managing Power BI reports in a team is notoriously tricky. Traditional PBIX files are monolithic binaries like a locked treasure chest — two developers can't safely work on the same report at once. This article covers setting up Azure DevOps Git repos for Power BI, using PBIP format, branching strategies, pull request workflows, deployment pipelines, workspace permissions, and CI/CD automation with Tabular Editor and PBI Inspector.",
        status: "published",
        link: "https://www.linkedin.com/pulse/good-bad-pbip-mastering-power-bi-version-control-malhar-pawar-em2nf/",
        createdAt: "2025-11-14T00:00:00.000Z"
      },
      {
        id: "4",
        title: "Science Behind Data Visualization: A Cognitive and Practical Perspective",
        category: "Data Visualization",
        date: "2025-06-26",
        excerpt: "Imagine the human brain as a superhighway of information — we devote roughly 20 billion neurons to processing visual input. Good charts aren't just pretty — they work with our cognition. Exploring pre-attentive processing, Gestalt principles, and cognitive load.",
        content: "We devote roughly 20 billion neurons to processing visual input. This article explores the cognitive science behind effective data visualization — pre-attentive processing that happens in 50-500 milliseconds, Gestalt principles of proximity, similarity, closure and continuity, managing cognitive load and the 7±2 chunk limit of working memory, knowing your audience, and how tools like Power BI integrate AI to surface insights automatically.",
        status: "published",
        link: "https://www.linkedin.com/pulse/science-behind-data-visualization-cognitive-practical-malhar-pawar-7kyqf/",
        createdAt: "2025-06-26T00:00:00.000Z"
      },
      {
        id: "5",
        title: "Finance Transformation with HFM Currency: Automation, Accuracy, and Analytics",
        category: "Finance & Analytics",
        date: "2025-04-21",
        excerpt: "Multinational corporations face the complex challenge of consolidating financial data across diverse currencies. Oracle's HFM Currency automates currency translations, manages exchange rates, and ensures compliance — and when integrated with Power BI, transforms data into actionable insights.",
        content: "In today's interconnected world, multinational corporations face the complex challenge of consolidating financial data across diverse currencies. This article covers Oracle HFM Currency's core capabilities — automated currency translation, dynamic exchange rate management, and robust compliance audit trails. It explores real-world cases from lululemon and MTN Group, Power BI integration for data-driven insights, and the future of AI-driven FX forecasting and cryptocurrency integration.",
        status: "published",
        link: "https://www.linkedin.com/pulse/finance-transformation-hfm-currency-automation-accuracy-malhar-pawar-syocf/",
        createdAt: "2025-04-21T00:00:00.000Z"
      },
      {
        id: "6",
        title: "Mastering Data Reconciliation : A Technical Guide to Ensuring Data Accuracy and Integrity",
        category: "Data Quality",
        date: "2025-02-14",
        excerpt: "Data reconciliation is an essential process that ensures data from multiple sources aligns correctly and maintains accuracy. It is a critical business function that provides the foundation for reliable analysis, financial stability, and regulatory compliance.",
        content: "Data reconciliation is more than just a technical requirement; it is a critical business function. Accurate reconciliation prevents financial discrepancies and ensures compliance with regulatory standards. This guide covers identifying data sources, efficient extraction using SQL or ETL tools like Azure Data Factory, matching techniques, validation methods using Python/Pandas, and leveraging DevOps for automation.",
        status: "published",
        link: "https://medium.com/@malharpawar/mastering-data-reconciliation-a-technical-guide-to-ensuring-data-accuracy-and-integrity-f31f1a16af0e",
        createdAt: "2025-02-14T00:00:00.000Z"
      },
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
