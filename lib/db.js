import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection(collection) {
  ensureDataDir();
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    // Initialize with seed data
    const seed = getSeedData(collection);
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
    return seed;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function writeCollection(collection, data) {
  ensureDataDir();
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function addItem(collection, item) {
  const data = readCollection(collection);
  const newItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };
  data.push(newItem);
  writeCollection(collection, data);
  return newItem;
}

export function updateItem(collection, id, updates) {
  const data = readCollection(collection);
  const index = data.findIndex(item => item.id === id);
  if (index === -1) return null;
  data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
  writeCollection(collection, data);
  return data[index];
}

export function deleteItem(collection, id) {
  const data = readCollection(collection);
  const filtered = data.filter(item => item.id !== id);
  writeCollection(collection, filtered);
  return filtered.length < data.length;
}

function getSeedData(collection) {
  const seeds = {
    projects: [
      {
        id: "1",
        title: "QSR Sales Performance Analytics Platform",
        industry: "Quick Service Restaurant",
        category: "BI",
        status: "published",
        problem: "A major QSR chain lacked real-time visibility into multi-location sales performance, making it difficult for regional managers to identify underperforming outlets and respond to trends quickly.",
        architecture: "Built an end-to-end analytics platform using Microsoft Fabric with Medallion Architecture (Bronze → Silver → Gold layers). Raw POS data landed in a lakehouse, was cleaned and transformed through notebooks, and served through a semantic model to Power BI dashboards.",
        tools: ["Power BI", "Microsoft Fabric", "DAX", "SQL", "Azure Data Factory"],
        modeling: "Implemented a star schema with fact tables for daily sales transactions and dimension tables for stores, products, time periods, and promotional campaigns. Used DAX measures for YoY comparisons, rolling averages, and contribution analysis.",
        pipeline: "Automated daily data extraction from POS systems via Azure Data Factory, landing raw data in Fabric Lakehouse. Spark notebooks performed cleansing, deduplication, and business rule application across Bronze to Gold layers.",
        dashboards: "Executive summary dashboard with filterable KPIs, store-level drill-through pages, product mix analysis, and trend visualization with anomaly detection highlights.",
        insights: "Identified 15% revenue variance across comparable stores, enabling targeted operational improvements. Promotional ROI analysis revealed underperforming campaigns, saving significant marketing spend.",
        timeline: "2024",
        tags: ["Power BI", "Fabric", "DAX"],
        createdAt: "2024-06-01T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Financial Profitability Reporting System",
        industry: "Finance & Operations",
        category: "BI",
        status: "published",
        problem: "Finance teams relied on manual Excel processes for monthly P&L reporting across multiple business units, resulting in delayed reports, inconsistent calculations, and audit trail gaps.",
        architecture: "Designed a centralized data warehouse on Azure Synapse with automated ETL pipelines pulling from ERP, CRM, and financial systems. Power BI connected via DirectQuery and Import modes based on data freshness requirements.",
        tools: ["Power BI", "Azure Synapse", "SQL", "Python", "DAX"],
        modeling: "Financial data model with fact tables for GL entries, budgets, and forecasts. Implemented write-back scenarios for budget vs. actual comparisons. Complex DAX calculations for margin analysis, cost allocation, and multi-currency conversions.",
        pipeline: "Azure Data Factory orchestrated nightly loads from ERP systems. Python scripts handled complex financial transformations, currency conversions, and intercompany elimination logic.",
        dashboards: "Multi-page financial cockpit with P&L waterfall charts, balance sheet summaries, cash flow tracking, and variance analysis. Row-Level Security ensured business unit heads saw only their data.",
        insights: "Reduced monthly reporting cycle from 10 days to 2 days. Automated reconciliation detected recurring data quality issues in source systems, improving upstream processes.",
        timeline: "2024",
        tags: ["Azure Synapse", "Power BI", "ETL"],
        createdAt: "2024-05-01T00:00:00.000Z"
      },
      {
        id: "3",
        title: "Multi-Level Hierarchy Reporting Engine",
        industry: "Enterprise Operations",
        category: "Data Engineering",
        status: "published",
        problem: "An enterprise organization with complex parent-child hierarchies across regions, divisions, and cost centers needed dynamic reporting that could aggregate and drill through any level of the org structure.",
        architecture: "Built a recursive hierarchy resolution engine in SQL, flattened through Fabric notebooks, and exposed as a Power BI semantic model with dynamic security. The architecture supported unlimited hierarchy depth.",
        tools: ["SQL", "Microsoft Fabric", "Power BI", "DAX", "Python"],
        modeling: "Parent-child hierarchy tables with bridge tables for many-to-many relationships. PATH() and PATHITEM() DAX functions for navigation. Implemented dynamic aggregation that automatically adjusted based on user's hierarchy position.",
        pipeline: "Spark notebooks processed hierarchy changes, maintaining history through SCD Type 2 patterns. Automated validation ensured no circular references or orphaned nodes in the hierarchy.",
        dashboards: "Interactive org-level explorer with expandable tree navigation, contextual KPIs that changed based on hierarchy level, and comparison views across peer entities.",
        insights: "Enabled self-service analytics for 200+ managers across hierarchy levels, reducing ad-hoc report requests by 70%. Hierarchy-aware security model eliminated manual access management.",
        timeline: "2024",
        tags: ["Fabric", "SQL", "DAX"],
        createdAt: "2024-04-01T00:00:00.000Z"
      },
      {
        id: "4",
        title: "Executive BI Dashboard Suite",
        industry: "Cross-Industry",
        category: "BI",
        status: "published",
        problem: "C-suite executives needed a single pane of glass view across operations, finance, sales, and HR metrics, with mobile-friendly access and natural language query capabilities.",
        architecture: "Consolidated semantic model spanning multiple data domains, served through Power BI Premium with paginated reports for board materials. Implemented Q&A natural language features and AI-powered anomaly detection.",
        tools: ["Power BI", "DAX", "SQL", "Azure", "AI/ML"],
        modeling: "Composite model connecting Import and DirectQuery sources. Shared dimension tables across business domains. Calculation groups for dynamic time intelligence and KPI threshold management.",
        pipeline: "Hybrid refresh strategy: finance data on schedule, operational metrics near real-time via DirectQuery, and cached analytics for historical trending.",
        dashboards: "Minimalist executive dashboard with traffic-light KPIs, sparkline trends, and drill-to-detail capabilities. Mobile-optimized layout with push notification alerts for KPI threshold breaches.",
        insights: "Increased executive engagement with data from quarterly reviews to daily check-ins. Anomaly detection flagged operational issues an average of 3 days earlier than manual monitoring.",
        timeline: "2023-2024",
        tags: ["Power BI", "DAX", "Executive"],
        createdAt: "2024-03-01T00:00:00.000Z"
      },
      {
        id: "5",
        title: "Data Warehouse Pipeline Framework",
        industry: "Data Platform",
        category: "Data Engineering",
        status: "published",
        problem: "Multiple teams built siloed data pipelines with no standardization, leading to duplicated effort, inconsistent transformations, and difficult maintenance.",
        architecture: "Designed a reusable ETL framework on Azure Data Factory with parameterized pipeline templates, centralized logging, and automated data quality checks. Medallion architecture standardized data flow.",
        tools: ["Azure Data Factory", "SQL", "Python", "Microsoft Fabric", "Azure DevOps"],
        modeling: "Metadata-driven pipeline design: pipeline configurations stored in control tables, enabling new source onboarding without code changes. Implemented data lineage tracking and impact analysis.",
        pipeline: "Parameterized ADF pipelines with dynamic mapping, error handling, retry logic, and SLA monitoring. CI/CD through Azure DevOps for pipeline version control and automated deployment.",
        dashboards: "Pipeline monitoring dashboard showing execution history, data quality scores, SLA compliance, and cost tracking per pipeline.",
        insights: "Reduced new data source onboarding from 2 weeks to 2 days. Standardized error handling caught 95% of data issues before they reached downstream consumers.",
        timeline: "2024",
        tags: ["ADF", "Fabric", "DevOps"],
        createdAt: "2024-02-01T00:00:00.000Z"
      }
    ],
    blogs: [
      { id: "1", title: "Medallion Architecture: Why It Changes Everything", category: "Data Engineering", date: "2025-02-15", excerpt: "Deep dive into implementing Bronze, Silver, Gold layers using Microsoft Fabric and why this pattern is becoming the standard for modern data platforms.", status: "published", createdAt: "2025-02-15T00:00:00.000Z" },
      { id: "2", title: "Integrating LLMs with Power BI via MCP Servers", category: "AI + BI", date: "2025-01-28", excerpt: "How to build an AI copilot that queries your Power BI semantic model using natural language through Model Context Protocol servers.", status: "published", createdAt: "2025-01-28T00:00:00.000Z" },
      { id: "3", title: "DAX Optimization Patterns for Large Models", category: "Power BI", date: "2025-01-10", excerpt: "Performance patterns from working with enterprise-scale Power BI models — iterator functions, calculation groups, and query folding.", status: "published", createdAt: "2025-01-10T00:00:00.000Z" },
      { id: "4", title: "From Data Analyst to Analytics Engineer", category: "Career", date: "2024-12-20", excerpt: "My journey transitioning from building reports to building data platforms, and the skills that matter most in analytics engineering.", status: "published", createdAt: "2024-12-20T00:00:00.000Z" },
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
