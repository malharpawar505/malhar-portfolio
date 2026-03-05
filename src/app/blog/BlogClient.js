'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StaggerContainer, StaggerItem, FadeIn } from '@/components/UI';

export default function BlogClient({ blogs }) {
  const categories = ['All', ...new Set(blogs.map(b => b.category))];
  const [filter, setFilter] = useState('All');

  const filtered = blogs.filter(b => filter === 'All' || b.category === filter);

  return (
    <main className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Blog & Insights"
          title="Technical Writing"
          desc="Articles on data engineering, Power BI, Azure analytics, AI, and career growth in the data space."
        />

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                filter === c
                  ? 'bg-[var(--accent-dim)] border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <StaggerItem key={b.id}>
              <div className="p-7 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] card-hover group cursor-pointer">
                <div className="flex items-center gap-3 mb-4 text-xs text-[var(--text-muted)]">
                  <span className="tag tag-green">{b.category}</span>
                  <span>{b.date}</span>
                  {b.readTime && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                      <span>{b.readTime}</span>
                    </>
                  )}
                </div>
                <h3 className="text-[17px] font-bold mb-3 leading-snug group-hover:text-[var(--accent)] transition-colors duration-300">
                  {b.title}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                  {b.content || b.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(b.tags || []).map((t, i) => <span key={i} className="tool-chip">{t}</span>)}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] group-hover:gap-3 transition-all duration-300">
                  Read More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[var(--text-muted)]">
            No articles in this category yet.
          </motion.div>
        )}
      </div>
    </main>
  );
}
