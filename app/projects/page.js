'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Search, BarChart3, Database, ArrowUpRight, Cpu, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'BI', 'Data Engineering', 'AI'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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
              const isAI = p.category === 'AI';
              const isExpanded = expandedId === p.id;
              
              const bgGradient = isAI 
                ? 'radial-gradient(ellipse 70% 90% at 50% 100%, rgba(147,51,234,0.1), transparent)'
                : isBI 
                  ? 'radial-gradient(ellipse 70% 90% at 50% 100%, rgba(242,200,17,0.1), transparent)'
                  : 'radial-gradient(ellipse 70% 90% at 50% 100%, rgba(80,200,120,0.1), transparent)';
              
              const badgeClass = isAI
                ? 'bg-purple-500/15 text-purple-400'
                : isBI 
                  ? 'bg-accent-gold/15 text-accent-gold' 
                  : 'bg-accent/15 text-accent';

              return (
                <Reveal key={p.id} type="scale" delay={Math.min(i + 1, 6)}>
                  <div className={`relative flex flex-col bg-bg-card border ${isExpanded ? 'border-accent shadow-[0_8px_30px_rgba(80,200,120,0.15)]' : 'border-border'} rounded-2xl overflow-hidden group card-hover h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(80,200,120,0.15)] hover:border-accent/50`}>
                    {/* Header */}
                    <div className="h-44 relative overflow-hidden flex items-center justify-center bg-bg-secondary/50">
                      <div className="absolute inset-0 dot-grid opacity-25" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: bgGradient }} />
                      <div className="proj-icon w-14 h-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {isAI ? <Cpu size={24} /> : isBI ? <BarChart3 size={24} /> : <Database size={24} />}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${badgeClass}`}>
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 font-mono text-[11px] font-bold text-white/20">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 leading-snug group-hover:text-accent transition-colors duration-300">{p.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{p.description}</p>
                      
                      <div className="flex gap-1.5 flex-wrap mb-5">
                        {p.tools?.map((t, j) => (
                          <span key={j} className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-text-muted">{t}</span>
                        ))}
                      </div>

                      {p.impactMetric && (
                        <div className="mb-5 p-3 rounded-lg bg-accent/5 border border-accent/20">
                          <p className="text-sm font-semibold text-accent flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            {p.impactMetric}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-border/40">
                        <button 
                          onClick={(e) => { e.preventDefault(); setExpandedId(isExpanded ? null : p.id); }}
                          className="flex items-center justify-between w-full text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-200"
                        >
                          Impact & Outcome
                          <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-accent' : ''}`} />
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <p className="text-sm text-text-secondary leading-relaxed p-4 bg-bg-secondary/50 rounded-lg border border-border mb-4">
                            {p.impactOutcome}
                          </p>
                          <div className="flex justify-end">
                            <Link href={`/projects/${p.id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline">
                              View Full Case Study <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
