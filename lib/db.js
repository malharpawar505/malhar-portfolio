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
        title: "Supply Chain Visibility & Demand Planning Dashboard",
        category: "BI",
        industry: "Manufacturing & Logistics",
        status: "published",
        timeline: "10 weeks",
        problem: "A mid-size manufacturer with 3 distribution centers and 200+ SKUs lacked end-to-end supply chain visibility. Procurement, warehousing, and logistics teams operated on separate spreadsheets. Stock-outs cost an estimated $500K/year in lost sales, while excess inventory tied up $1.2M in working capital. Demand forecasting was done quarterly in Excel with no statistical rigor — forecast accuracy hovered around 55%.",
        architecture: "Built a unified supply chain data model connecting ERP (SAP Business One via ODBC), warehouse management system (WMS REST API), logistics partner feeds (daily SFTP CSV drops), and POS sell-through data (Azure SQL). Azure Data Factory orchestrates daily ingestion into Azure SQL Database. Power Query handles last-mile transformations including unit-of-measure normalization, lead-time calculations, and ABC/XYZ inventory classification.",
        modeling: "Star schema with fact_inventory_snapshots (daily stock levels by SKU × location), fact_purchase_orders (PO lifecycle — raised, confirmed, received, variance), fact_shipments (carrier, transit time, on-time delivery flag), fact_demand (daily sell-through by SKU × channel). Dimensions: dim_product (with ABC classification, supplier lead time, reorder point), dim_warehouse (capacity, region, type), dim_supplier (performance score, payment terms). 55+ DAX measures including inventory days-on-hand, stockout frequency, fill rate, demand forecast accuracy (MAPE), and safety stock recommendations using statistical reorder point calculations.",
        dashboards: "7-page report: Executive Supply Chain Scorecard (KPI cards — fill rate, OTIF, inventory turns, stockout rate), Inventory Health Matrix (ABC × XYZ classification heatmap with action flags), Demand vs Actual Analysis (forecast accuracy by product family with trend decomposition), Supplier Performance Tracker (lead time reliability, quality reject rate, cost variance), Warehouse Utilization Dashboard (capacity heatmap, aging stock alerts), Purchase Order Pipeline (open POs, expected deliveries, GRN tracking), and a Drillthrough SKU Detail page. Mobile-optimized for warehouse managers doing floor walks.",
        insights: "Improved demand forecast accuracy from 55% to 78% using 12-month weighted moving average model surfaced in DAX. Identified 45 SKUs classified as 'dead stock' (>180 days on hand, <5 units sold/quarter) — clearance program recovered $180K in tied-up capital. Supplier scorecard revealed one vendor with 40% late delivery rate was the root cause of 60% of stockouts — triggered renegotiation and backup sourcing. Fill rate improved from 88% to 96% within 3 months of dashboard adoption.",
        tools: ["Power BI", "DAX", "Azure Data Factory", "Azure SQL", "Power Query", "Star Schema", "SAP Business One"],
        description: "End-to-end supply chain analytics covering inventory, demand planning, supplier performance, and warehouse utilization.",
        impactMetric: "55% → 78% forecast accuracy · $180K dead stock recovered",
        impactOutcome: "Improved fill rate from 88% to 96%, recovered $180K in dead stock, and identified supplier root cause behind 60% of stockouts.",
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
      },
      {
        id: "12",
        title: "Fabric Real-Time Intelligence — E-Commerce Event Analytics",
        category: "Data Engineering",
        industry: "E-Commerce",
        status: "published",
        timeline: "7 weeks",
        problem: "An e-commerce platform generated 500K+ clickstream events per hour — page views, add-to-cart actions, purchases, and search queries — but all analytics were batch-processed with a 6-hour delay. Marketing couldn't react to trending products in real time, abandoned cart recovery emails were sent hours too late, and flash sale performance was only visible the next morning. The business needed sub-minute visibility into customer behavior.",
        architecture: "Built on Microsoft Fabric Real-Time Intelligence workload. Eventstream ingests clickstream events from Azure Event Hubs (sourced from the website's Kafka producers). Events flow into a KQL Database (Eventhouse) for real-time querying and a Lakehouse for long-term historical storage. Real-Time Dashboard provides live operational views, while Power BI Direct Lake reports serve strategic analysis. Reflex triggers fire automated actions when specific conditions are met (e.g., sudden drop in conversion rate).",
        pipeline: "Eventstream configured with two destinations: KQL Database (hot path — 30-day retention, sub-second query latency) and Lakehouse Delta tables (warm path — full history). Eventstream transformations apply sessionization logic (grouping events by user session with 30-min timeout), enrich events with product catalog data via lookup, and filter bot traffic using a user-agent classification model. KQL Database uses update policies to maintain pre-aggregated materialized views for common dashboard queries.",
        modeling: "KQL Database schema: raw_events (timestamp, session_id, user_id, event_type, product_id, page_url, device, geo), sessions_agg (materialized — session duration, page count, conversion flag, cart value), product_performance (materialized — views, adds, purchases, conversion funnel by product and hour). Lakehouse star schema mirrors the KQL structure for Power BI: fact_events, fact_sessions, dim_product, dim_user_segment, dim_geography, dim_time.",
        dashboards: "Real-Time Dashboard (auto-refresh 30s): Live Visitor Count, Active Sessions Map, Trending Products (last 15 min), Conversion Funnel (real-time), Cart Abandonment Rate. Power BI Direct Lake reports: Daily/Weekly Sales Trend, Product Performance Matrix, Customer Journey Analysis, Marketing Campaign Attribution, Cohort Retention Analysis. Reflex alerts: conversion rate drop > 20% triggers Slack notification to product team.",
        insights: "Reduced abandoned cart email latency from 6 hours to 3 minutes — recovery rate improved by 35%. Real-time trending product detection enabled marketing to push dynamic homepage banners, increasing click-through by 22%. Identified that mobile users on a specific browser version had 3x higher cart abandonment — traced to a checkout rendering bug that was fixed within hours of discovery. Platform processes 500K+ events/hour with 800ms average query latency on KQL.",
        tools: ["Microsoft Fabric", "Eventstream", "KQL Database", "Eventhouse", "Real-Time Dashboard", "Lakehouse", "Power BI", "Reflex", "Azure Event Hubs"],
        description: "Real-time clickstream analytics on Fabric with Eventstream, KQL Database, and sub-minute operational dashboards.",
        impactMetric: "500K events/hr · 3-min cart recovery · 35% recovery rate increase",
        impactOutcome: "Sub-minute analytics replaced 6-hour batch delay. Abandoned cart recovery improved 35%, trending product detection drove 22% higher CTR.",
        createdAt: "2024-12-01T00:00:00.000Z"
      },
      {
        id: "13",
        title: "Fabric Data Warehouse — Financial Consolidation Platform",
        category: "Data Engineering",
        industry: "Finance",
        status: "published",
        timeline: "10 weeks",
        problem: "A multinational corporation with 12 subsidiaries across 4 currencies needed to consolidate financial statements monthly. Each subsidiary ran its own ERP (mix of SAP, Oracle, and QuickBooks), producing chart-of-accounts structures that didn't align. The existing consolidation process was a 40+ hour manual effort in Excel involving inter-company elimination entries, currency translation adjustments, and multi-level roll-ups — with no audit trail.",
        architecture: "Built on Microsoft Fabric Synapse Data Warehouse with T-SQL as the transformation engine. Data ingested from subsidiary ERPs via Fabric Data Pipelines into a raw staging schema. Transformation layers (staging → conformed → presentation) implemented entirely in T-SQL stored procedures for familiarity with the finance team. Cross-database queries connect the Warehouse to a Lakehouse storing historical exchange rates and reference data. Power BI connects via Direct Lake for reporting.",
        pipeline: "Fabric Data Pipelines orchestrate monthly close process: Extract phase pulls trial balance, GL detail, and inter-company transaction data from each subsidiary ERP. Conformation phase maps local chart-of-accounts to the group-level standard using a mapping table maintained by finance. Elimination phase automatically identifies and nets inter-company transactions using entity-pair matching. Currency translation applies closing rate for balance sheet items and average rate for P&L items. All transformations logged to an audit table with before/after values.",
        modeling: "Warehouse schema: fact_trial_balance (entity, account, period, local_amount, group_amount, fx_rate_used), fact_gl_detail (transaction-level for drill-down), fact_eliminations (auto-generated IC elimination entries), dim_entity (subsidiary hierarchy with ownership %), dim_account (group CoA with IFRS mapping), dim_period (fiscal calendar with close status flags). Stored procedures implement the full consolidation workflow as an idempotent, re-runnable process.",
        dashboards: "6-page Power BI consolidation report: Group P&L Statement (with entity contribution breakdown), Group Balance Sheet (with currency impact waterfall), Inter-Company Reconciliation Matrix (highlighting unmatched transactions), Currency Impact Analysis (showing translation vs transaction effects), Subsidiary Performance Comparison, and Audit Trail Explorer (every adjustment traceable to source). Finance team can re-run consolidation scenarios with different FX rate assumptions.",
        insights: "Reduced monthly consolidation from 40+ hours to 6 hours — a 85% reduction. Eliminated 12 manual Excel workbooks that were the previous consolidation tool. Auto-elimination caught $230K in previously unreconciled inter-company balances. Currency impact analysis revealed that one subsidiary's hedging strategy was costing $45K/quarter more than alternatives — led to treasury policy review. Full audit trail satisfies external auditor requirements, reducing audit preparation time by 3 weeks.",
        tools: ["Microsoft Fabric", "Synapse Data Warehouse", "T-SQL", "Fabric Data Pipelines", "Cross-Database Queries", "Power BI", "Direct Lake"],
        description: "Multi-subsidiary financial consolidation platform on Fabric Warehouse with automated IC eliminations and currency translation.",
        impactMetric: "40 hrs → 6 hrs monthly close · 12 subsidiaries · 4 currencies",
        impactOutcome: "85% reduction in consolidation effort. Auto-elimination caught $230K in unreconciled IC balances. Full audit trail for external auditors.",
        createdAt: "2025-01-01T00:00:00.000Z"
      },
      {
        id: "14",
        title: "Fabric Dataflow Gen2 — Customer 360 Data Integration",
        category: "Data Engineering",
        industry: "Retail",
        status: "published",
        timeline: "8 weeks",
        problem: "A retail chain had customer data fragmented across 7 systems: POS transactions, e-commerce platform, loyalty program, email marketing (Mailchimp), customer service (Zendesk), mobile app analytics, and social media. There was no unified customer view — marketing couldn't tell if a high-value in-store customer was also active online, loyalty points weren't synchronized across channels, and customer service agents had no context about a caller's purchase history.",
        architecture: "Built a Customer 360 integration platform on Microsoft Fabric using Dataflow Gen2 as the primary ETL engine. Each source system has a dedicated Dataflow Gen2 that extracts, cleanses, and loads data into a Fabric Lakehouse staging layer. A master Dataflow Gen2 pipeline performs identity resolution — matching customer records across systems using a combination of email, phone, loyalty ID, and fuzzy name matching. Resolved customer profiles are written to a Gold-layer unified customer table. Power BI Direct Lake semantic model serves the Customer 360 dashboard.",
        pipeline: "7 source-specific Dataflow Gen2 flows run daily with incremental refresh (change-date based). Each flow handles source-specific quirks: POS data requires transaction-level deduplication, e-commerce data needs session stitching, Mailchimp data requires API pagination handling. The identity resolution Dataflow uses Power Query's merge and fuzzy matching capabilities with a 85% similarity threshold. Matched records are assigned a master_customer_id. Unmatched records go to a review queue surfaced in Power BI for manual resolution. Dataflow Gen2 staging destinations write to Lakehouse Delta tables with schema evolution enabled.",
        modeling: "Lakehouse Gold layer: dim_customer_master (unified profile with golden record attributes, channel flags, first/last interaction dates, lifetime value), fact_transactions (all purchases across POS and e-commerce with unified customer key), fact_interactions (email opens, support tickets, app sessions, social mentions), fact_loyalty (points earned, redeemed, balance, tier). Semantic model adds 50+ calculated measures: CLV, recency-frequency-monetary scores, channel preference index, churn risk score.",
        dashboards: "Customer 360 Dashboard: Single Customer View (search by name/email/phone, see complete cross-channel history), Segment Explorer (RFM matrix, behavioral cohorts), Channel Migration Analysis (in-store vs online shift trends), Loyalty Program Health (active rate, redemption patterns, tier distribution), Churn Risk Heatmap (high-value customers with declining engagement), and Campaign ROI Tracker (attributing revenue to marketing touchpoints across channels).",
        insights: "Unified 850K customer records across 7 systems — identified that 23% of customers were active in 3+ channels but were being treated as separate individuals. High-value omnichannel customers spend 2.7x more than single-channel customers — this insight shifted marketing budget allocation. Churn risk model identified 1,200 high-value customers with declining engagement, enabling a targeted retention campaign that recovered $340K in projected lost revenue. Loyalty point synchronization across channels increased redemption rate by 18%.",
        tools: ["Microsoft Fabric", "Dataflow Gen2", "Power Query", "Lakehouse", "Delta Lake", "Power BI", "Direct Lake", "Fuzzy Matching"],
        description: "Customer 360 integration platform unifying 7 source systems using Fabric Dataflow Gen2 with identity resolution.",
        impactMetric: "850K customers unified · 7 systems · $340K retained revenue",
        impactOutcome: "Discovered 23% of customers were cross-channel but tracked separately. Retention campaign recovered $340K. Loyalty redemption up 18%.",
        createdAt: "2025-02-01T00:00:00.000Z"
      },
      {
        id: "15",
        title: "Fabric Unified Analytics — Sales Intelligence Suite",
        category: "BI",
        industry: "SaaS",
        status: "published",
        timeline: "9 weeks",
        problem: "A B2B SaaS company had sales data scattered across Salesforce (CRM), Stripe (billing), Intercom (product usage), and Snowflake (product telemetry). Sales leaders couldn't answer basic questions like 'Which accounts have high product usage but haven't expanded their contract?' or 'What's our net revenue retention by cohort?' without requesting ad-hoc analyses that took days. Existing Salesforce reports showed pipeline data but had zero visibility into actual product adoption or billing reality.",
        architecture: "Fabric workspace with Lakehouse as the central data store. Fabric Data Pipelines ingest from Salesforce (REST API), Stripe (webhook events stored in Event Hubs → Eventstream), Intercom (API), and Snowflake (cross-cloud shortcut via OneLake). All data lands in Bronze Lakehouse tables. Fabric Notebooks (PySpark) handle complex transformations — especially the account health scoring model that combines usage telemetry with billing patterns. Gold-layer tables feed a Direct Lake semantic model with composite model connections to live Salesforce data for pipeline currency.",
        modeling: "Semantic model combines Direct Lake (historical metrics from Lakehouse) with DirectQuery (live Salesforce pipeline data) via composite model architecture. Key tables: fact_monthly_recurring_revenue (MRR movements — new, expansion, contraction, churn by account and month), fact_product_usage (daily active users, feature adoption scores, API call volumes per account), fact_sales_pipeline (live from Salesforce — stages, amounts, close dates, rep attribution), dim_account (firmographic data, contract details, health score, segment). 80+ DAX measures including cohort-based NRR, logo retention, expansion propensity score, and pipeline-weighted forecast.",
        dashboards: "8-page Sales Intelligence Suite: Executive Summary (ARR waterfall, NRR trend, logo churn), Pipeline Analytics (stage conversion, velocity, win rate by segment), Account Health Matrix (2x2 grid of usage vs contract value — highlights expansion and churn risk), Revenue Cohort Analysis (vintage curves showing NRR by signup cohort), Product Adoption Scorecard (feature usage heatmap by account tier), Rep Performance Dashboard (quota attainment, pipeline generation, win rates), Expansion Opportunity Finder (accounts with high usage score but low contract value), and a Mobile Executive View with KPI cards and trend alerts.",
        insights: "Identified 47 accounts with product usage in the top quartile but contract value in the bottom half — sales team targeted these for expansion, closing $620K in upsells within one quarter. Cohort analysis revealed that customers onboarded through a specific partner channel had 40% higher 12-month NRR than direct sales — led to doubling partner program investment. Account health scoring predicted 8 of 10 churns in the following quarter, enabling proactive retention outreach that saved 5 accounts worth $180K ARR. Sales cycle velocity analysis showed that deals involving a technical POC closed 2x faster, leading to a new sales process requiring POC for deals above $50K.",
        tools: ["Microsoft Fabric", "Lakehouse", "PySpark Notebooks", "Direct Lake", "Composite Model", "Power BI", "Salesforce", "Stripe", "DAX"],
        description: "Full-stack sales intelligence platform on Fabric combining CRM, billing, and product usage data with Direct Lake + composite models.",
        impactMetric: "80+ measures · $620K upsells · 5 churns prevented ($180K ARR)",
        impactOutcome: "Expansion targeting closed $620K in one quarter. Health scoring predicted 80% of churns. Partner channel insight doubled partner investment.",
        createdAt: "2025-03-01T00:00:00.000Z"
      },
      {
        id: "16",
        title: "Fabric CI/CD & Deployment Pipelines — Enterprise ALM",
        category: "Data Engineering",
        industry: "Enterprise",
        status: "published",
        timeline: "5 weeks",
        problem: "A data team of 8 engineers was deploying Fabric artifacts (Lakehouses, Notebooks, Pipelines, Semantic Models) manually — copying items between workspaces by hand, with no version control, no code review process, and no rollback capability. A bad notebook deployment once corrupted a production Lakehouse table, requiring 4 hours of manual recovery. There was no separation between development, testing, and production environments, so untested changes went live immediately.",
        architecture: "Implemented a full Application Lifecycle Management (ALM) framework on Microsoft Fabric. Three Fabric workspaces: DEV (developer sandbox), UAT (testing/validation), and PROD (production). Fabric Git Integration connects DEV workspace to an Azure DevOps Git repository — all artifacts are version-controlled as code. Fabric Deployment Pipelines automate promotion from DEV → UAT → PROD with parameterization rules that swap connection strings, Lakehouse references, and capacity assignments per stage. Branch policies enforce pull request reviews before merging to main.",
        pipeline: "Developer workflow: create feature branch in Azure DevOps → sync to personal Fabric DEV workspace → develop and test → create PR with screenshots and test results → peer review → merge to main → auto-sync to shared DEV workspace → trigger Deployment Pipeline to promote to UAT. UAT validation runs automated data quality checks via a dedicated Fabric Notebook that compares row counts, schema integrity, and sample data assertions. After UAT sign-off, Deployment Pipeline promotes to PROD with a one-click approval gate. Rollback is a Git revert + re-deploy — average recovery time: 8 minutes vs the previous 4 hours.",
        modeling: "Deployment Pipeline parameterization rules: Lakehouse connections swap per environment (dev_lakehouse → uat_lakehouse → prod_lakehouse), semantic model data sources update automatically, notebook environment variables switch via Fabric Spark configurations. Pipeline rules maintained as JSON config — version-controlled alongside artifacts. Branching strategy: main (production-ready), develop (integration), feature/* (individual work). Semantic model deployment includes automated refresh trigger post-deployment to validate data connectivity.",
        dashboards: "DevOps monitoring dashboard in Power BI: Deployment History (timeline of all promotions with status, duration, deployer), Deployment Frequency (trends by week — tracking improvement in release cadence), Change Failure Rate (percentage of deployments requiring rollback), Mean Time to Recovery (average rollback duration), Git Activity Summary (commits, PRs, review turnaround time by team member), and Environment Drift Detector (flagging artifacts that differ between UAT and PROD without a deployment record).",
        insights: "Deployment frequency increased from 2 releases/month (manual) to 12 releases/month (automated pipeline). Zero production incidents from bad deployments in the 3 months post-implementation vs 4 incidents in the 3 months prior. Mean time to recovery dropped from 4 hours to 8 minutes via Git revert. Code review adoption went from 0% to 100% — PR reviews caught 23 issues that would have reached production. Developer onboarding time reduced from 2 weeks to 3 days because new team members can explore the full Git history to understand how artifacts evolved.",
        tools: ["Microsoft Fabric", "Azure DevOps", "Git Integration", "Deployment Pipelines", "Fabric Notebooks", "Power BI", "CI/CD", "ALM"],
        description: "Enterprise ALM framework for Fabric with Git integration, three-stage deployment pipelines, and automated rollback.",
        impactMetric: "2 → 12 releases/month · 0 incidents · 8-min rollback",
        impactOutcome: "6x deployment frequency, zero production incidents post-implementation, and 100% code review adoption across 8-person team.",
        createdAt: "2025-04-01T00:00:00.000Z"
      },
      {
        id: "17",
        title: "Treasury Cash Flow Forecasting & Liquidity Dashboard",
        category: "BI",
        industry: "Finance",
        status: "published",
        timeline: "7 weeks",
        problem: "A corporate treasury team managing $200M+ in cash across 15 bank accounts and 3 currencies had no consolidated view of liquidity. Daily cash position was assembled manually from bank portal downloads every morning — a 90-minute process that was outdated by noon. Cash flow forecasting relied on department heads emailing expected inflows and outflows in Excel, with no historical accuracy tracking. The CFO couldn't answer 'How much cash will we have in 30 days?' with any confidence.",
        architecture: "Connected Power BI to banking APIs (Plaid for account balances, MT940 SWIFT files for transaction feeds), ERP GL module (Oracle Financials via ODBC), and AR/AP subledgers. Azure Data Factory orchestrates daily pulls into Azure SQL Database. Power Query handles bank statement parsing (MT940 → structured transactions), currency normalization using ECB daily reference rates, and cash flow category tagging using keyword-based classification rules maintained in a config table.",
        modeling: "Star schema: fact_cash_position (daily balance snapshots by account × currency — actual and forecasted), fact_cash_transactions (inflows/outflows with category, entity, counterparty), fact_forecast_vs_actual (paired records for accuracy tracking). Dimensions: dim_bank_account (bank, currency, entity, account type), dim_cash_category (operating, investing, financing — with sub-categories for AR collections, payroll, capex, debt service), dim_entity (legal entities with intercompany flags). 50+ DAX measures: rolling 30/60/90 day forecast, forecast accuracy (MAPE by category), net cash burn rate, days of operating cash remaining, FX exposure by currency, and covenant compliance ratios.",
        dashboards: "6-page report: Daily Cash Position Summary (waterfall showing opening balance → inflows → outflows → closing, by currency and consolidated), Cash Flow Forecast (30/60/90 day forward view with confidence bands based on historical accuracy), Forecast Accuracy Tracker (MAPE by category over time — surfaces which departments forecast poorly), Bank Account Overview (balances across all accounts with idle cash flags), FX Exposure Dashboard (net position by currency, hedge coverage ratio), and Covenant Compliance Monitor (debt/equity, interest coverage, minimum liquidity — with RAG status and trend).",
        insights: "Eliminated 90-minute daily manual cash assembly — treasury starts the day with a live consolidated view. 30-day forecast accuracy improved from 62% to 84% within 2 months as departments saw their accuracy scores and improved inputs. Identified $3.5M in idle cash sitting across low-yield accounts — treasury reallocated to money market instruments, generating $140K additional annual interest income. FX exposure dashboard caught an unhedged $2M EUR position before a 4% currency move — avoided $80K potential loss. Covenant compliance monitor gave the CFO real-time confidence during board meetings.",
        tools: ["Power BI", "DAX", "Azure Data Factory", "Azure SQL", "Power Query", "Oracle Financials", "Star Schema", "RLS"],
        description: "Corporate treasury dashboard consolidating 15 bank accounts across 3 currencies with automated cash flow forecasting.",
        impactMetric: "62% → 84% forecast accuracy · $140K interest income recovered",
        impactOutcome: "Eliminated 90-min daily manual process. Identified $3.5M idle cash and avoided $80K FX exposure loss.",
        createdAt: "2025-05-01T00:00:00.000Z"
      },
      {
        id: "18",
        title: "Financial Planning & Variance Analysis Platform",
        category: "BI",
        industry: "Finance",
        status: "published",
        timeline: "8 weeks",
        problem: "An FP&A team at a 500-employee company managed annual budgets and monthly forecasts entirely in a 40-tab Excel workbook nicknamed 'The Monster.' Version control was nonexistent — multiple copies circulated with conflicting numbers. Budget vs actual variance analysis took 5 days after month-end close because finance had to manually pull actuals from the ERP, paste into the budget workbook, and calculate variances across 12 cost centers and 200+ GL accounts. Leadership decisions were made on month-old data.",
        architecture: "Built a centralized FP&A data model in Power BI connecting to the ERP system (Microsoft Dynamics 365 via Dataverse connector) for actuals and a structured Excel template (hosted on SharePoint) for budget and forecast inputs. Budget data flows through Power Query with validation rules — rejecting submissions with missing cost centers, negative headcount, or totals that don't reconcile. Azure Data Factory refreshes actuals daily; budget/forecast inputs processed on submission via Power Automate trigger.",
        modeling: "Unified financial model: fact_financials (amount, version_flag [Actual/Budget/Forecast/Reforecast], period, cost_center, gl_account), enabling any measure to compare across versions without separate tables. Dimensions: dim_gl_account (account hierarchy — group, category, sub-category, natural account with OPEX/CAPEX classification), dim_cost_center (department hierarchy with cost center manager), dim_scenario (Budget, Forecast Q1-Q4, Actuals, with lock/unlock status). 60+ DAX measures: variance ($ and %), variance waterfall decomposition (volume, price, mix effects), run-rate projection, full-year estimate (actuals YTD + forecast remaining), headcount-normalized cost ratios, and flexible YoY/QoQ comparisons using calculation groups.",
        dashboards: "7-page report: P&L Summary (actual vs budget vs forecast with variance highlights and traffic-light thresholds), Variance Decomposition (waterfall breaking total variance into volume, rate, and mix components), Cost Center Scorecards (each manager sees their own budget performance via RLS), Headcount & Compensation Tracker (FTE count, average cost per head, open position impact), Revenue Bridge (prior year → volume → price → mix → current year), OPEX Deep-Dive (department-level spend trends with budget guardrails), and Scenario Comparison (side-by-side Budget vs Forecast vs Reforecast with commentary annotations). Write-back capability via Power Apps embedded visual for forecast adjustments.",
        insights: "Month-end variance analysis reduced from 5 days to same-day delivery. Finance eliminated 'The Monster' workbook and its 40 tabs — single source of truth adopted by all 12 cost center managers within first month. Variance decomposition revealed that a $400K revenue shortfall was entirely a mix effect (not volume) — product team shifted promotional strategy instead of discounting. Headcount tracker caught 8 unapproved hires across departments that were $320K over budget — flagged before offers were extended. Full-year estimate calculation gave leadership a live projection 3 weeks before previous manual process could deliver one.",
        tools: ["Power BI", "DAX", "Calculation Groups", "Power Query", "Dynamics 365", "Dataverse", "Power Apps", "RLS"],
        description: "FP&A platform replacing a 40-tab Excel workbook with automated budget vs actual variance analysis across 12 cost centers.",
        impactMetric: "5 days → same-day variance · $320K unapproved spend caught",
        impactOutcome: "Eliminated manual budget workbook, delivered same-day variance analysis, and caught $320K in unapproved hires before offers went out.",
        createdAt: "2025-06-01T00:00:00.000Z"
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
