'use client';
import Link from 'next/link';
import { Reveal, AnimatedCounter } from '@/components/Reveal';
import {
  ChevronRight, Mail, Github, Linkedin, BarChart3, Database,
  Brain, Zap, Terminal, Award, MapPin, ArrowUpRight,
  Layers, Workflow, Factory, GitMerge, Calculator, Network
} from 'lucide-react';
import { useState, useEffect } from 'react';

const TECHNOLOGIES = [
  { name: 'Power BI', color: '#F2C811', cat: 'BI', LucideIcon: BarChart3 },
  { name: 'SQL', color: '#50c878', cat: 'Data', icon: 'https://cdn.simpleicons.org/postgresql/50c878' },
  { name: 'Python', color: '#3776ab', cat: 'Data', icon: 'https://cdn.simpleicons.org/python/3776ab' },
  { name: 'DAX', color: '#F2C811', cat: 'BI', LucideIcon: Calculator },
  { name: 'Microsoft Fabric', color: '#4a9eff', cat: 'Cloud', LucideIcon: Layers },
  { name: 'Azure Synapse', color: '#0078d4', cat: 'Cloud', LucideIcon: Network },
  { name: 'Azure Data Factory', color: '#0078d4', cat: 'Cloud', LucideIcon: Factory },
  { name: 'Snowflake', color: '#29b5e8', cat: 'Cloud', icon: 'https://cdn.simpleicons.org/snowflake/29b5e8' },
  { name: 'Azure DevOps', color: '#0078d4', cat: 'Cloud', LucideIcon: GitMerge },
  { name: 'ETL / ELT', color: '#50c878', cat: 'Data', icon: 'https://cdn.simpleicons.org/databricks/50c878' },
  { name: 'Data Modeling', color: '#c9a84c', cat: 'Data', icon: 'https://cdn.simpleicons.org/prisma/c9a84c' },
  { name: 'Data Warehouse', color: '#c9a84c', cat: 'Data', LucideIcon: Database },
  { name: 'LLM / AI', color: '#ff6b6b', cat: 'AI', LucideIcon: Brain },
  { name: 'MCP Servers', color: '#ff6b6b', cat: 'AI', icon: 'https://cdn.simpleicons.org/anthropic/ff6b6b' },
  { name: 'Medallion Architecture', color: '#50c878', cat: 'Data', icon: 'https://cdn.simpleicons.org/apachespark/50c878' },
  { name: 'Git & GitHub', color: '#8b949e', cat: 'Tools', icon: 'https://cdn.simpleicons.org/github/8b949e' },
];

const AI_EXPERIMENTS = [
  { title: 'AI-Powered BI Copilot', desc: 'LLM integration with Power BI semantic models via MCP servers for natural language data querying.', icon: Brain },
  { title: 'Autonomous Analytics Agent', desc: 'Agentic AI system that monitors data quality, detects anomalies, and auto-generates executive summaries.', icon: Zap },
  { title: 'LLM Data Query Engine', desc: 'Natural language to SQL/DAX translator powered by Claude that understands business context and metadata.', icon: Terminal },
  { title: 'AI Data Quality Monitor', desc: 'AI-driven data reconciliation and validation that learns patterns and flags pipeline anomalies.', icon: Database },
];

const CAT_COLORS = {
  BI: 'rgba(242,200,17,',
  Data: 'rgba(80,200,120,',
  Cloud: 'rgba(93,176,255,',
  AI: 'rgba(255,107,107,',
  Tools: 'rgba(139,148,158,',
};

