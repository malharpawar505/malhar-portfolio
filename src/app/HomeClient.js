'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader, AnimatedCounter, FadeIn, StaggerContainer, StaggerItem } from '@/components/UI';
import ProjectCard from '@/components/ProjectCard';

const TECHNOLOGIES = [
  { name: 'Power BI', color: '#F2C811', cat: 'BI' },
  { name: 'SQL', color: '#48bb6c', cat: 'Data' },
  { name: 'Python', color: '#3776ab', cat: 'Data' },
  { name: 'DAX', color: '#F2C811', cat: 'BI' },
  { name: 'Microsoft Fabric', color: '#4a9eff', cat: 'Cloud' },
  { name: 'Azure Synapse', color: '#0078d4', cat: 'Cloud' },
  { name: 'Azure Data Factory', color: '#0078d4', cat: 'Cloud' },
  { name: 'Snowflake', color: '#29b5e8', cat: 'Cloud' },
  { name: 'Azure DevOps', color: '#0078d4', cat: 'Tools' },
  { name: 'ETL/ELT Pipelines', color: '#48bb6c', cat: 'Data' },
  { name: 'Data Modeling', color: '#c9a84c', cat: 'Data' },
  { name: 'Data Warehouse', color: '#c9a84c', cat: 'Data' },
  { name: 'LLM / AI', color: '#ef6461', cat: 'AI' },
  { name: 'MCP Servers', color: '#ef6461', cat: 'AI' },
  { name: 'Medallion Architecture', color: '#48bb6c', cat: 'Data' },
  { name: 'Git & GitHub', color: '#8b949e', cat: 'Tools' },
];

const AI_EXPERIMENTS = [
  { title: 'AI-Powered BI Copilot', desc: 'Built an intelligent chatbot integrating LLMs with Power BI semantic models via MCP servers. Users query business data using natural language and receive instant visualizations.', icon: 'brain' },
  { title: 'Autonomous Analytics Agent', desc: 'Developed an agentic AI system that monitors data quality, detects anomalies, and automatically generates executive summaries pushed to stakeholders.', icon: 'zap' },
  { title: 'LLM Data Query Engine', desc: 'Created a natural language to SQL/DAX translator powered by Claude that understands business context and semantic model metadata.', icon: 'terminal' },
  { title: 'AI Data Quality Monitor', desc: 'Experimented with AI-driven data reconciliation systems that learn expected patterns and flag anomalies in data pipelines automatically.', icon: 'database' },
];

const iconPaths = {
  brain: 'M9.5 2A5.5 5.5 0 0 0 4 7.5c0 .68.09 1.34.26 1.97A4.5 4.5 0 0 0 1 13.5 4.5 4.5 0 0 0 5.5 18H6a5 5 0 0 0 4 2 5 5 0 0 0 4-2h.5a4.5 4.5 0 0 0 4.5-4.5 4.5 4.5 0 0 0-3.26-4.03c.17-.63.26-1.29.26-1.97A5.5 5.5 0 0 0 14.5 2 5.5 5.5 0 0 0 12 2.66 5.5 5.5 0 0 0 9.5 2z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  database: 'M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3z',
};

