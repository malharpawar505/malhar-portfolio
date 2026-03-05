'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Search, BarChart3, Database, Filter, ArrowUpRight } from 'lucide-react';

const CATEGORIES = ['All', 'BI', 'Data Engineering'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { setProjects(data.filter(p => p.status === 'published')); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const matchFilter = filter === 'All' || p.category === filter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tools?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="page-enter pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent" /> All Projects
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Work Portfolio</h1>
          <p className="text-text-secondary max-w-lg mb-10">A comprehensive showcase of data engineering, BI, and analytics projects.</p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={2}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-card border border-border rounded-xl max-w-sm flex-1">
              <Search size={16} className="text-text-muted flex-shrink-0" />
              <input
                placeholder="Search projects or tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    filter === c
                      ? 'border-accent text-accent bg-accent-dim'
                      : 'border-border text-text-secondary bg-bg-card hover:border-text-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Project Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-[380px] rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted">No projects match your search criteria.</div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={p.id} type="scale" delay={Math.min(i + 1, 6)}>
                <Link href={`/projects/${p.id}`} className="block card-hover bg-bg-card border border-border rounded-2xl overflow-hidden group">
                  <div className="h-44 bg-gradient-to-br from-bg-secondary to-bg-card-hover relative overflow-hidden flex items-center justify-center">
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
                      <span className="tag-blue px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.timeline}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-accent transition-colors">{p.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{p.problem}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tools?.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
