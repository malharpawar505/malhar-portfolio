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
        industry: "Consulting",
        status: "published",
        timeline: "8 weeks",
        problem: "The consulting firm managed 20+ concurrent client projects but lacked unified visibility into portfolio health. Project managers relied on scattered spreadsheets and manual status emails, leading to delayed risk detection, budget overruns going unnoticed until month-end close, and executives requesting ad-hoc data pulls that consumed analyst time.",
        architecture: "Built a centralized semantic model pulling from SQL Server (project metadata, financials), SharePoint lists (milestone tracking), and Excel exports (resource allocation). Implemented a star schema with a central fact table for project metrics connected to dimension tables for clients, teams, time periods, and project phases. Data refreshes on a 4-hour schedule via Power BI Gateway.",
        modeling: "Designed 12 table relationships with proper cardinality and cross-filter direction. Created a dedicated date dimension with fiscal calendar support. Implemented role-playing dimensions for planned vs actual dates. Built 43 DAX measures including time-intelligence calculations for YoY and MoM comparisons, budget burn-rate projections, and weighted project health scores.",
        dashboards: "5-page report: Executive Summary with portfolio-level KPIs and RAG status matrix, Resource Utilization heatmap showing team allocation across projects, Budget Tracker with variance waterfall charts, Milestone Timeline with Gantt-style visual, and a Drillthrough Detail page for individual project deep-dives. Implemented row-level security for client-segregated views.",
        insights: "Reduced manual reporting effort by 15+ hours per week. Identified two at-risk projects 3 weeks earlier than previous process. Budget variance visibility improved from monthly to near real-time. Executive team adopted the dashboard as the single source of truth for steering committee meetings.",
        tools: ["Power BI", "DAX", "SQL Server", "Star Schema", "Data Modeling", "Power Query", "RLS"],
        description: "Enterprise-grade Power BI dashboard for PMO operations tracking across multiple projects.",
        impactMetric: "43 DAX Measures · 5 Report Pages",
        impactOutcome: "Reduced manual reporting effort by 15+ hours/week and enabled early risk detection across 20+ concurrent projects.",
        createdAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: "2",
        title: "Power BI Custom Visual (pbiviz)",
        category: "BI",
        industry: "Enterprise Software",
        status: "published",
        timeline: "4 weeks",
        problem: "A client needed to display live data from a third-party REST API directly inside Power BI reports — not as an embedded iframe or external link, but as a native visual that responds to slicers, cross-filters, and report-level filters. Out-of-the-box Power BI visuals don't support external API calls, and Power Query scheduled refresh wasn't fast enough for near real-time requirements.",
        architecture: "Built using Microsoft's pbiviz SDK with TypeScript. The visual registers as a native Power BI custom visual (.pbiviz file) and is deployed through the organization's visual gallery. It accepts configuration via the Format Pane (API endpoint URL, auth token, refresh interval, display fields) and makes authenticated REST calls at render time. Data is merged client-side with the visual's dataView for slicer interactivity.",
        modeling: "The visual accepts a Power BI dataView with category and measure bindings, which are used as parameters for the API call. Response JSON is parsed, mapped to a configurable schema, and rendered alongside the bound BI data. Supports conditional formatting rules defined in the Format Pane.",
        dashboards: "Deployed as a certified organizational visual available to all report authors. Includes a settings panel for endpoint configuration, field mapping, polling interval, and error display preferences. Visual integrates seamlessly with existing report themes and supports both light and dark mode.",
        insights: "Eliminated the need for a separate monitoring tool — stakeholders see live external data alongside internal BI metrics in a single report. Reduced context-switching for analysts who previously toggled between Power BI and the third-party dashboard. Reusable across multiple reports with different API endpoints.",
        tools: ["Power BI", "TypeScript", "REST API", "pbiviz SDK", "D3.js", "Node.js"],
        description: "Built a production-ready custom pbiviz visual with format-pane-configurable fields and live API endpoint integration.",
        impactMetric: "Live API data inside native Power BI visuals",
        impactOutcome: "Enabled real-time third-party data rendering inside Power BI without iframes, adopted across 5+ enterprise reports.",
        createdAt: "2024-02-01T00:00:00.000Z"
      },
      {
        id: "3",
        title: "StockStream — Real-Time Market Data Pipeline",
        category: "Data Engineering",
        industry: "Financial Services",
        status: "published",
        timeline: "6 weeks",
        problem: "Needed a production-grade data pipeline to ingest, clean, and serve real-time NIFTY 50 stock market data for analytics and dashboarding. Manual CSV downloads were slow, error-prone, and couldn't scale to daily automated runs across 50 tickers with historical backfill.",
        architecture: "End-to-end Azure Data Factory pipeline with Medallion Architecture (Bronze → Silver → Gold). Bronze layer lands raw JSON from Alpha Vantage API into Azure Data Lake Gen2 as timestamped files. Silver layer applies schema enforcement, deduplication, null handling, and type casting via Data Flow transformations. Gold layer aggregates into analytics-ready tables — daily OHLCV summaries, moving averages, and sector-level rollups stored as Delta Lake tables.",
        pipeline: "ADF pipeline orchestrates 50 parallel API calls with rate-limiting logic (5 calls/min API constraint). Implements retry policies with exponential backoff, dead-letter logging for failed tickers, and a metadata-driven approach where ticker lists are maintained in a config table. Pipeline runs daily at market close (3:30 PM IST) with a weekend skip condition. Monitoring via ADF alerts and a custom pipeline health dashboard.",
        modeling: "Gold layer follows a star schema: fact_daily_prices (OHLCV + volume + computed moving averages) with dim_ticker (company metadata, sector, market cap) and dim_date (trading calendar with holiday flags). Designed for both Power BI Direct Query and Python analytical workloads.",
        dashboards: "Power BI report connected to Gold layer showing real-time market overview, sector performance heatmap, top gainers/losers, and individual stock drill-through with 50/200-day moving average overlays. Includes a data quality summary page showing pipeline run history, row counts, and freshness timestamps.",
        insights: "Processed 3.2M+ historical rows across 50 tickers. Pipeline runs with 99.4% success rate over 3 months. Average end-to-end latency: 4.1 seconds per ticker. Demonstrated production ADF patterns — parameterized pipelines, error handling, and Delta Lake integration — used in interview presentations and client demos.",
        tools: ["Azure Data Factory", "Azure Data Lake Gen2", "Python", "Medallion Architecture", "Alpha Vantage API", "Delta Lake", "Power BI"],
        description: "End-to-end Azure data pipeline ingesting real-time NIFTY 50 stock data with full Medallion Architecture.",
        impactMetric: "3.2M+ rows · 50 tickers · 99.4% success rate",
        impactOutcome: "Automated daily ingestion with Bronze → Silver → Gold layers, replacing manual CSV workflows entirely.",
        createdAt: "2024-03-01T00:00:00.000Z"
      },
      {
        id: "4",
        title: "MCP Server for Power BI & Azure Analysis Services",
        category: "AI",
        industry: "AI & Analytics",
        status: "published",
        timeline: "5 weeks",
        problem: "Business users needed to query Power BI semantic models using natural language, but existing 'Q&A' features in Power BI are limited to simple questions and can't handle complex analytical queries, multi-step reasoning, or context-aware follow-ups. The goal was to connect Claude AI directly to live semantic models so users could ask questions like 'What was the revenue trend for the top 5 stores in Q3 compared to Q2?' and receive accurate answers pulled from real data.",
        architecture: "Built a Model Context Protocol (MCP) server in Python that acts as a secure bridge between Claude AI and Power BI / Azure Analysis Services. The server exposes tools for listing tables, querying measures, executing DAX queries, and exploring model metadata. Claude calls these tools during conversation to fetch live data, then synthesizes the results into natural language responses. Supports both Power BI Desktop (local SSAS instance via MSOLAP) and Azure Analysis Services (XMLA endpoints with AAD auth).",
        pipeline: "The MCP server connects via COM/ADODB on Windows for local Power BI Desktop models, or via XMLA endpoints with service principal authentication for Azure Analysis Services. DAX queries are constructed by Claude based on semantic model metadata (table names, measure definitions, relationships) and executed in real-time. Results are returned as JSON and interpreted by Claude in context.",
        insights: "A genuinely novel integration — business users can ask complex analytical questions in plain English and receive answers pulled directly from live semantic models. Overcame major technical challenges including COM/ADODB Windows integration, MSOLAP driver configuration, and XMLA endpoint authentication. Positioned as a key differentiator for AI-powered BI consulting engagements. Open-sourced the core server implementation.",
        tools: ["Python", "MCP Protocol", "Claude AI", "Power BI Desktop", "Azure Analysis Services", "DAX", "XMLA", "MSOLAP"],
        description: "Model Context Protocol server connecting Claude AI to live Power BI semantic models for natural language querying.",
        impactMetric: "Natural language → DAX execution on live models",
        impactOutcome: "Enabled non-technical users to query enterprise BI data conversationally, eliminating dependency on analysts for ad-hoc data requests.",
        createdAt: "2024-04-01T00:00:00.000Z"
      },
      {
        id: "5",
        title: "Azure AI Foundry — Enterprise Conversational Agent",
        category: "AI",
        industry: "Enterprise",
        status: "published",
        timeline: "4 weeks",
        problem: "A client engagement required an intelligent conversational agent that could handle customer inquiries, perform data lookups against internal systems, and route complex requests to human agents — all while maintaining conversation context across multi-turn interactions. Off-the-shelf chatbot builders lacked the reasoning capability and tool-use flexibility needed for production-grade enterprise conversations.",
        architecture: "Built on Azure AI Foundry using GPT-4.1 as the reasoning engine. The agent architecture includes a system prompt with role definition and guardrails, a tool registry with 6 custom functions (customer lookup, order status, knowledge base search, escalation trigger, sentiment analysis, response formatting), and a conversation memory layer using Azure Cosmos DB for multi-turn context persistence. Deployed as a REST API behind Azure API Management with rate limiting and authentication.",
        pipeline: "Request flow: incoming message → API Management → AI Foundry agent → tool calls (if needed) → response generation → conversation state persistence → response delivery. Each tool call is logged for audit trail compliance. Implements graceful degradation — if a tool call fails, the agent acknowledges the limitation and offers alternative paths rather than hallucinating.",
        insights: "Delivered as a fully documented solution with architecture diagrams and security compliance documentation. The agent handles 85% of incoming queries without human escalation. Average response time: 2.3 seconds including tool calls. Conversation memory enables coherent multi-turn interactions spanning days. Client reported 40% reduction in tier-1 support ticket volume within the first month of deployment.",
        tools: ["Azure AI Foundry", "GPT-4.1", "Python", "REST API", "Tool Use", "Azure Cosmos DB", "Azure API Management"],
        description: "Production-grade conversational AI agent with tool use, memory, and multi-turn conversation capability.",
        impactMetric: "85% query resolution without human escalation",
        impactOutcome: "Reduced tier-1 support ticket volume by 40% within first month. 2.3s average response time with full tool-use capability.",
        createdAt: "2024-05-01T00:00:00.000Z"
      },
      {
        id: "6",
        title: "Microsoft Fabric Lakehouse Analytics Platform",
        category: "Data Engineering",
        industry: "QSR & Retail",
        status: "published",
        timeline: "10 weeks",
        problem: "The existing analytics stack relied on Power BI Import mode with scheduled refreshes every 2 hours. For a fast-moving QSR operation with 100+ stores, this meant analysts were always working with stale data. Large datasets (10M+ rows) caused refresh timeouts and the 1GB dataset size limit forced aggressive data pruning that eliminated historical trend analysis capability.",
        architecture: "Migrated to Microsoft Fabric with a Lakehouse-centered architecture. Data lands in OneLake from operational databases (SQL Server, PostgreSQL) and flat files (SFTP CSV drops) via Fabric Data Pipelines. Lakehouse stores data in open Delta/Parquet format accessible via SQL Analytics Endpoint, Spark notebooks, and Power BI Direct Lake mode. Implemented a three-layer Medallion Architecture within the Lakehouse — Bronze (raw), Silver (cleaned/conformed), Gold (business-aggregated).",
        pipeline: "Fabric Data Pipelines handle orchestration with parameterized Copy activities and Dataflow Gen2 transformations. Bronze ingestion runs every 30 minutes for transactional data and daily for master data. Silver transformations apply schema enforcement, SCD Type 2 for slowly changing dimensions, and business rule validations. Gold layer materializes pre-aggregated tables optimized for Power BI Direct Lake consumption. Pipeline monitoring through Fabric's built-in monitoring hub with custom alerting via Power Automate.",
        modeling: "Semantic model built on Direct Lake mode — queries OneLake Parquet files directly without data import, enabling sub-second performance on 10M+ row datasets with no refresh delays. Star schema with 8 fact tables and 12 dimensions. Key measures leverage DAX calculation groups for dynamic currency conversion and time intelligence across multiple fiscal calendars.",
        dashboards: "6-page Power BI report suite: Store Operations Scorecard, Sales Performance Deep-Dive, Inventory & Waste Analytics, Labor Efficiency Dashboard, Customer Satisfaction Tracker, and Executive Summary with AI-generated narrative insights. All reports leverage Direct Lake for real-time data access.",
        insights: "Query performance improved from 8-12 seconds (Import mode) to sub-second (Direct Lake). Eliminated 2-hour data staleness — analysts now see data within 30 minutes of transactions. Dataset size constraint removed — full 3-year history available for trend analysis. Refresh timeout issues completely eliminated. Implementation served dual purpose: DP-600 certification preparation and live client environment upgrade.",
        tools: ["Microsoft Fabric", "Lakehouse", "OneLake", "Power BI", "Direct Lake", "SQL Analytics Endpoint", "Delta Lake", "Dataflow Gen2"],
        description: "End-to-end Fabric Lakehouse platform with Medallion Architecture and Direct Lake-connected Power BI.",
        impactMetric: "Sub-second queries on 10M+ rows via Direct Lake",
        impactOutcome: "Replaced import-mode BI with real-time Direct Lake analytics, eliminating refresh delays and dataset size limits.",
        createdAt: "2024-06-01T00:00:00.000Z"
      },
      {
        id: "7",
        title: "QSR Operations Scorecard — Multi-Country Analytics",
        category: "BI",
        industry: "QSR & Retail",
        status: "published",
        timeline: "12 weeks",
        problem: "A global QSR brand operating across 5 countries needed a unified operations scorecard to benchmark store performance, but each country used different POS systems, currencies, and KPI definitions. Existing reporting was siloed — country managers produced their own Excel reports with inconsistent metrics, making cross-country comparison impossible for the regional leadership team.",
        architecture: "Centralized data warehouse approach: extracted data from 5 different POS systems (Oracle MICROS, Square, Lightspeed, custom SQL databases) into Azure SQL Database via Azure Data Factory. Built a conformed dimension layer that standardizes product categories, store hierarchies, and time zones across countries. Currency conversion handled via a daily FX rate table with historical rates for accurate trend analysis.",
        modeling: "Unified star schema with conformed dimensions across all countries. fact_daily_sales (transactions, revenue, avg ticket), fact_labor (hours, cost, efficiency), fact_inventory (waste, usage, cost%). Dimension tables include dim_store (with country, region, format hierarchies), dim_product (with global and local category mappings), dim_employee (role-based aggregation). 65+ DAX measures with calculation groups for currency conversion and same-store comparison logic.",
        dashboards: "8-page interactive report: Global Overview (map visual with store-level drill-down), Country Comparison Matrix, Store Performance Rankings (with percentile bands), Sales Trend Analysis (with seasonality decomposition), Labor Efficiency Scorecard, Food Cost & Waste Tracker, Customer Satisfaction Index, and a Mobile-Optimized Executive View. Dynamic currency toggle lets executives view all data in USD, EUR, or local currency.",
        insights: "Identified that two underperforming countries had 15% higher food waste than the regional average — triggering a targeted operational review that saved an estimated $180K annually. Same-store sales comparison revealed that stores with morning-shift staffing above a specific threshold consistently outperformed, leading to a staffing policy change across 30+ locations. Report adopted as the primary tool for quarterly business reviews.",
        tools: ["Power BI", "Azure SQL Database", "Azure Data Factory", "DAX", "Star Schema", "Power Query", "Calculation Groups"],
        description: "Unified multi-country operations scorecard standardizing KPIs across 5 POS systems and currencies.",
        impactMetric: "5 countries · 100+ stores · 65 DAX measures",
        impactOutcome: "Enabled cross-country benchmarking that identified $180K in annual food waste savings and drove staffing policy changes.",
        createdAt: "2024-07-01T00:00:00.000Z"
      },
      {
        id: "8",
        title: "Automated Data Reconciliation Engine",
        category: "Data Engineering",
        industry: "Finance",
        status: "published",
        timeline: "6 weeks",
        problem: "Finance teams spent 3 days every month manually reconciling data between the ERP system, banking platforms, and the data warehouse. Discrepancies were caught late in the month-end close cycle, causing delayed financial reporting and occasional restatements. The manual process involved downloading CSVs, running VLOOKUP formulas, and highlighting mismatches in Excel — error-prone and unauditable.",
        architecture: "Built a Python-based reconciliation engine deployed as Azure Functions with a scheduled trigger. The engine connects to source systems (SAP via RFC, banking APIs, Azure SQL warehouse) and performs automated three-way matching. Results are written to a reconciliation log table with match status, variance amounts, and suggested resolutions. A Power BI dashboard provides real-time visibility into reconciliation status.",
        pipeline: "Azure Function triggers daily at 6 AM: extracts data from SAP (GL balances), banking platform (transaction feeds), and data warehouse (aggregated figures). Python/Pandas performs fuzzy matching on transaction references, exact matching on amounts with configurable tolerance thresholds, and date-range matching for timing differences. Unmatched items are categorized (timing difference, amount mismatch, missing record) and routed to the appropriate team's queue.",
        modeling: "Reconciliation data model: fact_recon_results (source_amount, target_amount, variance, match_status, match_type, resolution_status), dim_recon_rule (matching criteria, tolerance, priority), dim_source_system. Historical results enable trend analysis — recurring mismatches are flagged for root cause investigation.",
        dashboards: "Power BI reconciliation dashboard: Match Summary (pie chart of matched/unmatched/pending), Variance Waterfall (showing net discrepancy by category), Aging Report (unresolved items by days outstanding), Trend Analysis (monthly match rate over time), and a Detail Drillthrough for individual transaction investigation. Email alerts trigger when variance exceeds configurable thresholds.",
        insights: "Reduced reconciliation effort from 3 days to 4 hours per month-end cycle. Match rate improved from 82% (manual) to 96% (automated) in the first month. Identified a systematic $12K monthly timing difference that had been manually adjusted for 2 years without investigation — root cause was a batch job scheduling misalignment. Finance team now closes books 2 days faster.",
        tools: ["Python", "Pandas", "Azure Functions", "SAP RFC", "Azure SQL", "Power BI", "Power Automate"],
        description: "Automated three-way reconciliation engine replacing manual Excel-based month-end processes.",
        impactMetric: "3 days → 4 hours monthly reconciliation",
        impactOutcome: "96% automated match rate, 2-day faster month-end close, and identified a systematic $12K/month discrepancy.",
        createdAt: "2024-08-01T00:00:00.000Z"
      },
      {
        id: "9",
        title: "Snowflake Data Warehouse Migration",
        category: "Data Engineering",
        industry: "Finance",
        status: "published",
        timeline: "14 weeks",
        problem: "The organization ran analytics on an on-premise SQL Server data warehouse that was hitting performance ceilings — complex queries took 45+ minutes, storage costs were rising with data growth, and scaling required expensive hardware procurement with 8-week lead times. The BI team couldn't run ad-hoc analysis during business hours without impacting production report refresh cycles.",
        architecture: "Migrated to Snowflake on Azure with a multi-cluster warehouse architecture. Designed separate virtual warehouses for ETL (XL, auto-suspend), BI reporting (M, auto-scale 1-3 clusters), and ad-hoc analysis (S, auto-suspend). Data organized in a three-schema pattern: RAW (ingestion landing), CURATED (transformed/conformed), and CONSUMPTION (BI-optimized views and materialized tables). Implemented Snowflake's time travel (7-day retention) and fail-safe for data recovery.",
        pipeline: "Migration pipeline: Azure Data Factory extracts from SQL Server source tables, stages in Azure Blob Storage, and loads into Snowflake RAW schema via COPY INTO commands. Transformation layer uses Snowflake SQL tasks and stored procedures for SCD Type 2 processing, data quality checks, and aggregation. Orchestrated by ADF with dependency chains and failure notifications. Historical data backfill (5 years, 2B rows) completed in a single weekend using Snowflake's elastic compute.",
        modeling: "Consumption layer follows a dimensional model with 15 fact tables and 20+ dimensions. Implemented zero-copy cloning for development and testing environments — analysts can clone production datasets instantly without storage duplication. Materialized views handle pre-aggregation for common BI query patterns. Dynamic data masking applied to PII columns for non-privileged roles.",
        dashboards: "Existing Power BI reports re-pointed to Snowflake via DirectQuery connector. Query performance improved 10-20x, enabling reports that previously required Import mode to run in DirectQuery. Added a new Data Platform Health dashboard showing Snowflake credit consumption, query performance trends, warehouse utilization, and storage growth projections.",
        insights: "Query performance improved from 45+ minutes to under 30 seconds for complex analytical queries. BI report refresh reduced from 2 hours to 8 minutes. Eliminated production vs analytics contention — ad-hoc analysis runs on isolated compute without impacting reports. Storage costs reduced 35% via Snowflake's compression and micro-partitioning. Annual infrastructure cost dropped despite 3x data volume growth due to pay-per-use compute model.",
        tools: ["Snowflake", "Azure Data Factory", "SQL Server", "Azure Blob Storage", "Power BI", "Python", "dbt"],
        description: "Full data warehouse migration from on-premise SQL Server to Snowflake with multi-cluster architecture.",
        impactMetric: "45 min → 30 sec queries · 35% storage cost reduction",
        impactOutcome: "10-20x query performance improvement, eliminated compute contention, and reduced infrastructure costs despite 3x data growth.",
        createdAt: "2024-09-01T00:00:00.000Z"
      },
      {
        id: "10",
        title: "HR Workforce Analytics Dashboard",
        category: "BI",
        industry: "Human Resources",
        status: "published",
        timeline: "6 weeks",
        problem: "HR leadership lacked data-driven insights into workforce trends. Employee attrition analysis was reactive — exit interviews happened after people left, but there was no predictive view. Headcount reporting was manual (HR managers emailed spreadsheets monthly), and diversity metrics were tracked in a separate, outdated system that nobody trusted.",
        architecture: "Connected Power BI to the HRIS system (BambooHR API) and payroll database (ADP via ODBC). Built an incremental refresh pipeline in Power Query that pulls new/modified employee records daily. Historical snapshots captured monthly for point-in-time headcount analysis. Sensitive data (salary, performance ratings) handled via column-level security and RLS by HR business partner territory.",
        modeling: "Slowly changing dimension Type 2 for employee records — tracks department transfers, promotions, and reporting line changes over time. fact_headcount (monthly snapshot), fact_attrition (termination events with reason codes), fact_recruitment (pipeline stages, time-to-fill). 40+ measures including rolling 12-month attrition rate, diversity representation by level, span of control analysis, and compensation band distribution.",
        dashboards: "5-page report: Headcount Overview (treemap by department with growth trend sparklines), Attrition Analysis (survival curves, risk heatmap by tenure band × department), Recruitment Funnel (stage conversion rates, time-to-fill benchmarks), Diversity & Inclusion Scorecard (representation by level, gender, and ethnicity with goal tracking), and Compensation Analysis (band distribution, compa-ratio spreads, equity flags). All pages filtered by business unit, location, and time period.",
        insights: "Identified that the engineering department had 2.3x higher attrition in the 12-18 month tenure band compared to company average — investigation revealed an onboarding gap. Recruitment funnel analysis showed that one hiring stage had a 60% drop-off rate — process redesign improved offer acceptance by 25%. Diversity dashboard revealed under-representation at senior levels despite balanced entry-level hiring, prompting a mentorship program initiative.",
        tools: ["Power BI", "BambooHR API", "ADP", "Power Query", "DAX", "RLS", "Star Schema"],
        description: "Workforce analytics platform with attrition prediction, diversity tracking, and recruitment funnel analysis.",
        impactMetric: "5 dashboards · 40+ measures · 3 actionable interventions",
        impactOutcome: "Drove a 25% improvement in offer acceptance rate and identified a 2.3x attrition hotspot leading to onboarding redesign.",
        createdAt: "2024-10-01T00:00:00.000Z"
      },
      {
        id: "11",
        title: "Real-Time IoT Sensor Data Pipeline",
        category: "Data Engineering",
        industry: "Manufacturing",
        status: "published",
        timeline: "8 weeks",
        problem: "A manufacturing facility had 200+ IoT sensors monitoring temperature, pressure, vibration, and humidity across production lines, but data was siloed in the sensor vendor's proprietary platform with no integration to the company's analytics stack. Equipment failures were detected only after they caused production line stops — costing an average of $15K per hour of unplanned downtime.",
        architecture: "Event-driven streaming architecture: IoT sensors publish to Azure IoT Hub, which routes messages to Azure Event Hubs for buffering. Azure Stream Analytics processes events in real-time — applying windowed aggregations (5-min, 15-min, 1-hour averages), anomaly detection rules (z-score based threshold breach), and alert triggers. Processed data lands in Azure Data Lake Gen2 (Parquet) for historical analysis and Azure SQL Database for real-time dashboarding.",
        pipeline: "Stream Analytics job runs continuously with a 5-second tumbling window for anomaly detection and a 15-minute hopping window for trend calculations. Anomaly alerts trigger Power Automate flows that send Teams notifications to maintenance teams with sensor ID, reading, threshold, and recommended action. Historical data pipeline runs hourly — compacts streaming output into optimized Parquet files partitioned by date and production line. Retention: 90 days hot (SQL), 2 years warm (ADLS), 7 years cold (Archive tier).",
        modeling: "Time-series data model: fact_sensor_readings (timestamp, sensor_id, value, unit, quality_flag), fact_anomaly_events (detection_time, sensor_id, anomaly_type, severity, resolved_flag), dim_sensor (location, type, calibration_date, threshold_config), dim_production_line (line_id, product_type, shift_schedule). Pre-aggregated tables at 15-min, hourly, and daily granularity for dashboard performance.",
        dashboards: "Real-time monitoring dashboard with auto-refresh every 30 seconds: Production Line Overview (sensor status grid with color-coded health), Anomaly Alert Feed (live stream of threshold breaches), Trend Analysis (multi-line charts with configurable time windows), Equipment Health Score (composite metric combining multiple sensor readings), and Historical Comparison (overlay current shift vs previous shifts). Mobile-optimized for floor supervisors.",
        insights: "Detected a gradual vibration increase on a critical motor 72 hours before it would have failed — scheduled maintenance during planned downtime instead of emergency repair. Estimated savings: $45K in avoided unplanned downtime. Temperature anomaly correlation analysis revealed that ambient temperature above 32°C degraded product quality by 8% — led to HVAC upgrade investment. System processes 50K+ events per minute with sub-second alerting latency.",
        tools: ["Azure IoT Hub", "Azure Event Hubs", "Azure Stream Analytics", "Azure Data Lake Gen2", "Azure SQL", "Power BI", "Power Automate"],
        description: "Real-time IoT streaming pipeline with anomaly detection and predictive maintenance alerting.",
        impactMetric: "50K events/min · $45K saved in avoided downtime",
        impactOutcome: "Predicted equipment failure 72 hours in advance, enabling proactive maintenance and reducing unplanned downtime by 60%.",
        createdAt: "2024-11-01T00:00:00.000Z"
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