export default function HomeClient({ projects, blogs, activities }) {
  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 55% at 15% 50%, rgba(72,187,108,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 hero-grid-bg" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-7"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[rgba(72,187,108,0.2)] mono text-xs text-[var(--accent)] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" style={{ animation: 'pulse-dot 2s infinite' }} />
              Open to opportunities · Data Engineering & AI
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(38px,6vw,76px)] font-extrabold leading-[1.04] tracking-[-2px] mb-6 max-w-3xl"
          >
            Building{' '}
            <span className="gradient-text">Intelligent Data Systems</span>{' '}
            That Drive Decisions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10"
          >
            I'm Malhar Pawar — a Data & Analytics Engineer turning raw data into
            business intelligence platforms, AI-powered copilots, and scalable data architectures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex gap-4 flex-wrap mb-16"
          >
            <Link href="/projects" className="btn-primary">
              View My Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Get In Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-[1px] rounded-[var(--radius)] overflow-hidden border border-[var(--border)] stats-grid-4"
          >
            {[
              { n: 12, s: '+', label: 'Projects Delivered', gold: false },
              { n: 15, s: '+', label: 'Technologies', gold: true },
              { n: 2, s: '+', label: 'Years Experience', gold: false },
              { n: 1, s: '', label: 'Certifications', gold: true },
            ].map((stat, i) => (
              <div key={i} className="bg-[var(--bg-card)] p-7 text-center hover:bg-[var(--bg-card-hover)] transition-colors">
                <div className={`mono text-3xl font-bold mb-1 ${stat.gold ? 'text-[var(--accent-gold)]' : 'text-[var(--accent)]'}`}>
                  <AnimatedCounter target={stat.n} suffix={stat.s} />
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[1.2px] font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="About Me" title="Data Engineer. BI Architect. AI Explorer." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start container-grid-2">
            <FadeIn delay={0.1}>
              <div className="space-y-5 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
                <p>Based in Pune, India, I work at the intersection of data engineering, business intelligence, and artificial intelligence. With hands-on experience building enterprise analytics platforms for the QSR and finance industries, I specialize in transforming complex data ecosystems into actionable intelligence.</p>
                <p>My current focus is on integrating Large Language Models with BI platforms through Model Context Protocol (MCP) servers — building AI copilots that let business users query data using natural language. I hold a Microsoft Fabric Analytics Engineer Associate certification.</p>
                <p>I believe the future of analytics is conversational, automated, and deeply integrated with AI. Every project I build moves toward that vision.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-7">
                <div className="mono text-xs text-[var(--text-muted)] mb-4">// current_focus.json</div>
                <div className="mono text-[13px] leading-[2.2]">
                  <span className="text-[var(--text-muted)]">{'{'}</span><br/>
                  {[
                    ['role', 'Analytics Engineer'],
                    ['company', 'Prosys Infotech'],
                    ['location', 'Pune, India'],
                    ['cert', 'Fabric Analytics Engineer'],
                    ['passion', 'AI + Data Integration'],
                    ['building', 'LLM-powered BI copilots'],
                  ].map(([k, v], i) => (
                    <span key={i}>
                      {'  '}<span className="text-[var(--accent)]">"{k}"</span>
                      : <span className="text-[var(--accent-gold)]">"{v}"</span>
                      {i < 5 ? ',' : ''}<br/>
                    </span>
                  ))}
                  <span className="text-[var(--text-muted)]">{'}'}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <a href="https://github.com/malharpawar505" target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2.5 px-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/malharpawar505/" target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2.5 px-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Skills & Technologies" title="My Technical Arsenal" desc="Tools and technologies I use daily to build data platforms and intelligence systems." />
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECHNOLOGIES.map((tech, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-sm)] text-sm font-medium card-hover cursor-default">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tech.color }} />
                  {tech.name}
                  <span className="ml-auto text-[11px] text-[var(--text-muted)]">{tech.cat}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Featured Work" title="Projects That Moved The Needle" desc="Enterprise analytics platforms, data pipelines, and BI solutions delivering measurable business impact." />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 projects-grid-auto">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </StaggerContainer>
          <FadeIn className="text-center mt-10">
            <Link href="/projects" className="btn-secondary inline-flex">
              View All Projects
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ AI & INNOVATION ═══ */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="AI & Innovation" labelColor="var(--accent-gold)" title="Experimenting at the Edge of AI + Data" desc="Building agentic AI systems, LLM-powered analytics tools, and intelligent data platforms." />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AI_EXPERIMENTS.map((exp, i) => (
              <StaggerItem key={i}>
                <div className="relative p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] card-hover overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-[radial-gradient(circle,rgba(201,168,76,0.06),transparent_70%)] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-12 h-12 rounded-[14px] bg-[var(--accent-gold-dim)] flex items-center justify-center text-[var(--accent-gold)] mb-5 relative z-10">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {exp.icon === 'zap' ? <polygon points={iconPaths[exp.icon]}/> : <path d={iconPaths[exp.icon]}/>}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2.5 relative z-10">{exp.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed relative z-10">{exp.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn className="text-center mt-10">
            <Link href="/ai-lab" className="btn-secondary inline-flex">
              Explore AI Lab
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ ACTIVITY FEED ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader label="Activity Feed" title="What I've Been Building" desc="A timeline of recent technical explorations, experiments, and learning." />
          {activities.map((a, i) => (
            <FadeIn key={a.id} delay={i * 0.08}>
              <div className="flex gap-5 pb-6 mb-6 border-b border-[var(--border)] last:border-b-0">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] flex-shrink-0 shadow-[0_0_0_4px_var(--accent-dim)]" />
                  {i < activities.length - 1 && <div className="w-px flex-1 bg-[var(--border)] min-h-[20px]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mono text-[11px] text-[var(--text-muted)] mb-1">{a.date}</div>
                  <div className="text-[15px] font-semibold mb-1">{a.title}</div>
                  <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">{a.desc}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {a.tags.map((t, j) => <span key={j} className="tool-chip">{t}</span>)}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Blog & Insights" title="Writing About What I Build" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {blogs.map((b) => (
              <StaggerItem key={b.id}>
                <div className="p-7 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] card-hover">
                  <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-muted)]">
                    <span>{b.category}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                    <span>{b.date}</span>
                    {b.readTime && <><span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" /><span>{b.readTime}</span></>}
                  </div>
                  <h3 className="text-[17px] font-bold mb-2 leading-snug">{b.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{b.excerpt}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn className="text-center mt-10">
            <Link href="/blog" className="btn-secondary inline-flex">
              All Articles
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight mb-5">Let's Build Something Together</h2>
            <p className="text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed mb-8">
              Looking for a data engineer who thinks in systems, builds with purpose, and experiments with AI? Let's talk.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Start a Conversation
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
