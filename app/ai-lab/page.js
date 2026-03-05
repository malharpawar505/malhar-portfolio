'use client';
import { Reveal } from '@/components/Reveal';
import { Brain, Zap, Terminal, Database, Bot, Cpu, Workflow, Sparkles } from 'lucide-react';

const EXPERIMENTS = [
  { title: 'AI-Powered BI Copilot', desc: 'Built an intelligent chatbot integrating LLMs with Power BI semantic models via MCP (Model Context Protocol) servers. Users query business data using natural language and receive instant visualizations.', icon: Brain, status: 'Active' },
  { title: 'Autonomous Analytics Agent', desc: 'Developed an agentic AI system that monitors data quality, detects anomalies, and automatically generates executive summaries. The agent runs scheduled analysis and pushes findings to stakeholders.', icon: Zap, status: 'Active' },
  { title: 'LLM-Powered Data Query Engine', desc: 'Created a natural language to SQL translator powered by Claude that understands business context and semantic model metadata, generating optimized DAX and SQL queries from plain English.', icon: Terminal, status: 'Prototype' },
  { title: 'AI Data Quality Monitor', desc: 'AI-driven data reconciliation and validation that learns expected patterns and flags anomalies in data pipelines, reducing manual QA effort significantly.', icon: Database, status: 'Experiment' },
  { title: 'Conversational Dashboard Builder', desc: 'Exploring AI that can generate Power BI report layouts and DAX measures from natural language descriptions of business requirements.', icon: Bot, status: 'Research' },
  { title: 'Self-Healing Data Pipelines', desc: 'Investigating AI agents that detect pipeline failures, diagnose root causes, and implement fixes autonomously with human-in-the-loop approval.', icon: Workflow, status: 'Research' },
];

export default function AILabPage() {
  return (
    <div className="page-enter pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs text-accent-gold font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent-gold" /> AI Laboratory
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Experiments at the Frontier of AI + Data</h1>
          <p className="text-text-secondary max-w-2xl mb-16 leading-relaxed">
            Exploring agentic AI, LLM integrations, and intelligent automation in the data analytics space.
            Each experiment pushes the boundary of what's possible when AI meets enterprise data.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {EXPERIMENTS.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <Reveal key={i} type="scale" delay={Math.min(i + 1, 6)}>
                <div className="card-hover p-7 bg-bg-card border border-border rounded-2xl relative overflow-hidden group h-full">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-gold/4 rounded-full blur-3xl group-hover:bg-accent-gold/8 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-accent-gold-dim flex items-center justify-center text-accent-gold transition-transform duration-300 group-hover:scale-110">
                        <Icon size={22} />
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full ${
                        exp.status === 'Active' ? 'tag-green' : exp.status === 'Prototype' ? 'tag-blue' : 'tag-gold'
                      }`}>{exp.status}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-accent-gold transition-colors">{exp.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Thesis */}
        <Reveal>
          <div className="relative overflow-hidden p-10 sm:p-14 bg-bg-card border border-border rounded-3xl text-center glow-gold">
            <div className="absolute inset-0 bg-grid opacity-30" style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)' }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-accent-gold" />
                <span className="font-mono text-xs text-accent-gold font-semibold tracking-widest uppercase">My AI Thesis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-5 max-w-2xl mx-auto leading-snug">
                The future of analytics is conversational, agentic, and self-healing.
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
                I'm building toward a world where business users interact with data through natural language,
                AI agents autonomously monitor data quality, and analytics platforms self-optimize based on usage patterns.
                Every experiment here is a step in that direction.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