import Magnetic from '@/components/Magnetic';
import FloatingLogos from '@/components/FloatingLogos';
import Typewriter from '@/components/Typewriter';
import TerminalEntry from '@/components/TerminalEntry';
import HeroTypewriter from '@/components/HeroTypewriter';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/blogs').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
    ]).then(([p, b, a]) => {
      setProjects(p.filter(x => x.status === 'published').slice(0, 3));
      setBlogs(b.filter(x => x.status === 'published').slice(0, 3));
      setActivities(a.slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[92vh] flex items-center pt-20 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] orb-drift pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-accent-gold/4 blur-[100px] orb-drift-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent-blue/3 blur-[140px] pointer-events-none" />

        {/* Decorative large letters */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[22vw] font-extrabold font-serif italic text-white/[0.025] select-none pointer-events-none leading-none tracking-tighter">
          MP
        </div>

        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <FloatingLogos />
          <div className="absolute inset-0 bg-grid opacity-30" style={{ maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-12">
          <Reveal delay={1}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-dim border border-accent/20 font-mono text-xs text-accent font-medium tracking-wide mb-8">
              <span className="w-2 h-2 rounded-full bg-accent badge-pulse flex-shrink-0" />
              Open to opportunities · Data Engineering & AI
            </div>
          </Reveal>

          <Reveal delay={2}>
            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.0] tracking-tighter max-w-5xl mb-8 font-serif italic">
              <HeroTypewriter
                text="Building Intelligent Data Systems That Drive Decisions"
                speed={38}
                delay={600}
              />
            </h1>
          </Reveal>

          <Reveal delay={3}>
            <p className="text-xl text-text-secondary max-w-xl leading-relaxed mb-12 font-medium">
              I'm <span className="text-text-primary font-semibold">Malhar Pawar</span> — an Analytics Architect building high-performance data platforms and AI-powered intelligence.
            </p>
          </Reveal>

          <Reveal delay={4}>
            <div className="flex flex-wrap gap-4 mb-16">
              <Magnetic strength={0.2}>
                <Link href="/projects"
                  className="btn-ripple btn-cta-pulse shine inline-flex items-center gap-2 px-8 py-4 bg-accent text-bg-primary font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                  View My Work <ChevronRight size={16} />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl text-sm font-semibold hover:border-accent/60 hover:text-accent hover:bg-accent/5 transition-all duration-300">
                  <Mail size={16} /> Get In Touch
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={5}>
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden border border-border/60" style={{ background: 'linear-gradient(135deg, rgba(18,24,21,0.9), rgba(13,17,15,0.9))' }}>
              {[
                { n: 18, s: '+', label: 'Projects Completed', gold: false },
                { n: 15, s: '+', label: 'Technologies', gold: true },
                { n: 2, s: '+', label: 'Years Experience', gold: false },
                { n: 2, s: '', label: 'Certifications', gold: true },
              ].map((stat, i) => (
                <div key={i} className="stat-cell p-6 sm:p-7 text-center border-r border-b border-border/40 last:border-r-0 [&:nth-child(even)]:border-r-0 sm:[&:nth-child(even)]:border-r sm:[&:nth-child(4)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0">
                  <div className={`font-mono text-3xl sm:text-4xl font-bold mb-1.5 ${stat.gold ? 'text-accent-gold neon-glow-gold' : 'text-accent neon-glow'}`}>
                    <AnimatedCounter target={stat.n} suffix={stat.s} />
                  </div>
                  <div className="text-[11px] text-text-muted uppercase tracking-widest font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-gold/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-14">
              <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-accent" /> About Me
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Data Engineer. BI Architect. AI Explorer.</h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal type="left" delay={2}>
              <div className="space-y-5 text-[15px] text-text-secondary leading-relaxed">
                <p>Based in Pune, India, I work at the intersection of data engineering, business intelligence, and artificial intelligence. With hands-on experience building enterprise analytics platforms for the QSR and finance industries, I specialize in transforming complex data ecosystems into actionable intelligence.</p>
                <p>My current focus is on integrating Large Language Models with BI platforms through Model Context Protocol (MCP) servers — building AI copilots that let business users query data using natural language. I hold the <span className="text-accent-gold font-semibold">Microsoft Fabric Analytics Engineer Associate</span> and <span className="text-accent-gold font-semibold">Microsoft Fabric Data Engineer Associate</span> certifications.</p>
                <p>I believe the future of analytics is conversational, automated, and deeply integrated with AI. Every project I build moves toward that vision.</p>

                <div className="flex gap-3 pt-2">
                  <a href="https://github.com/malharpawar505" target="_blank" rel="noreferrer"
                    className="shine flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-medium hover:border-text-muted hover:bg-bg-card transition-all">
                    <Github size={15} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/malharpawar505/" target="_blank" rel="noreferrer"
                    className="shine flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-medium hover:border-text-muted hover:bg-bg-card transition-all">
                    <Linkedin size={15} /> LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal type="right" delay={3}>
              <div className="space-y-4">
                <div className="gradient-card p-6 rounded-2xl overflow-hidden relative">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-accent-red/60" />
                    <span className="w-3 h-3 rounded-full bg-accent-gold/60" />
                    <span className="w-3 h-3 rounded-full bg-accent/60" />
                    <span className="ml-3 font-mono text-[11px] text-text-muted">current_focus.json</span>
                  </div>
                  <Typewriter
                    delay={1.5}
                    speed={15}
                    codeString={`{
  "role": "Analytics Engineer",
  "company": "Prosys Infotech",
  "location": "Pune, India",
  "certs": [
    "Fabric Analytics Engineer",
    "Fabric Data Engineer"
  ],
  "building": "LLM-powered BI copilots"
}`}
                  />
                </div>

                {/* Cert badges */}
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-accent-gold/20 bg-accent-gold/5">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-accent-gold">Microsoft Certified</div>
                    <div className="text-xs text-text-muted">Fabric Analytics Engineer Associate</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2.5 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-mono font-semibold rounded-full">DP-600</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-accent-blue/20 bg-accent-blue/5">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center text-accent-blue flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-accent-blue">Microsoft Certified</div>
                    <div className="text-xs text-text-muted">Fabric Data Engineer Associate</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2.5 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-mono font-semibold rounded-full">DP-700</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/4 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Tech Stack
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">My Technical Arsenal</h2>
            <p className="text-text-secondary max-w-lg mb-12">Tools and technologies I use daily to build data platforms and intelligence systems.</p>
          </Reveal>

          {(() => {
            const CAT_META = {
              BI:    { label: 'Business Intelligence', color: '#e2c06d', rgb: '226,192,109' },
              Data:  { label: 'Data Engineering',      color: '#50c878', rgb: '80,200,120'  },
              Cloud: { label: 'Cloud & Infrastructure', color: '#5db0ff', rgb: '93,176,255' },
              AI:    { label: 'AI & LLMs',              color: '#ff7676', rgb: '255,118,118'},
              Tools: { label: 'Tools & Practices',      color: '#8b949e', rgb: '139,148,158'},
            };
            const order = ['BI', 'Data', 'Cloud', 'AI', 'Tools'];
            const grouped = TECHNOLOGIES.reduce((acc, t) => {
              (acc[t.cat] = acc[t.cat] || []).push(t);
              return acc;
            }, {});
            return (
              <div className="space-y-10">
                {order.filter(cat => grouped[cat]).map((cat, gi) => {
                  const meta = CAT_META[cat];
                  const techs = grouped[cat];
                  return (
                    <Reveal key={cat} delay={gi + 1}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color, boxShadow: `0 0 8px rgba(${meta.rgb},0.6)` }} />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: meta.color }}>{meta.label}</span>
                        <span className="flex-1 h-px" style={{ background: `rgba(${meta.rgb},0.15)` }} />
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {techs.map((tech, i) => {
                          const colorBase = CAT_COLORS[tech.cat] || 'rgba(80,200,120,';
                          return (
                            <div key={i}
                              className="tech-card shine flex items-center gap-2.5 px-3.5 py-2.5 border rounded-xl text-sm font-medium cursor-default group relative overflow-hidden"
                              style={{ background: `rgba(${meta.rgb},0.06)`, borderColor: `rgba(${meta.rgb},0.18)` }}
                            >
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `radial-gradient(ellipse 80% 80% at 0% 100%, ${colorBase}0.1), transparent)` }} />
                              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 relative z-10" style={{ color: tech.color }}>
                                {tech.LucideIcon ? (
                                  <tech.LucideIcon size={18} strokeWidth={1.5} />
                                ) : (
                                  <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                                )}
                              </div>
                              <span className="relative z-10 text-text-primary group-hover:text-white transition-colors whitespace-nowrap">{tech.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Featured Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Projects That Moved The Needle</h2>
            <p className="text-text-secondary max-w-lg mb-12">Enterprise analytics platforms, data pipelines, and BI solutions delivering measurable impact.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? [1,2,3].map(i => (
              <div key={i} className="h-[400px] rounded-2xl shimmer" />
            )) : projects.map((p, i) => {
              const isBI = p.category === 'BI';
              return (
                <Reveal key={p.id} delay={i + 1}>
                  <Link href={`/projects/${p.id}`} className="block shine bg-bg-card border border-border rounded-2xl overflow-hidden group card-hover h-full">
                    {/* Header with category-specific gradient */}
                    <div className={`h-48 relative overflow-hidden flex items-center justify-center ${isBI ? 'proj-header-bi' : 'proj-header-data'}`}>
                      <div className="absolute inset-0 dot-grid opacity-20" />
                      <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0`}
                        style={{ background: isBI ? 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(242,200,17,0.08), transparent)' : 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(80,200,120,0.08), transparent)' }} />
                      <div className={`proj-icon w-14 h-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        {isBI ? <BarChart3 size={24} /> : <Database size={24} />}
                      </div>
                      {/* Number badge */}
                      <div className="absolute top-4 right-4 font-mono text-[11px] font-bold text-text-muted/40">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${isBI ? 'tag-gold' : 'tag-green'}`}>{p.category}</span>
                        <span className="tag-blue px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.industry}</span>
                      </div>
                      <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{p.problem}</p>
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {p.tools?.slice(0, 3).map((t, j) => (
                          <span key={j} className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">{t}</span>
                        ))}
                        {p.tools?.length > 3 && (
                          <span className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">+{p.tools.length - 3}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        <span className="text-[11px] text-text-muted font-mono">{p.timeline}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all duration-300">
                          View Case Study <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="text-center mt-12">
              <Link href="/projects"
                className="shine inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/60 hover:text-accent transition-all duration-300">
                View All Projects <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ AI EXPERIMENTS ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-gold/4 rounded-full blur-[100px] pointer-events-none orb-drift" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <Reveal>
            <p className="font-mono text-xs text-accent-gold font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent-gold" /> AI & Innovation
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Experimenting at the Edge of AI + Data</h2>
            <p className="text-text-secondary max-w-lg mb-12">Building agentic AI systems, LLM-powered analytics tools, and intelligent data platforms.</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {AI_EXPERIMENTS.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <Reveal key={i} type="scale" delay={i + 1}>
                  <div className="gradient-card shine p-7 rounded-2xl relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-56 h-56 bg-accent-gold/6 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all duration-700" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-accent-gold/12 flex items-center justify-center text-accent-gold mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-gold/20">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-base font-bold mb-2">{exp.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/ai-lab"
                className="shine inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent-gold/50 hover:text-accent-gold transition-all duration-300">
                Explore AI Lab <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ACTIVITY FEED ═══ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Activity Feed
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">What I've Been Building</h2>
            <p className="text-text-secondary max-w-lg mb-12">A timeline of recent technical explorations and experiments.</p>
          </Reveal>

          <div className="space-y-2">
            {activities.map((a, i) => (
              <TerminalEntry key={a.id || i} activity={a} index={i} isLast={i === activities.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Blog & Insights
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-12">Writing About What I Build</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {blogs.map((b, i) => (
              <Reveal key={b.id} delay={i + 1}>
                <a href={b.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <div className="shine gradient-card p-7 rounded-2xl cursor-pointer group h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2.5 py-1 bg-accent-dim text-accent text-[10px] font-mono font-semibold rounded-full">{b.category}</span>
                      <span className="text-xs text-text-muted">{b.date}</span>
                    </div>
                    <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-accent transition-colors">{b.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-5 flex-1">{b.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold group-hover:gap-2.5 transition-all duration-300">
                      {b.link?.includes('medium.com') ? 'Read on Medium' : 'Read on LinkedIn'} <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/blog"
                className="shine inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/60 hover:text-accent transition-all duration-300">
                All Articles <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] orb-drift" />
        </div>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 font-mono text-[11px] text-accent mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent badge-pulse" />
              Available for new opportunities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Let's Build Something{' '}
              <span className="gradient-text">Together</span>
            </h2>
            <p className="text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed text-lg">
              Looking for a data engineer who thinks in systems, builds with purpose, and experiments with AI? Let's talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="btn-ripple btn-cta-pulse shine inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(80,200,120,0.35)] transition-all duration-300">
                <Mail size={16} /> Start a Conversation
              </Link>
              <Link href="/projects"
                className="shine inline-flex items-center justify-center gap-2 px-10 py-4 border border-border rounded-xl text-sm font-semibold hover:border-accent/60 hover:text-accent transition-all duration-300">
                See My Work <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
