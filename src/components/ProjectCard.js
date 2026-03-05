'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, index = 0 }) {
  const p = project;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <Link href={`/projects/${p.id}`} className="block">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden card-hover cursor-pointer group">
          {/* Thumbnail */}
          <div className="h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card-hover)] relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 75%, var(--accent) 1px, transparent 1px), radial-gradient(circle at 75% 25%, var(--accent-gold) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-dim)] flex items-center justify-center text-[var(--accent)] z-10 group-hover:scale-110 transition-transform duration-500">
              {p.category === 'BI' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              )}
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="tag tag-green">{p.category}</span>
              <span className="tag tag-gold">{p.industry}</span>
              {p.timeline && <span className="tag tag-blue">{p.timeline}</span>}
            </div>
            <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[var(--accent)] transition-colors duration-300">
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
