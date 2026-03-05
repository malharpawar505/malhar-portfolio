'use client';
import { motion } from 'framer-motion';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/UI';

const experiments = [
  {
    title: 'AI-Powered BI Copilot',
    desc: 'Built an intelligent chatbot that integrates LLMs with Power BI semantic models via MCP (Model Context Protocol) servers. Users can query business data using natural language and receive instant visualizations and insights.',
    detail: 'The system translates natural language into DAX queries, executes them against the semantic model, and returns formatted results with auto-generated chart recommendations. Supports multi-turn conversations with context retention.',
    tech: ['Claude API', 'MCP Server', 'Power BI', 'Python', 'Next.js'],
    status: 'Active',
  },
  {
    title: 'Autonomous Analytics Agent',
    desc: 'Developed an agentic AI system that monitors data quality, detects anomalies, and automatically generates executive summaries. The agent runs scheduled analysis and pushes findings to stakeholders.',
    detail: 'Uses a planning-execution loop where the agent decides which analyses to run based on recent data changes, executes them autonomously, and formats results into actionable insights with severity scoring.',
    tech: ['LangChain', 'Python', 'SQL', 'Power BI', 'Email API'],
    status: 'Prototype',
  },
  {
    title: 'LLM-Powered Data Query Engine',
    desc: 'Created a natural language to SQL/DAX translator powered by Claude that understands business context and semantic model metadata, generating optimized queries from plain English questions.',
    detail: 'The engine parses the semantic model metadata to understand table relationships, measure definitions, and business rules, then generates contextually-aware queries with proper joins and aggregations.',
    tech: ['Claude API', 'DAX', 'SQL', 'Python', 'Semantic Model'],
    status: 'Active',
  },
  {
    title: 'AI Data Quality Monitor',
    desc: 'Experimented with AI-driven data reconciliation and validation systems that learn expected patterns and flag anomalies in data pipelines, reducing manual QA effort significantly.',
    detail: 'Statistical anomaly detection combined with LLM-based pattern analysis to identify data quality issues that rule-based systems miss. Generates human-readable explanations for each detected anomaly.',
    tech: ['Python', 'scikit-learn', 'Claude API', 'Azure'],
    status: 'Research',
  },
  {
    title: 'Power BI Custom Visual + AI Chat',
    desc: 'Developed a Power BI custom visual (pbiviz) that embeds an AI chat interface directly into reports, allowing users to ask questions about the data shown on the current page.',
    detail: 'The visual reads the current filter context and selected data points, sends them as context to the LLM, and renders conversational responses inline within the Power BI report experience.',
    tech: ['TypeScript', 'Power BI SDK', 'pbiviz', 'Claude API'],
    status: 'Prototype',
  },
  {
    title: 'Automated Report Narrative Generator',
    desc: 'Built an AI system that takes Power BI dataset snapshots and generates executive-quality written narratives summarizing key findings, trends, and recommended actions.',
    detail: 'Extracts key metrics, compares against targets and historical periods, identifies statistically significant changes, and produces structured narratives in a consistent corporate voice.',
    tech: ['Python', 'Claude API', 'DAX', 'Power BI REST API'],
    status: 'Research',
  },
];

const statusColors = {
  Active: 'tag-green',
  Prototype: 'tag-gold',
  Research: 'tag-blue',
};

export default function AILabClient() {
  return (
    <main className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="AI Laboratory"
          labelColor="var(--accent-gold)"
          title="Experiments at the Frontier of AI + Data"
          desc="Exploring agentic AI, LLM integrations, and intelligent automation in the data analytics space."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {experiments.map((exp, i) => (
            <StaggerItem key={i}>
              <div className="relative p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] card-hover overflow-hidden group h-full">
                <div className="absolute -top-24 -right-24 w-56 h-56 bg-[radial-gradient(circle,rgba(201,168,76,0.05),transparent_70%)] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`tag ${statusColors[exp.status]}`}>{exp.status}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-gold)] transition-colors duration-300">{exp.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">{exp.desc}</p>
                  <p className="text-[12px] text-[var(--text-muted)] leading-relaxed mb-4 italic">{exp.detail}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {exp.tech.map((t, j) => <span key={j} className="tool-chip">{t}</span>)}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* AI Thesis */}
        <FadeIn>
          <div className="p-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] text-center relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04), transparent)' }} />
            <div className="relative z-10">
              <div className="mono text-sm text-[var(--accent-gold)] font-semibold mb-3 tracking-wider">MY AI THESIS</div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                The future of analytics is conversational,<br className="hidden md:block" /> agentic, and self-healing.
              </h3>
              <p className="text-[15px] text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                I'm building toward a world where business users interact with data through natural language, AI agents autonomously monitor data quality, and analytics platforms self-optimize based on usage patterns. Every experiment above is a step in that direction.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
