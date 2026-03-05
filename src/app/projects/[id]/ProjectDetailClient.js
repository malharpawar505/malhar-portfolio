'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/UI';

const sections = [
  { key: 'problem', label: 'Business Problem', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', type: 'polygon' },
  { key: 'architecture', label: 'Data Architecture', icon: 'M12 2 2 7 12 12 22 7 12 2M2 17 12 22 22 17M2 12 12 17 22 12', type: 'path' },
  { key: 'modeling', label: 'Data Modeling', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', type: 'path' },
  { key: 'pipeline', label: 'ETL / Pipeline', icon: 'M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3z', type: 'path' },
  { key: 'dashboards', label: 'Dashboards & Reporting', icon: 'M12 20V10M18 20V4M6 20V16', type: 'path' },
  { key: 'insights', label: 'Key Insights & Impact', icon: 'M12 8 7 23 12 20 17 23M12 8a7 7 0 1 0 0-1', type: 'path' },
];

export default function ProjectDetailClient({ project: p }) {
  return (
    <main className="pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <Link href="/projects" className="btn-secondary text-sm py-2 px-4 mb-8 inline-flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Projects
          </Link>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1} className="mb-12">
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="tag tag-green">{p.category}</span>
            <span className="tag tag-gold">{p.industry}</span>
            <span className="tag tag-blue">{p.timeline}</span>
          </div>
          <h1 className="text-[clamp(26px,4vw,40px)] font-extrabold tracking-tight leading-[1.1] mb-5">{p.title}</h1>
          <div className="flex gap-2 flex-wrap">
            {p.tools.map((t, i) => (
              <span key={i} className="tool-chip text-xs py-1.5 px-3">{t}</span>
            ))}
          </div>
        </FadeIn>

        {/* Sections */}
        {sections.map((sec, i) => {
          if (!p[sec.key]) return null;
          return (
            <FadeIn key={sec.key} delay={0.1 + i * 0.06}>
              <div className="mb-10 pb-10 border-b border-[var(--border)] last:border-b-0">
                <h3 className="flex items-center gap-3 text-[17px] font-bold text-[var(--accent)] mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {sec.type === 'polygon' ? <polygon points={sec.icon}/> : <path d={sec.icon}/>}
                  </svg>
                  {sec.label}
                </h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-[1.85]">{p[sec.key]}</p>
              </div>
            </FadeIn>
          );
        })}

        {/* GitHub link */}
        {p.github && (
          <FadeIn>
            <a href={p.github} target="_blank" rel="noreferrer" className="btn-secondary inline-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View on GitHub
            </a>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
