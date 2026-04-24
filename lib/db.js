import sql from './neon';

// ─── NEON-BACKED OPERATIONS ─────────────────────────────────────

export async function readCollection(collection) {
  if (!sql) return getSeedData(collection);

  try {
    const data = await sql`SELECT * FROM ${sql(collection)} ORDER BY created_at DESC`;
    
    if (!data || data.length === 0) return getSeedData(collection);

    // Normalize snake_case DB columns to camelCase for frontend
    return data.map(row => normalizeRow(collection, row));
  } catch (e) {
    console.error(`Error reading ${collection}:`, e.message);
    return getSeedData(collection);
  }
}

export async function addItem(collection, item) {
  if (!sql) return { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };

  try {
    const dbRow = toDbRow(collection, item);
    const keys = Object.keys(dbRow);
    
    const result = await sql`
      INSERT INTO ${sql(collection)} ${sql(dbRow, keys)}
      RETURNING *
    `;
    
    return normalizeRow(collection, result[0]);
  } catch (e) {
    console.error(`Error adding to ${collection}:`, e.message);
    return { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };
  }
}

export async function updateItem(collection, id, updates) {
  if (!sql) return null;

  try {
    const dbUpdates = toDbRow(collection, updates);
    delete dbUpdates.id;
    dbUpdates.updated_at = new Date().toISOString();
    
    const keys = Object.keys(dbUpdates);
    
    const result = await sql`
      UPDATE ${sql(collection)}
      SET ${sql(dbUpdates, keys)}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return normalizeRow(collection, result[0]);
  } catch (e) {
    console.error(`Error updating ${collection}:`, e.message);
    return null;
  }
}

export async function deleteItem(collection, id) {
  if (!sql) return { success: false, error: 'No database connection (Demo Mode)' };

  try {
    await sql`DELETE FROM ${sql(collection)} WHERE id = ${id}`;
    return { success: true };
  } catch (e) {
    console.error(`Error deleting from ${collection}:`, e.message);
    return { success: false, error: e.message };
  }
}

export async function getItemById(collection, id) {
  if (!sql) {
    const seed = getSeedData(collection);
    return seed.find(item => item.id === String(id)) || null;
  }

  try {
    const result = await sql`SELECT * FROM ${sql(collection)} WHERE id = ${id}`;
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
        link: row.link,
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
        date: row.date,
        read: row.read,
      };
    default:
      return { ...base, ...row };
  }
}

function toDbRow(collection, item) {
  const row = { ...item };
  delete row.id;
  delete row.createdAt;
  delete row.updatedAt;

  // No transformation needed if column names match exactly
  // But if we had camelCase to snake_case mapping, we'd do it here.
  // For now, I'll assume standard naming for the tables I'll provide.
  return row;
}

// ─── SEED DATA (FALLBACK) ───────────────────────────────────────

export function getSeedData(collection) {
  const seeds = {
    projects: [
      {
        id: "1",
        title: "Enterprise Data Lakehouse & BI Ecosystem",
        industry: "QSR (Quick Service Restaurant)",
        category: "Data Engineering",
        status: "published",
        problem: "A major QSR brand struggled with siloed data across 500+ outlets, leading to inconsistent reporting and delayed decision-making. Existing legacy systems took 48+ hours to refresh daily sales metrics.",
        architecture: "Implemented a Medallion Architecture (Bronze/Silver/Gold) on Microsoft Fabric. Used Direct Lake mode to connect Power BI directly to OneLake, eliminating the need for data duplication or refresh latency.",
        tools: ["Microsoft Fabric", "Direct Lake", "PySpark", "SQL", "Power BI"],
        modeling: "Star Schema with high-performance dimension modeling for real-time sales, inventory, and labor metrics.",
        pipeline: "Automated ingestion via Fabric Data Factory and transformation using DLT (Delta Live Tables) equivalents in Fabric notebooks.",
        dashboards: "Executive overview dashboards with drill-through to store-level performance, anomaly detection in inventory, and labor optimization suggestions.",
        insights: "Reduced data latency from 48 hours to near real-time (< 5 mins). Improved operational efficiency by 15% through data-driven labor scheduling.",
        timeline: "2024",
        tags: ["Fabric", "Lakehouse", "Real-time"],
        createdAt: "2024-12-01T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Predictive Maintenance Pipeline for Global Operations",
        industry: "Manufacturing/IoT",
        category: "Data Engineering",
        status: "published",
        problem: "Frequent unplanned equipment downtime was costing the client over $200k/month in lost production and emergency repairs.",
        architecture: "Built a robust streaming pipeline using Databricks and Azure Event Hubs to process sensor data from 1,200 machines globally.",
        tools: ["Databricks", "Azure Event Hubs", "Python", "Delta Lake", "MLflow"],
        modeling: "Time-series forecasting models integrated into the data pipeline to predict failure probability 24 hours in advance.",
        pipeline: "Structured Streaming for ingestion; Gold layer served pre-calculated features to a real-time alerting system.",
        dashboards: "Dynamic health-status map of global facilities with proactive maintenance alerts and ROI tracking.",
        insights: "Reduced unplanned downtime by 35%. ROI achieved within 4 months of full deployment.",
        timeline: "2024",
        tags: ["Databricks", "IoT", "Predictive"],
        createdAt: "2024-10-15T00:00:00.000Z"
      },
      {
        id: "3",
        title: "Global Financial Reconciliation & Compliance Engine",
        industry: "Finance",
        category: "Data Engineering",
        status: "published",
        problem: "A financial services firm faced regulatory risks due to manual reconciliation of multi-currency transactions across 12 countries, taking 10 days per month.",
        architecture: "Developed an automated reconciliation engine using Python (Pandas) and SQL Server. Integrated with Azure DevOps for CI/CD and data validation testing.",
        tools: ["Python", "SQL Server", "Pandas", "Azure DevOps", "Great Expectations"],
        modeling: "Relational model optimized for high-volume transaction matching and audit trail preservation.",
        pipeline: "Daily automated extraction from legacy ERPs via API and SQL agents; mismatch reporting triggered via automated email.",
        dashboards: "Compliance scorecards showing reconciliation status, age of outstanding items, and currency exposure risks.",
        insights: "Reduced reconciliation time from 10 days to 4 hours. Eliminated manual error rate (previously ~3%).",
        timeline: "2023",
        tags: ["Finance", "Python", "SQL"],
        createdAt: "2023-11-20T00:00:00.000Z"
      },
      {
        id: "4",
        title: "AI-Driven Supply Chain Optimizer",
        industry: "Logistics",
        category: "AI/Analytics",
        status: "published",
        problem: "Inaccurate demand forecasting led to either overstocking or stock-outs, impacting cash flow and customer satisfaction.",
        architecture: "Integrated LangChain with Azure OpenAI to create a conversational interface for supply chain managers, allowing them to ask 'what-if' questions against the data lake.",
        tools: ["LangChain", "Azure OpenAI", "Python", "Azure Synapse", "Streamlit"],
        modeling: "Used semantic search and RAG (Retrieval-Augmented Generation) over historical inventory and sales data.",
        pipeline: "Vector database (Pinecone) updated daily with embedded sales trends and supply chain disruption reports.",
        dashboards: "Conversational dashboard where users query: 'Which vendors are most likely to fail if the Suez canal is blocked?'",
        insights: "Improved forecast accuracy by 22%. Reduced average stock-holding period by 12 days.",
        timeline: "2024",
        tags: ["AI", "GenAI", "Supply Chain"],
        createdAt: "2024-08-05T00:00:00.000Z"
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
