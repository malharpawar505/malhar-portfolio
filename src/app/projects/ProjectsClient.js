'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StaggerContainer } from '@/components/UI';
import ProjectCard from '@/components/ProjectCard';

const CATEGORIES = ['All', 'BI', 'Data Engineering'];

export default function ProjectsClient({ projects }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = projects.filter(p => {
    const matchCat = filter === 'All' || p.category === filter;
    const matchQ = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.tools.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQ;
  });

  return (
    <main className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="All Projects" title="Work Portfolio" desc="A comprehensive showcase of data engineering, BI, and analytics projects delivering real business impact." />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] max-w-sm w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search projects or tools..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
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
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 projects-grid-auto">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[var(--text-muted)]">
            No projects match your search. Try different keywords.
          </motion.div>
        )}
      </div>
    </main>
  );
}
