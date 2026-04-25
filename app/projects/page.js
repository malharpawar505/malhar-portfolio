'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Search, BarChart3, Database, ArrowUpRight } from 'lucide-react';

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
    <div className="page-enter pt-28 pb-24 min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[120px] pointer-events-none orb-drift" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-accent-gold/4 rounded-full blur-[100px] pointer-events-none orb-drift-2" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent" /> All Projects
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Work Portfolio</h1>
          <p className="text-text-secondary max-w-lg mb-10 leading-relaxed">A comprehensive showcase of data engineering, BI, and analytics projects delivering measurable business impact.</p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={2}>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-card border border-border rounded-xl max-w-sm flex-1 focus-within:border-accent/50 transition-colors duration-200">
              <Search size={15} className="text-text-muted flex-shrink-0" />
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
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    filter === c
                      ? 'border-accent text-accent bg-accent/10 shadow-[0_0_20px_rgba(80,200,120,0.1)]'
                      : 'border-border text-text-secondary bg-bg-card hover:border-accent/30 hover:text-text-primary'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Count */}
        {!loading && (
          <Reveal>
            <p className="text-sm text-text-muted font-mono mb-6">
              {filtered.length === projects.length
                ? `${projects.length} projects`
                : `${filtered.length} of ${projects.length} projects`}
            </p>
          </Reveal>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-[420px] rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <div className="text-4xl mb-4 opacity-30">⊘</div>
            <p>No projects match your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, i) => {
              const isBI = p.category === 'BI';
              return (
                <Reveal key={p.id} type="scale" delay={Math.min(i + 1, 6)}>
                  <Link href={`/projects/${p.id}`} className="block shine bg-bg-card border border-border rounded-2xl overflow-hidden group card-hover h-full">
                    {/* Header */}
                    <div className={`h-44 relative overflow-hidden flex items-center justify-center ${isBI ? 'proj-header-bi' : 'proj-header-data'}`}>
                      <div className="absolute inset-0 dot-grid opacity-25" />
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        style={{ background: isBI
                          ? 'radial-gradient(ellipse 70% 90% at 50% 100%, rgba(242,200,17,0.1), transparent)'
                          : 'radial-gradient(ellipse 70% 90% at 50% 100%, rgba(80,200,120,0.1), transparent)' }} />
                      <div className="proj-icon w-14 h-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {isBI ? <BarChart3 size={24} /> : <Database size={24} />}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${isBI ? 'bg-accent-gold/15 text-accent-gold' : 'bg-accent/15 text-accent'}`}>
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 font-mono text-[11px] font-bold text-white/20">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col h-[calc(100%-176px)]">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className="tag-blue px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.industry}</span>
                        <span className="tag-gold px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.timeline}</span>
                      </div>
                      <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">{p.problem}</p>
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {p.tools?.slice(0, 3).map((t, j) => (
                          <span key={j} className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">{t}</span>
                        ))}
                        {p.tools?.length > 3 && (
                          <span className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">+{p.tools.length - 3}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
                        <span className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                          {p.status}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all duration-300">
                          View Details <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
