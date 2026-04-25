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
    if (!data) return [];
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

// ─── SEED DATA (FULL RESTORED) ───────────────────────────────────
export function getSeedData(collection) {
  const seeds = {
    projects: [
      {
        id: "1",
        title: "Enterprise Data Lakehouse & BI Ecosystem",
        industry: "QSR (Quick Service Restaurant)",
        category: "Data Engineering",
        status: "published",
        problem: "A major QSR brand operating 500+ outlets across India faced a critical data crisis: 12 different systems — POS, inventory, payroll, CRM — each with their own siloed data store and reporting tool. Store managers were making decisions on day-old numbers, finance was reconciling sales manually in Excel every week, and the CEO had no single view of real-time performance. Data refresh cycles ran 48+ hours, making same-day decisions impossible during peak periods.",
        architecture: "Designed and implemented a full Medallion Architecture (Bronze → Silver → Gold) on Microsoft Fabric. Raw POS transactions and ERP exports land in the Bronze layer of OneLake via Fabric Data Factory pipelines. PySpark notebooks in the Silver layer apply cleansing, standardization, and SCD Type 2 logic for dimension tables. Gold layer stores pre-aggregated business metrics (Daily Sales, Labor %, Waste %, COGS) optimized for Direct Lake access. Power BI connects via Direct Lake mode — zero data duplication, zero scheduled refresh, zero latency. Workspace-level security with Row-Level Security (RLS) ensures store managers only see their own outlet data.",
        tools: ["Microsoft Fabric", "OneLake", "Direct Lake", "PySpark", "SQL", "Power BI", "Fabric Data Factory", "Azure Key Vault"],
        modeling: "Star Schema across 5 fact tables (Sales, Inventory, Labor, Waste, Transactions) and 8 dimension tables (Date, Store, Product, Employee, Shift, Region, Supplier, Channel). SCD Type 2 applied on Store and Product dims to track historical changes. Composite model in Power BI allows DirectQuery for real-time metrics alongside Import mode for historical trend analysis. Calculated columns pre-materialized in Gold layer to eliminate heavy DAX computation at query time.",
        pipeline: "End-to-end pipeline runs on 15-minute micro-batches via Fabric Data Factory triggers. POS systems push JSON payloads to an Azure Event Hub, consumed by a Fabric Eventstream into Bronze. Nightly full-load jobs handle ERP reconciliation using watermark-based incremental extraction. Data quality gates using Great Expectations run at the Silver layer — any batch with >2% null rate on key fields triggers an alert to the data engineering Slack channel and halts the load. Full pipeline orchestration via Fabric Workspaces with environment isolation (Dev/QA/Prod).",
        dashboards: "Built 4 layered Power BI reports: (1) Executive Pulse — live revenue, covers, COGS%, and labor% vs. targets for the CEO, updated every 15 mins; (2) Store Manager Daily — outlet-level sales, top/bottom items, hourly footfall trend, and shift-level labor comparison; (3) Inventory Sentinel — auto-flagging items below reorder level, waste analysis, and supplier on-time delivery scores; (4) Regional BI — regional GM view with like-for-like growth, cluster benchmarking, and action recommendations. All reports use bookmarks for guided storytelling and conditional formatting with traffic-light RAG status indicators.",
        insights: "Data latency dropped from 48 hours to under 5 minutes — a 99% improvement. Labor scheduling optimized using data-driven shift recommendations, delivering a 15% reduction in labor cost-per-cover. Inventory waste reduced by 18% within 3 months through proactive reorder alerts. Finance team eliminated 40 man-hours/week of manual Excel reconciliation. The executive pulse dashboard is now the CEO's first screen every morning. Platform serves 500+ concurrent Power BI users with sub-3-second query response time via Direct Lake.",
        timeline: "2024",
        tags: ["Fabric", "Lakehouse", "Real-time", "Power BI"],
        createdAt: "2024-12-01T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Predictive Maintenance Pipeline for Global Operations",
        industry: "Manufacturing / IoT",
        category: "Data Engineering",
        status: "published",
        problem: "A global industrial manufacturing client operating 1,200 machines across 8 countries was bleeding $200,000+ per month in unplanned downtime and emergency repair costs. Maintenance was purely reactive — machines were serviced only after breaking down, causing production halts that cascaded across supply chains. Engineers had no visibility into machine health trends; failure alerts arrived only after the damage was done. The client needed a system that could predict failures 24 hours before they occurred with enough confidence to schedule proactive intervention.",
        architecture: "Built a Lambda Architecture combining real-time streaming and batch processing on Azure Databricks. IoT sensors on each machine emit 22 telemetry signals (vibration, temperature, pressure, RPM, current draw) at 1-second intervals. Azure Event Hubs ingests 1.3 million events per minute across all 8 regions. Databricks Structured Streaming processes events in micro-batches into Delta Lake Bronze tables. A feature engineering layer in the Silver zone computes rolling statistics (mean, std dev, RMS) over 5-minute and 1-hour windows. MLflow manages the full ML lifecycle — experiment tracking, model versioning, and deployment. Trained LightGBM models are registered and served via Databricks Model Serving endpoints called by the alerting service in real-time.",
        tools: ["Databricks", "Azure Event Hubs", "Python", "Delta Lake", "MLflow", "LightGBM", "Azure Data Factory", "Power BI", "PySpark", "Azure Monitor"],
        modeling: "Time-series feature engineering using rolling window aggregations (5-min, 1-hr, 8-hr, 24-hr) on all 22 sensor signals. Created 180+ derived features including rate-of-change metrics, FFT-based frequency features for vibration signals, and cross-signal correlation indices. Binary classification model (failure / no-failure within 24hrs) trained on 3 years of historical sensor data with SMOTE oversampling to handle class imbalance (failure events <0.8% of data). Model achieves 91% precision and 87% recall on the test set. Separate models trained per machine type (6 categories) for maximum accuracy. Explainability layer using SHAP values tells engineers which specific sensor reading triggered the alert.",
        pipeline: "Streaming pipeline ingests sensor data from Event Hubs → Databricks Eventstream → Bronze Delta tables in under 2 seconds end-to-end. Feature computation jobs run on a 5-minute schedule using Databricks Jobs. Inference pipeline scores each machine every 15 minutes using the registered MLflow model. Alert generation service writes high-confidence failure predictions (>80% probability) to an Azure Service Bus queue, which triggers maintenance work orders in the client's SAP ERP via REST API integration. Batch pipeline runs nightly to retrain models on the previous 30 days of data, promoting new model versions only if AUC improves by >1%. Full pipeline lineage tracked in Unity Catalog.",
        dashboards: "Global Health Map in Power BI shows all 1,200 machines on an interactive world map with real-time RAG (Red/Amber/Green) health status driven by prediction scores. Drill-through from map to individual machine detail pages showing 72-hour sensor trend charts, current failure probability gauge, SHAP feature importance waterfall, and recommended action. Maintenance ROI tracker quantifies money saved per avoided downtime incident. Historical performance heatmap reveals which production lines have the highest recurrence of specific failure modes — used to drive capital investment decisions.",
        insights: "Unplanned downtime reduced by 35% in the first 6 months, saving the client ~$840,000 annually. Proactive maintenance scheduling reduced emergency repair parts costs by 28%. Full project ROI achieved within 4 months of production deployment. Maintenance teams report 60% reduction in time spent manually inspecting machine logs. The SHAP-based explanations increased engineer trust in the system — adoption rate reached 94% across all facilities within the first quarter. Two machine failure types that previously went undetected until catastrophic breakdown are now reliably caught 18–22 hours in advance.",
        timeline: "2024",
        tags: ["Databricks", "IoT", "MLflow", "Predictive", "Streaming"],
        createdAt: "2024-10-15T00:00:00.000Z"
      },
      {
        id: "3",
        title: "Global Financial Reconciliation & Compliance Engine",
        industry: "Finance",
        category: "Data Engineering",
        status: "published",
        problem: "A multinational financial services firm processing $4.2 billion in monthly transactions across 12 countries faced a compliance timebomb. Month-end financial reconciliation was a 10-day manual process: accountants downloading CSVs from 7 different ERPs, manually matching entries in Excel, and color-coding mismatches. A 3% error rate was considered 'normal' — but with regulators in the EU and APAC tightening reporting requirements, this process posed a direct compliance risk. One failed audit could result in multi-million dollar penalties. The CFO needed reconciliation completed within 4 hours, not 10 days.",
        architecture: "Built a fully automated reconciliation engine in Python deployed on Azure App Service with scheduled Azure Functions triggers. A custom matching algorithm handles multi-currency transactions, applying daily ECB exchange rates to normalize all values to USD before comparison. SQL Server serves as the system of record with a purpose-built audit schema that preserves every reconciliation decision with timestamps, user attribution, and exception codes. Azure DevOps CI/CD pipeline runs a suite of 140+ data validation tests (using Great Expectations) before any reconciled data reaches the reporting layer. Integrated with 7 source ERP systems via REST API and SFTP extraction — each with its own connector module handling authentication, schema mapping, and incremental extraction logic.",
        tools: ["Python", "SQL Server", "Pandas", "Azure Functions", "Azure DevOps", "Great Expectations", "Power BI", "Azure Key Vault", "Jinja2", "FastAPI"],
        modeling: "Reconciliation logic implemented as a tiered matching engine: (1) Exact match on transaction ID and amount; (2) Fuzzy match on amount within 0.01% tolerance with date proximity ±2 days; (3) Aggregate match for bulk payment consolidations; (4) Manual exception flagging for unmatched items. Each transaction assigned a match_confidence score (0–100) and a match_type enum. Relational schema in SQL Server uses surrogate keys, slowly-changing dimensions for counterparty information, and a full audit trail table that captures every state transition. Indexing strategy optimized for the 50M+ row transactions table — query time for monthly reconciliation batch reduced from 4 hours to 11 minutes.",
        pipeline: "Azure Functions trigger source extraction from 7 ERP systems at 02:00 UTC daily. Python connectors authenticate via OAuth2 / API keys stored in Azure Key Vault, download incremental transaction exports, and validate schema against registered contracts. Pandas-based transformation pipeline applies currency normalization, counterparty deduplication, and classification tagging before loading to SQL Server staging tables. The matching engine runs as a background job and processes 2–4 million transactions per nightly cycle in under 40 minutes. Mismatch alerts are generated and distributed via automated email reports using Jinja2 HTML templates with drill-down details. A FastAPI layer exposes reconciliation status endpoints consumed by Power BI for live reporting.",
        dashboards: "Power BI Compliance Command Center with 3 report pages: (1) Executive Reconciliation Status — monthly close progress bar, matched % by entity, and outstanding items by age bucket; (2) Exception Drill-Down — filterable table of unmatched transactions with match_confidence scores, currency, counterparty, and recommended actions; (3) Audit Trail — immutable log of all reconciliation decisions, user sign-offs, and exception resolutions with timestamp and commentary, exportable as PDF for regulatory submission. All reports secured with RLS ensuring each country's finance team only sees their jurisdiction's data.",
        insights: "Month-end reconciliation time slashed from 10 days to under 4 hours — a 96% reduction. Manual error rate eliminated entirely (previously ~3% causing $1.2M+/month in writeoffs and rework). Finance headcount previously dedicated to reconciliation redeployed to analysis and business partnering. First regulatory audit post-implementation passed with zero findings — auditors specifically noted the quality of the audit trail. The system now processes 52 million transactions annually with 99.97% match accuracy. CFO described the project as 'transforming reconciliation from our biggest risk into a competitive advantage.'",
        timeline: "2023",
        tags: ["Finance", "Python", "Compliance", "SQL", "Automation"],
        createdAt: "2023-11-20T00:00:00.000Z"
      },
      {
        id: "4",
        title: "AI-Driven Supply Chain Optimizer",
        industry: "Logistics",
        category: "AI/Analytics",
        status: "published",
        problem: "A pan-India logistics and 3PL provider managing inventory for 80+ FMCG brands was losing clients over persistent forecasting failures. Demand planners relied on 12-month rolling averages — a method that failed to capture seasonality, regional demand spikes, and external disruptions like port delays or weather events. Overstocking in slow-moving SKUs was tying up ₹18 crore in working capital monthly. Stock-outs on high-velocity products were causing SLA breaches and client churn. The planning team of 15 people spent 70% of their time pulling and reconciling data rather than making decisions.",
        architecture: "Built an end-to-end AI-powered planning platform on Azure. Azure Synapse Analytics serves as the data foundation, consolidating sales history, inventory positions, purchase orders, and logistics data from 6 source systems. A LangChain + Azure OpenAI GPT-4 integration creates a natural language interface over the data lake — supply chain managers can ask questions in plain English and receive SQL-backed, data-grounded answers. A RAG (Retrieval-Augmented Generation) layer grounds the LLM responses in company-specific inventory context, preventing hallucinations. Pinecone serves as the vector store for embedded product descriptions, historical demand patterns, and supplier risk profiles. Streamlit hosts the conversational dashboard interface for rapid prototyping, with migration to a Power BI Embedded solution planned.",
        tools: ["LangChain", "Azure OpenAI (GPT-4)", "Python", "Azure Synapse Analytics", "Pinecone", "Streamlit", "Prophet", "Azure Data Factory", "Power BI"],
        modeling: "Demand forecasting models built using Meta's Prophet for each SKU × warehouse combination, incorporating Indian calendar holidays, GST filing cycles (demand dips), and monsoon seasonality. 1,800+ individual forecast models trained and served via batch inference. Supplier risk scores calculated from on-time delivery rate, lead time variance, and geopolitical exposure indices. Vector embeddings generated using Azure OpenAI ada-002 for product descriptions and historical exception notes, enabling semantic search for precedent-based decision support. LangChain orchestrates a multi-tool agent that can query Synapse SQL, retrieve vector context from Pinecone, and call the Prophet API to generate real-time forecast updates.",
        pipeline: "Azure Data Factory pipelines run nightly consolidation of 6 source systems (WMS, TMS, ERP, e-commerce platforms) into Synapse. Prophet model retraining runs weekly as an Azure ML batch job, with model performance tracked in MLflow. Vector embeddings refreshed nightly in Pinecone as new demand data arrives. The LangChain agent is exposed via a FastAPI backend with session memory, enabling multi-turn conversational queries. Example queries the system handles: 'Which SKUs in Delhi warehouse are at risk of stock-out in the next 14 days?', 'Compare our top 3 suppliers' on-time delivery this quarter vs last quarter', 'If the Nhava Sheva port is disrupted for 5 days, which clients are most affected?'",
        dashboards: "Conversational AI interface as the primary UX — demand planners type questions and receive natural language answers backed by live data charts. Secondary Power BI report with 4 views: (1) Demand Forecast Accuracy tracker by SKU, brand, and warehouse; (2) Inventory Health Matrix — days-of-stock heatmap by SKU × location with overstocking and stock-out risk flags; (3) Supplier Scorecard — on-time delivery, lead time trends, and risk rating with recommended substitution options; (4) Working Capital Dashboard — capital tied up in slow-moving inventory, projected release from recommended markdowns and reorder adjustments.",
        insights: "Demand forecast accuracy improved from 61% to 83% MAPE — a 22-point gain enabling more confident replenishment decisions. Average stock-holding period reduced by 12 days, releasing ₹4.2 crore in working capital in the first quarter. Stock-out incidents on top-100 SKUs dropped by 31%, directly preventing SLA breach penalties. Planning team now spends 25% of time on data tasks (down from 70%), with the rest on strategic decisions — effectively doubling the team's analytical output without additional headcount. The conversational AI interface was adopted by 100% of the planning team within the first month, with an average of 47 queries per user per day.",
        timeline: "2024",
        tags: ["AI", "GenAI", "Supply Chain", "LangChain", "Forecasting"],
        createdAt: "2024-08-05T00:00:00.000Z"
      },
      {
        id: "5",
        title: "Enterprise Power BI Semantic Layer & Self-Service BI Platform",
        industry: "Retail & Consumer Goods",
        category: "BI",
        status: "published",
        problem: "A large retail chain with 300 stores and ₹1,200 crore in annual revenue had a BI chaos problem: 47 different Power BI reports built by different teams, none of which agreed on the same numbers. Revenue figures differed between the Sales report and the Finance report by up to 8% due to inconsistent business logic embedded in each file. Every report was a standalone .pbix with hardcoded DAX measures and no shared definitions. The IT team was fielding 15+ report requests per week and had a 3-month backlog. Business users had given up trusting the reports and were reverting to Excel. The CISO flagged that sensitive margin data was accessible to all 1,200 BI users with no governance.",
        architecture: "Designed and deployed a centralized Power BI semantic layer using a Certified Dataset (now Semantic Model) architecture. A single, governed Power BI Premium semantic model serves as the single source of truth — all 47 reports were deprecated and rebuilt against this one certified model. Implemented a Power BI Deployment Pipeline (Dev → Test → Prod) with branch-based development using .pbip (Power BI Project) files in Azure DevOps Git. Power BI Premium Per User licenses deployed for all report authors; viewers use standard Pro licenses via App Workspace deployment. Azure Analysis Services tabular model serves as the backend for the semantic layer, enabling enterprise-scale query performance and model partitioning.",
        tools: ["Power BI Premium", "DAX", "Power BI Deployment Pipelines", "Azure DevOps", "Azure Analysis Services", "Power Query (M)", "SQL Server", "Excel (via Analyze in Excel)", "Power BI REST API"],
        modeling: "Built a 42-measure DAX library covering Financial KPIs (Revenue, Gross Margin, EBITDA, Cost of Sales), Retail Operations (Same-Store Sales Growth, Basket Size, Conversion Rate, Shrinkage%), and HR metrics (Headcount, Attrition Rate, Revenue per Employee). All measures follow a naming convention and are organized into display folders. Time Intelligence implemented using a custom fiscal calendar (April–March) with DAX functions for MTD, QTD, YTD, LY, and rolling periods. Row-Level Security implemented at 3 levels: Store-level (managers see their outlet), Region-level (RMs see their cluster), and National (HO sees all). Object-Level Security hides the Margin and Cost columns from non-finance roles entirely.",
        pipeline: "Power Query M scripts in the semantic model handle incremental data refresh using RangeStart/RangeEnd parameters — only the last 7 days of transactions re-process per refresh cycle, reducing refresh time from 4 hours to 22 minutes for the 500M-row fact table. Azure Data Factory orchestrates upstream SQL Server loads that feed the semantic model. Power BI REST API integrated with Azure Logic Apps to trigger dataset refreshes immediately after upstream pipelines complete — eliminating the previous 2-hour fixed-schedule delays. Deployment Pipeline automated via Azure DevOps YAML pipeline: PRs trigger test workspace deployment, merge to main triggers production promotion with pre-deployment validation rules enforced.",
        dashboards: "Platform replaced 47 scattered reports with a curated catalog of 8 governed reports: (1) CEO Performance Suite — revenue waterfall, same-store growth matrix, and top/bottom 10 stores; (2) Category Management — product category P&L with margin contribution, sell-through rates, and markdown analysis; (3) Store Operations — daily sales vs. target, footfall, conversion, basket size with hour-of-day breakdown; (4) Merchandising Intelligence — planogram compliance scores, stock availability by category, and dead stock aging; (5) Finance Actuals vs Budget — full P&L with variance commentary prompts; (6) HR Workforce — headcount trend, attrition cohort analysis, and revenue-per-FTE benchmarking; (7) Customer RFM — Recency/Frequency/Monetary segmentation using loyalty card data; (8) Supply Chain Replenishment — store-level stock days, reorder triggers, and supplier fill rates. All reports published to a Power BI App with audience-based navigation.",
        insights: "Report count rationalized from 47 to 8 governed reports — reducing maintenance burden by 83%. Metric inconsistency eliminated: Finance and Sales now report identical revenue figures. Self-service adoption increased by 340%: business users now build their own pivot-style analysis using Analyze in Excel against the certified model. IT report backlog cleared and eliminated — no new requests pending after the platform went live. RLS implementation reduced data security incidents to zero (previously 3 per quarter). Semantic model query performance: P95 query time under 1.2 seconds for all reports, including the 500M-row sales fact table. C-suite now makes strategic decisions directly from Power BI dashboards in weekly Monday reviews — Excel decks in those meetings dropped from 100% to 0%.",
        timeline: "2024",
        tags: ["Power BI", "DAX", "Semantic Model", "Governance", "Self-Service"],
        createdAt: "2024-09-10T00:00:00.000Z"
      },
      {
        id: "6",
        title: "Real-Time Sales Performance & Incentive Analytics for Field Force",
        industry: "Pharmaceuticals / FMCG",
        category: "BI",
        status: "published",
        problem: "A mid-size pharmaceutical company with 800 field sales representatives across India had a fundamental transparency problem with their incentive compensation system. Sales reps received their quarterly bonus calculations 45 days after the quarter ended — in a black box Excel file they couldn't verify. Disputes consumed 30% of the HR and Finance team's bandwidth every quarter. Meanwhile, regional managers had no live visibility into territory performance, relying on week-old data from a fragile SAP Business Objects report that frequently broke. The VP Sales needed a solution that would motivate field reps in real-time, not reward them 45 days after the fact.",
        architecture: "Built a real-time sales performance and incentive transparency platform on Power BI Embedded integrated with the company's existing Salesforce CRM and SAP ERP. A Dataverse connector syncs Salesforce opportunity and visit data every 30 minutes. SAP data flows via an OData connector to Azure SQL Database as a staging layer. Power BI Embedded (A-SKU) serves the dashboard within the company's internal mobile app — field reps see their own performance and live incentive calculation on their phones without needing a Power BI license. A custom DAX incentive calculation engine replicates the full incentive plan logic (base quota attainment tiers, product mix bonuses, new doctor coverage, and RCPA compliance scores) producing month-to-date incentive estimates updated every 30 minutes.",
        tools: ["Power BI Embedded", "Power BI Premium (A-SKU)", "DAX", "Salesforce (OData)", "SAP ERP", "Azure SQL Database", "Power BI REST API", "Azure Active Directory B2C", "Power Automate"],
        modeling: "Incentive calculation model in DAX covers 6 plan components: (1) Quota Attainment — tiered % payout based on achievement brackets (0–80%, 80–100%, 100–120%, 120%+); (2) Product Mix Score — weighted achievement across 4 therapeutic areas; (3) Doctor Coverage — new doctor additions vs. target with diminishing returns curve; (4) RCPA Compliance Score — call frequency adherence to doctor-level norms; (5) Special Campaign Bonus — time-boxed product push multiplier; (6) Regional Rank Bonus — top quartile performers receive a multiplier. All calculations are fully reproducible in DAX, making them auditable and transparent to HR. RLS at the territory level — each rep sees only their own data; managers see their entire team.",
        pipeline: "Power Automate flows trigger a Power BI dataset refresh every 30 minutes during business hours (07:00–22:00 IST) and hourly overnight. Salesforce to Azure SQL sync via Azure Data Factory with change data capture on visit and opportunity objects. SAP BW data extracted via OData into the same Azure SQL staging layer. A data quality check job validates that daily sales totals reconcile between Salesforce and SAP before allowing the dataset refresh to proceed — preventing reps from seeing incorrect incentive calculations. Power BI REST API used to programmatically generate and email individual performance PDF snapshots to all 800 reps every Monday morning via Power Automate.",
        dashboards: "Mobile-first Power BI Embedded dashboard within the company app, with 3 tabs: (1) My Performance — MTD sales vs. quota, product mix achievement donut, doctor coverage progress, and RCPA compliance gauge; (2) My Incentive — live MTD incentive estimate with tier tracker showing exactly how much more revenue is needed to reach the next payout tier, with a 'what-if' slider to model the impact of closing specific open opportunities; (3) My Team (managers only) — territory heatmap of attainment, rep ranking table, and lagging indicator flags for at-risk territories. Manager dashboard includes an AI-powered commentary field generated by Azure OpenAI summarizing each rep's key performance drivers and recommended coaching actions.",
        insights: "Incentive disputes dropped from 30% of HR bandwidth to near zero — reps now see live, transparent calculations and trust the numbers before the quarter ends. Field rep motivation measurably improved: quota attainment in the top tier (120%+ achievement) increased by 19% in the first post-launch quarter as reps could see in real-time exactly what they needed to close to reach the next payout level. Regional managers reduced weekly reporting preparation from 6 hours to 0 — all performance conversations now happen directly from the live dashboard. The platform achieved 94% daily active usage rate among field reps within 6 weeks of launch. Finance closed the quarterly incentive calculation 3 weeks faster than before, reducing payroll processing time by 67%.",
        timeline: "2024",
        tags: ["Power BI Embedded", "DAX", "Sales Analytics", "Incentive", "Mobile BI"],
        createdAt: "2024-07-22T00:00:00.000Z"
      },
      {
        id: "7",
        title: "Executive Strategy & KPI Command Center",
        industry: "Professional Services / Consulting",
        category: "BI",
        status: "published",
        problem: "A fast-growing management consulting firm with 1,400 employees and $120M ARR had an executive reporting problem that was costing it credibility. The weekly Leadership Review consumed 3 hours of preparation every Friday — 4 analysts manually pulling numbers from 9 systems (Salesforce, NetSuite, Workday, Jira, and others), assembling a PowerPoint deck, and emailing it to the leadership team Saturday morning. Numbers were already 24 hours stale when leadership read them Sunday night. Strategy discussions at Monday board meetings were based on week-old data. Two consecutive quarters of missed utilization targets had gone undetected until month-end because no one had a live view of the leading indicators. The MD wanted a single pane of glass — live, trustworthy, and mobile-friendly.",
        architecture: "Engineered an Executive Intelligence Hub using Power BI as the front-end connected to a custom Azure SQL analytical data store fed by Azure Data Factory pipelines from 9 source systems. Built a unified data model that maps the firm's operational KPIs to its strategic OKR framework — every metric on the dashboard traces back to one of the 5 firm-level strategic objectives for the year. Power BI Premium capacity deployed for guaranteed query performance and paginated report generation. Azure Analysis Services tabular model serves the semantic layer with pre-aggregated partitions for the 5-year historical dataset. The dashboard is embedded in the firm's SharePoint intranet via Power BI Embed for a seamless experience requiring no additional logins.",
        tools: ["Power BI Premium", "Azure Analysis Services", "Azure Data Factory", "Azure SQL", "DAX", "Salesforce", "NetSuite", "Workday", "Paginated Reports (SSRS/Power BI)", "SharePoint Embed", "Power Automate"],
        modeling: "Balanced scorecard data model covering 4 strategic perspectives: Financial (Revenue, GP%, EBITDA, DSO, ARR Growth), Client (NPS, Project Delivery On-Time%, Client Retention Rate, Avg Project Value), People (Billable Utilization, Attrition, Hiring vs. Plan, Time-to-Productivity for new hires), and Innovation (IP Revenue, New Service Revenue%, Thought Leadership Output). 68 DAX measures organized into 4 perspective display folders. Composite model combines DirectQuery (for live Salesforce pipeline data) with Import (for historical financials from NetSuite). Custom fiscal year calendar (July–June) with DAX period intelligence for YTD, Rolling-12, and Quarter-over-Quarter comparisons. What-if scenario modeling using DAX calculation groups to model utilization rate, billing rate, and headcount scenarios.",
        pipeline: "9 source system connectors built in Azure Data Factory — OAuth2 for Salesforce and Workday, REST API for Jira, direct SQL replication for NetSuite via Azure SQL Managed Instance link. All pipelines run on a 4-hour refresh cycle with Salesforce running every 30 minutes for live pipeline data. Data quality validation layer checks for referential integrity, completeness, and reasonableness (e.g., utilization rate cannot exceed 100%) before data lands in the analytical store. Automated alert system via Power Automate: if any KPI breaches a configured threshold (e.g., utilization drops below 72% for 3 consecutive days), an alert card is automatically posted to the Leadership Teams channel with the relevant chart embedded. Paginated reports auto-generated monthly as PDF board packs distributed via Power Automate.",
        dashboards: "4-layer dashboard architecture: (1) C-Suite Dashboard — single-screen scorecard with all 68 KPIs displayed as micro-charts with RAG status, trend direction, and vs-target variance, designed for a 5-minute morning review; (2) Revenue Intelligence — sales pipeline waterfall (Identified → Qualified → Proposed → Won/Lost), win rate by service line and partner, deal velocity, and revenue concentration risk; (3) Talent & Utilization — real-time billable utilization by practice, grade, and individual; bench aging dashboard showing utilization risk for employees approaching 20% billable time; (4) Delivery Health — active project dashboard with RAG status, milestone completion rate, budget burn, and client satisfaction NPS trend. Mobile layout optimized for iPhone Pro — MD reviews KPIs during the morning commute. What-if scenario modeling page lets partners simulate the revenue impact of hiring decisions or billing rate changes.",
        insights: "Friday reporting preparation eliminated completely — 3 hours/week × 4 analysts = 624 hours/year reclaimed. Leadership team now arrives at Monday board meetings having already reviewed live data, shifting meeting focus from 'what happened' to 'what should we do'. Utilization visibility caught a 3-week utilization dip at 68% (vs. 76% target) in real-time — enabling management to reassign 12 analysts to billable projects immediately, preventing an estimated $180,000 revenue shortfall. Revenue concentration risk visualization revealed that 3 clients represented 41% of revenue — directly triggering a client diversification initiative. Quarterly board pack preparation time reduced from 3 days to 4 hours. NPS tracking revealed a correlation between project delivery delays and NPS decline 6 weeks later — now used as a leading indicator to proactively address at-risk client relationships.",
        timeline: "2025",
        tags: ["Power BI", "Executive BI", "KPI", "OKR", "Strategy", "Premium"],
        createdAt: "2025-01-15T00:00:00.000Z"
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
