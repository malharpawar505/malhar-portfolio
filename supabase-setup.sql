-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Malhar Pawar Portfolio — Supabase Database Setup           ║
-- ║  Run this in Supabase SQL Editor (supabase.com/dashboard)   ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── 1. PROJECTS TABLE ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  industry      TEXT DEFAULT '',
  category      TEXT DEFAULT 'BI',
  status        TEXT DEFAULT 'draft',
  problem       TEXT DEFAULT '',
  architecture  TEXT DEFAULT '',
  tools         JSONB DEFAULT '[]'::jsonb,
  modeling      TEXT DEFAULT '',
  pipeline      TEXT DEFAULT '',
  dashboards    TEXT DEFAULT '',
  insights      TEXT DEFAULT '',
  timeline      TEXT DEFAULT '',
  tags          JSONB DEFAULT '[]'::jsonb,
  github        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

-- ── 2. BLOGS TABLE ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blogs (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT DEFAULT '',
  date          TEXT DEFAULT '',
  excerpt       TEXT DEFAULT '',
  content       TEXT DEFAULT '',
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

-- ── 3. ACTIVITIES TABLE ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activities (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  date          TEXT DEFAULT '',
  tags          JSONB DEFAULT '[]'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

-- ── 4. MESSAGES TABLE ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  message       TEXT NOT NULL,
  read          BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

-- ── 5. ENABLE ROW LEVEL SECURITY ──────────────────────────────
-- (Public read, service-role write)

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can READ published projects and blogs
CREATE POLICY "Public can read published projects" ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read activities" ON activities
  FOR SELECT USING (true);

-- Service role can do everything (used by your admin API)
CREATE POLICY "Service role full access projects" ON projects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access blogs" ON blogs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access activities" ON activities
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access messages" ON messages
  FOR ALL USING (auth.role() = 'service_role');

-- Anyone can INSERT messages (contact form)
CREATE POLICY "Public can submit messages" ON messages
  FOR INSERT WITH CHECK (true);


-- ── 6. SEED DATA ──────────────────────────────────────────────

INSERT INTO projects (title, industry, category, status, problem, architecture, tools, modeling, pipeline, dashboards, insights, timeline, tags) VALUES
(
  'QSR Sales Performance Analytics Platform',
  'Quick Service Restaurant', 'BI', 'published',
  'A major QSR chain lacked real-time visibility into multi-location sales performance, making it difficult for regional managers to identify underperforming outlets and respond to trends quickly.',
  'Built an end-to-end analytics platform using Microsoft Fabric with Medallion Architecture (Bronze to Silver to Gold layers). Raw POS data landed in a lakehouse, was cleaned and transformed through notebooks, and served through a semantic model to Power BI dashboards.',
  '["Power BI", "Microsoft Fabric", "DAX", "SQL", "Azure Data Factory"]'::jsonb,
  'Implemented a star schema with fact tables for daily sales transactions and dimension tables for stores, products, time periods, and promotional campaigns. Used DAX measures for YoY comparisons, rolling averages, and contribution analysis.',
  'Automated daily data extraction from POS systems via Azure Data Factory, landing raw data in Fabric Lakehouse. Spark notebooks performed cleansing, deduplication, and business rule application across Bronze to Gold layers.',
  'Executive summary dashboard with filterable KPIs, store-level drill-through pages, product mix analysis, and trend visualization with anomaly detection highlights.',
  'Identified 15% revenue variance across comparable stores, enabling targeted operational improvements. Promotional ROI analysis revealed underperforming campaigns, saving significant marketing spend.',
  '2024', '["Power BI", "Fabric", "DAX"]'::jsonb
),
(
  'Financial Profitability Reporting System',
  'Finance & Operations', 'BI', 'published',
  'Finance teams relied on manual Excel processes for monthly P&L reporting across multiple business units, resulting in delayed reports, inconsistent calculations, and audit trail gaps.',
  'Designed a centralized data warehouse on Azure Synapse with automated ETL pipelines pulling from ERP, CRM, and financial systems.',
  '["Power BI", "Azure Synapse", "SQL", "Python", "DAX"]'::jsonb,
  'Financial data model with fact tables for GL entries, budgets, and forecasts. Complex DAX calculations for margin analysis, cost allocation, and multi-currency conversions.',
  'Azure Data Factory orchestrated nightly loads from ERP systems. Python scripts handled complex financial transformations and intercompany elimination logic.',
  'Multi-page financial cockpit with P&L waterfall charts, balance sheet summaries, cash flow tracking, and variance analysis with Row-Level Security.',
  'Reduced monthly reporting cycle from 10 days to 2 days. Automated reconciliation detected recurring data quality issues.',
  '2024', '["Azure Synapse", "Power BI", "ETL"]'::jsonb
),
(
  'Multi-Level Hierarchy Reporting Engine',
  'Enterprise Operations', 'Data Engineering', 'published',
  'An enterprise organization with complex parent-child hierarchies needed dynamic reporting that could aggregate and drill through any level of the org structure.',
  'Built a recursive hierarchy resolution engine in SQL, flattened through Fabric notebooks, and exposed as a Power BI semantic model with dynamic security.',
  '["SQL", "Microsoft Fabric", "Power BI", "DAX", "Python"]'::jsonb,
  'Parent-child hierarchy tables with bridge tables for many-to-many relationships. PATH() and PATHITEM() DAX functions for navigation.',
  'Spark notebooks processed hierarchy changes, maintaining history through SCD Type 2 patterns.',
  'Interactive org-level explorer with expandable tree navigation, contextual KPIs that changed based on hierarchy level.',
  'Enabled self-service analytics for 200+ managers, reducing ad-hoc report requests by 70%.',
  '2024', '["Fabric", "SQL", "DAX"]'::jsonb
),
(
  'Executive BI Dashboard Suite',
  'Cross-Industry', 'BI', 'published',
  'C-suite executives needed a single pane of glass view across operations, finance, sales, and HR metrics.',
  'Consolidated semantic model spanning multiple data domains, served through Power BI Premium with paginated reports.',
  '["Power BI", "DAX", "SQL", "Azure", "AI/ML"]'::jsonb,
  'Composite model connecting Import and DirectQuery sources. Calculation groups for dynamic time intelligence.',
  'Hybrid refresh strategy: finance data on schedule, operational metrics near real-time via DirectQuery.',
  'Minimalist executive dashboard with traffic-light KPIs, sparkline trends, and mobile-optimized layout.',
  'Increased executive engagement with data from quarterly to daily. Anomaly detection flagged issues 3 days earlier.',
  '2023-2024', '["Power BI", "DAX", "Executive"]'::jsonb
),
(
  'Data Warehouse Pipeline Framework',
  'Data Platform', 'Data Engineering', 'published',
  'Multiple teams built siloed data pipelines with no standardization, leading to duplicated effort and inconsistent transformations.',
  'Designed a reusable ETL framework on Azure Data Factory with parameterized pipeline templates and automated data quality checks.',
  '["Azure Data Factory", "SQL", "Python", "Microsoft Fabric", "Azure DevOps"]'::jsonb,
  'Metadata-driven pipeline design: configurations stored in control tables, enabling new source onboarding without code changes.',
  'Parameterized ADF pipelines with dynamic mapping, error handling, retry logic, and SLA monitoring. CI/CD through Azure DevOps.',
  'Pipeline monitoring dashboard showing execution history, data quality scores, SLA compliance, and cost tracking.',
  'Reduced new data source onboarding from 2 weeks to 2 days. Standardized error handling caught 95% of issues early.',
  '2024', '["ADF", "Fabric", "DevOps"]'::jsonb
);

INSERT INTO blogs (title, category, date, excerpt, status) VALUES
('Medallion Architecture: Why It Changes Everything', 'Data Engineering', '2025-02-15', 'Deep dive into implementing Bronze, Silver, Gold layers using Microsoft Fabric.', 'published'),
('Integrating LLMs with Power BI via MCP Servers', 'AI + BI', '2025-01-28', 'How to build an AI copilot that queries your Power BI semantic model using natural language.', 'published'),
('DAX Optimization Patterns for Large Models', 'Power BI', '2025-01-10', 'Performance patterns from working with enterprise-scale Power BI models.', 'published'),
('From Data Analyst to Analytics Engineer', 'Career', '2024-12-20', 'My journey transitioning from building reports to building data platforms.', 'published');

INSERT INTO activities (title, description, date, tags) VALUES
('Explored Claude + Power BI MCP integration', 'Built a prototype connecting Claude to Power BI semantic models for natural language querying.', '2025-03-04', '["AI", "MCP", "Power BI"]'::jsonb),
('Deep dive into Microsoft Fabric capacity tiers', 'Researched licensing constraints and capacity options for enterprise Fabric deployments.', '2025-03-01', '["Fabric", "Azure"]'::jsonb),
('Data quality audit across multi-country dataset', 'Identified systemic data quality issues in operations scorecard data spanning 5 countries.', '2025-02-26', '["SQL", "Data Quality"]'::jsonb),
('Azure Specialization audit preparation', 'Created presentation materials for Microsoft Azure cloud migration specialization audit.', '2025-02-20', '["Azure", "Fabric"]'::jsonb),
('Agentic AI chatbot deployment to Vercel', 'Deployed an AI-powered analytics chatbot with both static and live data modes.', '2025-02-15', '["AI", "Vercel", "LLM"]'::jsonb);
