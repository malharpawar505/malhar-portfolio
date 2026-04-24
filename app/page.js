'use client';
import Link from 'next/link';
import { Reveal, AnimatedCounter } from '@/components/Reveal';
import {
  ChevronRight, Mail, Github, Linkedin, BarChart3, Database,
  Brain, Zap, Terminal, Award, MapPin, ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const TECHNOLOGIES = [
  { name: 'Power BI', color: '#F2C811', cat: 'BI' },
  { name: 'SQL', color: '#50c878', cat: 'Data' },
  { name: 'Python', color: '#3776ab', cat: 'Data' },
  { name: 'DAX', color: '#F2C811', cat: 'BI' },
  { name: 'Microsoft Fabric', color: '#4a9eff', cat: 'Cloud' },
  { name: 'Azure Synapse', color: '#0078d4', cat: 'Cloud' },
  { name: 'Azure Data Factory', color: '#0078d4', cat: 'Cloud' },
  { name: 'Snowflake', color: '#29b5e8', cat: 'Cloud' },
  { name: 'Azure DevOps', color: '#0078d4', cat: 'Cloud' },
  { name: 'ETL / ELT Pipelines', color: '#50c878', cat: 'Data' },
  { name: 'Data Modeling', color: '#c9a84c', cat: 'Data' },
  { name: 'Data Warehouse', color: '#c9a84c', cat: 'Data' },
  { name: 'LLM / AI', color: '#ff6b6b', cat: 'AI' },
  { name: 'MCP Servers', color: '#ff6b6b', cat: 'AI' },
  { name: 'Medallion Architecture', color: '#50c878', cat: 'Data' },
  { name: 'Git & GitHub', color: '#8b949e', cat: 'Tools' },
];

const AI_EXPERIMENTS = [
  { title: 'AI-Powered BI Copilot', desc: 'LLM integration with Power BI semantic models via MCP servers for natural language data querying.', icon: Brain },
  { title: 'Autonomous Analytics Agent', desc: 'Agentic AI system that monitors data quality, detects anomalies, and auto-generates executive summaries.', icon: Zap },
  { title: 'LLM Data Query Engine', desc: 'Natural language to SQL/DAX translator powered by Claude that understands business context and metadata.', icon: Terminal },
  { title: 'AI Data Quality Monitor', desc: 'AI-driven data reconciliation and validation that learns patterns and flags pipeline anomalies.', icon: Database },
];

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
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid" style={{ maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)' }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 15% 50%, rgba(80,200,120,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)'
          }} />
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-12">
          <Reveal delay={1}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-dim border border-accent/20 font-mono text-xs text-accent font-medium tracking-wide mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
              Open to opportunities · Data Engineering & AI
            </div>
          </Reveal>

          <Reveal delay={2}>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.05] tracking-tight max-w-4xl mb-7">
              Building{' '}
              <span className="gradient-text">Intelligent Data Systems</span>
              {' '}That Drive Decisions
            </h1>
          </Reveal>

          <Reveal delay={3}>
            <p className="text-lg text-text-secondary max-w-xl leading-relaxed mb-10">
              I'm <span className="text-text-primary font-semibold">Malhar Pawar</span> — a Data & Analytics Engineer turning raw data into business intelligence platforms, AI-powered copilots, and scalable data architectures.
            </p>
          </Reveal>

          <Reveal delay={4}>
            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/projects"
                className="btn-ripple inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(80,200,120,0.3)] transition-all duration-300">
                View My Work <ChevronRight size={16} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-xl text-sm font-semibold hover:border-text-secondary hover:bg-bg-card transition-all duration-300">
                <Mail size={16} /> Get In Touch
              </Link>
            </div>
          </Reveal>

          <Reveal delay={5}>
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-border rounded-2xl overflow-hidden">
              {[
                { n: 12, s: '+', label: 'Projects Delivered', gold: false },
                { n: 15, s: '+', label: 'Technologies', gold: true },
                { n: 2, s: '+', label: 'Years Experience', gold: false },
                { n: 1, s: '', label: 'Certifications', gold: true },
              ].map((stat, i) => (
                <div key={i} className="p-6 sm:p-7 bg-bg-card text-center hover:bg-bg-card-hover transition-colors border-r border-b border-border last:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 [&:nth-child(even)]:border-r-0 sm:[&:nth-child(even)]:border-r sm:[&:nth-child(4)]:border-r-0">
                  <div className={`font-mono text-3xl sm:text-4xl font-bold mb-1 ${stat.gold ? 'text-accent-gold' : 'text-accent'}`}>
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
      <section className="py-24 sm:py-32">
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
                <p>My current focus is on integrating Large Language Models with BI platforms through Model Context Protocol (MCP) servers — building AI copilots that let business users query data using natural language. I hold a <span className="text-accent-gold font-medium">Microsoft Fabric Analytics Engineer Associate</span> certification.</p>
                <p>I believe the future of analytics is conversational, automated, and deeply integrated with AI. Every project I build moves toward that vision.</p>
              </div>
            </Reveal>

            <Reveal type="right" delay={3}>
              <div className="space-y-5">
                {/* Code block */}
                <div className="p-6 bg-bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-accent-red/60" />
                    <span className="w-3 h-3 rounded-full bg-accent-gold/60" />
                    <span className="w-3 h-3 rounded-full bg-accent/60" />
                    <span className="ml-3 font-mono text-[11px] text-text-muted">current_focus.json</span>
                  </div>
                  <pre className="font-mono text-[13px] leading-[1.9]">
<span className="text-text-muted">{'{'}</span>{'\n'}
<span className="text-accent">  "role"</span>: <span className="text-accent-gold">"Analytics Engineer"</span>,{'\n'}
<span className="text-accent">  "company"</span>: <span className="text-accent-gold">"Prosys Infotech"</span>,{'\n'}
<span className="text-accent">  "location"</span>: <span className="text-accent-gold">"Pune, India"</span>,{'\n'}
<span className="text-accent">  "cert"</span>: <span className="text-accent-gold">"Fabric Analytics Engineer"</span>,{'\n'}
<span className="text-accent">  "building"</span>: <span className="text-accent-gold">"LLM-powered BI copilots"</span>{'\n'}
<span className="text-text-muted">{'}'}</span>
                  </pre>
                </div>
                {/* Social links */}
                <div className="flex gap-3">
                  <a href="https://github.com/malharpawar505" target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-medium hover:border-text-secondary hover:bg-bg-card transition-all">
                    <Github size={16} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/malharpawar505/" target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-medium hover:border-text-secondary hover:bg-bg-card transition-all">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Tech Stack
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">My Technical Arsenal</h2>
            <p className="text-text-secondary max-w-lg mb-12">Tools and technologies I use daily to build data platforms and intelligence systems.</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECHNOLOGIES.map((tech, i) => (
              <Reveal key={i} type="scale" delay={Math.min((i % 8) + 1, 8)}>
                <div className="card-hover flex items-center gap-3 px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm font-medium cursor-default group">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-150" style={{ background: tech.color }} />
                  <span className="flex-1 truncate">{tech.name}</span>
                  <span className="text-[10px] text-text-muted font-mono">{tech.cat}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Featured Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Projects That Moved The Needle</h2>
            <p className="text-text-secondary max-w-lg mb-12">Enterprise analytics platforms, data pipelines, and BI solutions delivering measurable impact.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? [1,2,3].map(i => (
              <div key={i} className="h-[380px] rounded-2xl shimmer" />
            )) : projects.map((p, i) => (
              <Reveal key={p.id} delay={i + 1}>
                <Link href={`/projects/${p.id}`} className="block card-hover bg-bg-card border border-border rounded-2xl overflow-hidden group">
                  <div className="h-48 bg-gradient-to-br from-bg-secondary to-bg-card-hover relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, var(--accent) 1px, transparent 1px), radial-gradient(circle at 75% 25%, var(--accent-gold) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    <div className="w-14 h-14 rounded-2xl bg-accent-dim flex items-center justify-center text-accent z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      {p.category === 'BI' ? <BarChart3 size={24} /> : <Database size={24} />}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="tag-green px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.category}</span>
                      <span className="tag-gold px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.industry}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-accent transition-colors duration-300">{p.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{p.problem}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tools?.slice(0, 4).map((t, j) => (
                        <span key={j} className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-12">
              <Link href="/projects"
                className="inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent hover:text-accent transition-all duration-300">
                View All Projects <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ AI EXPERIMENTS ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
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
                  <div className="card-hover p-7 bg-bg-card border border-border rounded-2xl relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/8 transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-accent-gold-dim flex items-center justify-center text-accent-gold mb-5 transition-transform duration-300 group-hover:scale-110">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{exp.title}</h3>
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
                className="inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent-gold hover:text-accent-gold transition-all duration-300">
                Explore AI Lab <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ACTIVITY FEED ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-accent" /> Activity Feed
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">What I've Been Building</h2>
            <p className="text-text-secondary max-w-lg mb-12">A timeline of recent technical explorations and experiments.</p>
          </Reveal>

          <div className="space-y-0">
            {activities.map((a, i) => (
              <Reveal key={a.id} delay={i + 1}>
                <div className="flex gap-5 pb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent border-2 border-bg-primary ring-4 ring-accent-dim flex-shrink-0" />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className="font-mono text-[11px] text-text-muted mb-1.5">{a.date}</p>
                    <h4 className="text-[15px] font-semibold mb-1">{a.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">{a.description}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {a.tags?.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono text-text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
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
                <div className="card-hover p-7 bg-bg-card border border-border rounded-2xl cursor-pointer group h-full">
                  <div className="flex items-center gap-3 mb-4 text-xs text-text-muted">
                    <span className="font-medium">{b.category}</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                    <span>{b.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-accent transition-colors">{b.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{b.excerpt}</p>
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
                className="inline-flex items-center gap-2 px-7 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent hover:text-accent transition-all duration-300">
                All Articles <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">Let's Build Something Together</h2>
            <p className="text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
              Looking for a data engineer who thinks in systems, builds with purpose, and experiments with AI? Let's talk.
            </p>
            <Link href="/contact"
              className="btn-ripple inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(80,200,120,0.3)] transition-all duration-300">
              <Mail size={16} /> Start a Conversation
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
