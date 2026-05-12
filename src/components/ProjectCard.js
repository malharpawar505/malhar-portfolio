'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CAT_CONFIG = {
  BI: {
    gradient: 'from-[rgba(201,168,76,0.15)] to-[rgba(72,187,108,0.08)]',
    dot: '#c9a84c',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
    tagClass: 'tag tag-gold',
  },
  'Data Engineering': {
    gradient: 'from-[rgba(74,158,255,0.12)] to-[rgba(72,187,108,0.08)]',
    dot: '#4a9eff',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    tagClass: 'tag tag-blue',
  },
};

const DEFAULT_CONFIG = {
  gradient: 'from-[rgba(72,187,108,0.1)] to-[rgba(201,168,76,0.06)]',
  dot: '#48bb6c',
  icon: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  tagClass: 'tag tag-green',
};

export default function ProjectCard({ project }) {
  const p = project;
  const cfg = CAT_CONFIG[p.category] || DEFAULT_CONFIG;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <Link href={`/projects/${p.id}`} className="block group">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden card-hover cursor-pointer">
          {/* Thumbnail */}
          <div className={`h-44 bg-gradient-to-br ${cfg.gradient} relative overflow-hidden flex items-center justify-center`}>
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `radial-gradient(circle, ${cfg.dot} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            {/* Glow blob */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${cfg.dot}18, transparent)` }}
            />
            {/* Icon */}
            <div className="relative z-10 w-14 h-14 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.3)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
              style={{ color: cfg.dot }}
            >
              {cfg.icon}
            </div>
            {/* Industry tag top-right */}
            <div className="absolute top-3 right-3">
              <span className={`${cfg.tagClass} text-[10px]`}>{p.industry}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag tag-green">{p.category}</span>
              {p.timeline && <span className="tag tag-blue">{p.timeline}</span>}
            </div>
            <h3 className="text-[17px] font-bold mb-2 leading-snug group-hover:text-[var(--accent)] transition-colors duration-300">
              {p.title}
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
              {p.problem}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {p.tools.slice(0, 4).map((t, i) => (
                <span key={i} className="tool-chip">{t}</span>
              ))}
              {p.tools.length > 4 && (
                <span className="tool-chip">+{p.tools.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
