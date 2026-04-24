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
        id: "1", 
        title: "Enterprise Data Lakehouse on Microsoft Fabric", 
        industry: "Retail & E-commerce", 
        category: "Data Engineering", 
        status: "published",
        problem: "A global retail giant struggled with fragmented data across 50+ regional silos, leading to inconsistent reporting and delayed decision-making. The traditional ETL process took 48 hours, making real-time inventory management impossible.",
        architecture: "Implemented a unified Data Lakehouse on Microsoft Fabric using the Medallion Architecture (Bronze, Silver, Gold). Leveraged OneLake to eliminate data duplication and shortcuts to connect existing cloud storage without movement.",
        tools: ["Microsoft Fabric", "Spark (PySpark)", "Delta Lake", "Direct Lake", "Power BI"],
        modeling: "Developed a robust Star Schema with multi-dimensional facts for sales, inventory, and customer behavior. Used Lakehouse schemas and SQL Analytics endpoints for high-performance querying.",
        pipeline: "Engineered automated data ingestion using Fabric Data Factory and Spark Notebooks. Implemented incremental loading patterns and data quality checks (Great Expectations) at the Silver layer.",
        dashboards: "High-performance Power BI dashboards using Direct Lake mode, providing sub-second latency on billion-row datasets without the need for refreshing imports.",
        insights: "Reduced data latency from 48 hours to near real-time (under 10 minutes). Achieved a 30% reduction in cloud storage costs by eliminating redundant data silos and unified the global reporting standard.",
        timeline: "2024", 
        tags: ["Fabric", "Lakehouse", "PySpark", "Direct Lake"], 
        createdAt: "2024-10-01T00:00:00.000Z"
      },
      {
        id: "2", 
        title: "Real-time Predictive Maintenance Engine", 
        industry: "Manufacturing & Industrial AI", 
        category: "Data Engineering / ML", 
        status: "published",
        problem: "A manufacturing leader faced high operational costs due to reactive maintenance, where machines were only fixed after they failed. This caused significant production downtime and wasted resources.",
        architecture: "Built a real-time streaming architecture on Databricks. Integrated sensor data from thousands of IoT devices into a Delta Lake, applying ML models to predict failures before they occur.",
        tools: ["Databricks", "PySpark Streaming", "Delta Live Tables", "Python", "Azure Event Hubs"],
        modeling: "Time-series data modeling for sensor telemetry. Engineered features for health scores, RUL (Remaining Useful Life), and anomaly scores using Spark ML.",
        pipeline: "Orchestrated end-to-end pipelines with Delta Live Tables (DLT) for automated scaling and error handling. Used PySpark for complex transformations on high-velocity streaming data.",
        dashboards: "Real-time Power BI operational cockpit with automated alerts, heatmaps of factory floor health, and predictive maintenance schedules.",
        insights: "Prevented over 50 major equipment failures in the first quarter, resulting in $2.5M+ savings in production downtime. Improved overall equipment effectiveness (OEE) by 18%.",
        timeline: "2024", 
        tags: ["Databricks", "Streaming", "PySpark", "Industrial AI"], 
        createdAt: "2024-08-15T00:00:00.000Z"
      },
      {
        id: "3", 
        title: "Global Financial Reconciliation & Currency Engine", 
        industry: "Finance & Fintech", 
        category: "Analytics Architecture", 
        status: "published",
        problem: "Manual, error-prone reconciliation of financial transactions across 12 different currencies led to frequent audit failures and inaccurate quarterly reporting for a multinational fintech firm.",
        architecture: "Designed a high-integrity financial data platform on Azure SQL and Python. Built a custom currency conversion engine that integrates with live market rates to ensure sub-cent accuracy across all reporting layers.",
        tools: ["SQL", "Python", "Azure Data Factory", "Power BI", "REST APIs"],
        modeling: "Highly normalized financial model with strict ACID compliance. Implemented complex currency translation logic using DAX and Python-based calculation engines.",
        pipeline: "Automated daily reconciliation pipelines using Python scripts for data validation and SQL for high-volume matching. Integrated with external FX APIs for real-time exchange rate management.",
        dashboards: "Comprehensive Audit & Compliance dashboards in Power BI, featuring drill-through to individual transaction level and automated variance highlights.",
        insights: "Reduced monthly close cycle from 15 days to 4 days. Achieved 100% audit compliance and eliminated $500k/year in operational losses caused by reconciliation errors.",
        timeline: "2024", 
        tags: ["Finance", "SQL", "Python", "Reconciliation"], 
        createdAt: "2024-05-20T00:00:00.000Z"
      },
      {
        id: "4", 
        title: "AI-Driven Supply Chain Optimizer", 
        industry: "Logistics & Supply Chain", 
        category: "AI & Data Engineering", 
        status: "published",
        problem: "Inefficient inventory distribution led to both stockouts in high-demand areas and excessive overstock in others, costing the business millions in lost sales and storage fees.",
        architecture: "Modern data stack integrating LLM-based natural language insights with traditional demand forecasting. Built on Databricks and SQL Server, leveraging Python for advanced optimization algorithms.",
        tools: ["Databricks", "Python (LangChain)", "SQL Server", "Power BI", "Azure OpenAI"],
        modeling: "Forecasting models integrated with semantic layers. Used vector databases (Pinecone/Chroma) to enable natural language querying of supply chain documentation.",
        pipeline: "Automated data flow from ERP systems to Databricks using ADF. Python-based microservices for demand forecasting and inventory rebalancing recommendations.",
        dashboards: "Interactive 'Supply Chain Copilot' dashboard where managers can ask questions like 'Why is there a delay in Region X?' and get AI-generated insights backed by real-time data.",
        insights: "Optimized inventory levels by 22%, saving $4M in annual holding costs. Reduced stockouts by 40% through proactive demand-sensing algorithms.",
        timeline: "2023-2024", 
        tags: ["AI", "Supply Chain", "Databricks", "Optimization"], 
        createdAt: "2024-03-10T00:00:00.000Z"
      },
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
