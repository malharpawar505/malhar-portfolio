import sql from './neon';

// ─── NEON-BACKED OPERATIONS ─────────────────────────────────────

export async function readCollection(collection) {
  if (!sql) return getSeedData(collection);

  try {
    let data;
    if (collection === 'projects') data = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    else if (collection === 'blogs') data = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
    else if (collection === 'activities') data = await sql`SELECT * FROM activities ORDER BY created_at DESC`;
    else if (collection === 'messages') data = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
    if (!data || data.length === 0) return getSeedData(collection);
    return data.map(row => normalizeRow(collection, row));
  } catch (e) {
    console.error(`Error reading ${collection}:`, e.message);
    // Only fallback to seed data if it's a "relation does not exist" error (tables not yet created)
    if (e.message.includes('does not exist')) {
      return getSeedData(collection);
    }
    return [];
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

export async function updateItem(collection, id, updates) {
  if (!sql) return { success: false, error: 'No database connection' };

  try {
    const dbUpdates = toDbRow(collection, updates);
    const intId = parseInt(id);
    let result;

    if (collection === 'projects') {
      result = await sql`UPDATE projects SET 
        title = ${dbUpdates.title}, industry = ${dbUpdates.industry}, category = ${dbUpdates.category}, 
        status = ${dbUpdates.status}, problem = ${dbUpdates.problem}, architecture = ${dbUpdates.architecture}, 
        tools = ${dbUpdates.tools}, modeling = ${dbUpdates.modeling}, pipeline = ${dbUpdates.pipeline}, 
        dashboards = ${dbUpdates.dashboards}, insights = ${dbUpdates.insights}, timeline = ${dbUpdates.timeline}, 
        tags = ${dbUpdates.tags}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${intId} RETURNING *`;
    } else if (collection === 'blogs') {
      result = await sql`UPDATE blogs SET 
        title = ${dbUpdates.title}, category = ${dbUpdates.category}, date = ${dbUpdates.date}, 
        excerpt = ${dbUpdates.excerpt}, content = ${dbUpdates.content}, status = ${dbUpdates.status}, 
        link = ${dbUpdates.link}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${intId} RETURNING *`;
    }

    return normalizeRow(collection, result[0]);
  } catch (e) {
    console.error(`Error updating ${collection}:`, e.message);
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
      return { ...base, title: row.title, industry: row.industry, category: row.category, status: row.status, problem: row.problem, architecture: row.architecture, tools: row.tools || [], modeling: row.modeling, pipeline: row.pipeline, dashboards: row.dashboards, insights: row.insights, timeline: row.timeline, tags: row.tags || [], description: row.description || row.problem, impactMetric: row.impactMetric || row.impact_metric, impactOutcome: row.impactOutcome || row.impact_outcome };
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

// ─── SEED DATA (FULL RESTORED) ───────────────────────────────────
export function getSeedData(collection) {
  const seeds = {
    projects: [
      {
        id: "1",
        title: "PMO Portfolio Operations Dashboard",
        category: "BI",
        status: "published",
        description: "Enterprise-grade Power BI dashboard for PMO operations tracking across multiple projects. Built a complete semantic model with 43 DAX measures, 12 table relationships, and a 5-page visual layout.",
        tools: ["Power BI", "DAX", "SQL", "Data Modeling", "Star Schema"],
        impactMetric: "43 DAX Measures · 5 Report Pages",
        impactOutcome: "Delivered a full PMO visibility suite covering project health scoring, resource utilization heatmaps, budget vs actuals tracking, milestone timelines, and an executive summary page. Reduced manual reporting effort by automating KPI calculations across all project dimensions. Deployed live via Power BI MCP server with semantic model documentation.",
        createdAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Power BI Custom Visual",
        category: "BI",
        status: "published",
        description: "Built a production-ready custom pbiviz visual with format-pane-configurable fields and live API endpoint integration for enterprise Power BI reports.",
        tools: ["Power BI", "TypeScript", "REST API", "pbiviz SDK", "D3.js"],
        impactMetric: "Live API data inside native Power BI visuals",
        impactOutcome: "Enabled Power BI reports to render dynamic external data within a native visual experience — no iframes, no workarounds. Format pane fields are fully configurable by report authors. Solved a real client requirement where third-party data needed to appear natively inside Power BI without exporting to external tools.",
        createdAt: "2024-02-01T00:00:00.000Z"
      },
      {
        id: "3",
        title: "StockStream ADF Pipeline",
        category: "Data Engineering",
        status: "published",
        description: "End-to-end Azure data pipeline ingesting real-time NIFTY 50 stock data from Alpha Vantage API using Azure Data Factory with full Medallion Architecture implementation.",
        tools: ["Azure Data Factory", "Azure Data Lake Gen2", "Python", "Medallion Architecture", "Alpha Vantage API", "Delta Lake"],
        impactMetric: "NIFTY 50 · Bronze → Silver → Gold Pipeline",
        impactOutcome: "Automated daily ingestion of 50 stock tickers with raw landing in Bronze, cleaning and normalization in Silver, and aggregated analytics-ready tables in Gold. Pipeline includes error handling, logging, and retry logic. Designed as a portfolio-grade demonstration of production ADF patterns for interview and client showcasing.",
        createdAt: "2024-03-01T00:00:00.000Z"
      },
      {
        id: "4",
        title: "MCP Server for Power BI",
        category: "AI",
        status: "published",
        description: "Built a Model Context Protocol server that connects Claude AI directly to live Power BI semantic models and Azure Analysis Services — enabling natural language querying of enterprise BI data.",
        tools: ["Python", "MCP Protocol", "Claude AI", "Power BI Desktop", "Azure Analysis Services", "DAX", "XMLA"],
        impactMetric: "Natural language → DAX query execution on live models",
        impactOutcome: "A genuinely novel integration — business users can ask questions in plain English and receive answers pulled directly from live semantic models. Overcame major technical challenges including COM/ADODB Windows integration, MSOLAP driver configuration, and XMLA endpoint authentication. Positioned as a key differentiator for AI-powered BI consulting engagements.",
        createdAt: "2024-04-01T00:00:00.000Z"
      },
      {
        id: "5",
        title: "Azure AI Foundry Agent",
        category: "AI",
        status: "published",
        description: "Developed a production-grade conversational AI agent using Azure AI Foundry powered by GPT-4.1 with tool use, memory, and multi-turn conversation for enterprise client engagement.",
        tools: ["Azure AI Foundry", "GPT-4.1", "Python", "REST API", "Tool Use", "Azure"],
        impactMetric: "Production AI agent with tool use & memory",
        impactOutcome: "Designed for a real client engagement where the agent handles automated responses, data lookups, and business logic routing. Implements structured tool calling, conversation memory across turns, and graceful fallback handling. Delivered as a fully documented solution with architecture diagrams and security compliance documentation.",
        createdAt: "2024-05-01T00:00:00.000Z"
      },
      {
        id: "6",
        title: "Microsoft Fabric Analytics Platform",
        category: "Data Engineering",
        status: "published",
        description: "Designed and implemented a Microsoft Fabric workspace with Lakehouse architecture, automated pipelines, and Power BI Direct Lake integration for sub-second analytics on large datasets.",
        tools: ["Microsoft Fabric", "Lakehouse", "OneLake", "Power BI", "Direct Lake", "SQL Analytics Endpoint", "DP-600"],
        impactMetric: "Sub-second query performance via Direct Lake mode",
        impactOutcome: "Replaced a traditional import-mode Power BI setup with a fully integrated Fabric Lakehouse — eliminating scheduled refresh delays and enabling real-time data exploration. Semantic model built on Direct Lake mode queries OneLake parquet files directly, achieving dramatically faster load times. Implemented as part of DP-600 certification preparation and applied to a live client environment.",
        createdAt: "2024-06-01T00:00:00.000Z"
      }
    ],
    blogs: [
      {
        id: "1",
        title: "5 High-Impact Uses of AI in Business Intelligence That Actually Drive Value",
        category: "AI & BI",
        date: "2025-04-24",
        excerpt: "AI in BI is moving from simple 'Ask a Question' features to complex autonomous agents that monitor data quality and suggest strategic moves.",
        content: "In this article, we explore how AI is transforming Business Intelligence from reactive dashboards to proactive intelligence systems. Key topics include automated anomaly detection, natural language querying (NLQ) with MCP servers, and the role of agentic AI in data governance.",
        status: "published",
        link: "https://www.linkedin.com/pulse/5-high-impact-uses-ai-business-intelligence-power-bi-microsoft-pawar-1susf/",
        createdAt: "2025-04-24T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Data Security in AI-Powered Business Intelligence: How MCP Servers Keep Your Data Safe",
        category: "Data Security",
        date: "2025-04-20",
        excerpt: "Integrating Claude with Power BI requires a secure bridge. Model Context Protocol (MCP) servers provide that security layer.",
        content: "As organizations rush to integrate LLMs with their internal data, security is the primary concern. This post explains how MCP servers act as a secure proxy, ensuring that sensitive data never leaves your environment while still allowing AI to provide deep insights.",
        status: "published",
        link: "https://www.linkedin.com/pulse/data-security-ai-powered-business-intelligence-how-mcp-malhar-pawar-2y0cf/",
        createdAt: "2025-04-20T00:00:00.000Z"
      },
      {
        id: "3",
        title: "The Good, the Bad, and the PBIP: Mastering Power BI Version Control",
        category: "Power BI",
        date: "2025-04-15",
        excerpt: "Version control in Power BI has always been a pain. The new .pbip format changes everything. Here's how to master it.",
        content: "With the introduction of Power BI Project files (.pbip), we finally have a way to apply true DevOps practices to BI development. This article walks through Git integration, branch policies, and collaborative development workflows.",
        status: "published",
        link: "https://www.linkedin.com/pulse/good-bad-pbip-mastering-power-bi-version-control-malhar-pawar-em2nf/",
        createdAt: "2025-04-15T00:00:00.000Z"
      },
      {
        id: "4",
        title: "The Science Behind Data Visualization: A Cognitive Approach",
        category: "Data Viz",
        date: "2025-04-10",
        excerpt: "Great dashboards aren't just pretty—they're designed for how the human brain processes information. Learn the cognitive science of data viz.",
        content: "Why do some dashboards lead to instant insights while others cause confusion? We dive into Gestalt principles, pre-attentive attributes, and how to design for the '5-second rule'.",
        status: "published",
        link: "https://www.linkedin.com/pulse/science-behind-data-visualization-cognitive-approach-malhar-pawar-jvebf/",
        createdAt: "2025-04-10T00:00:00.000Z"
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
      }
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
