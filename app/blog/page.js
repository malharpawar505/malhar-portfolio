'use client';
import { useState, useEffect } from 'react';
import { Reveal } from '@/components/Reveal';
import { ArrowUpRight } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => { setBlogs(data.filter(b => b.status === 'published')); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(blogs.map(b => b.category).filter(Boolean))];
  const filtered = filter === 'All' ? blogs : blogs.filter(b => b.category === filter);

  return (
    <div className="page-enter pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent" /> Blog & Insights
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Technical Writing</h1>
          <p className="text-text-secondary max-w-lg mb-10">Articles on data engineering, Power BI, Azure analytics, AI, and the craft of building data systems.</p>
        </Reveal>

        <Reveal delay={2}>
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  filter === c ? 'border-accent text-accent bg-accent-dim' : 'border-border text-text-secondary bg-bg-card hover:border-text-muted'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="h-52 shimmer rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((b, i) => (
              <Reveal key={b.id} type="scale" delay={Math.min(i + 1, 6)}>
                <a href={b.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                <article className="card-hover p-7 bg-bg-card border border-border rounded-2xl cursor-pointer group h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4 text-xs text-text-muted">
                    <span className="font-semibold text-accent">{b.category}</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                    <span>{b.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 leading-snug group-hover:text-accent transition-colors flex-1">{b.title}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-5">{b.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold group-hover:gap-2.5 transition-all duration-300 mt-auto">
                    {b.link?.includes('medium.com') ? 'Read on Medium' : 'Read on LinkedIn'} <ArrowUpRight size={13} />
                  </span>
                </article>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-text-muted">No articles in this category yet.</div>
        )}
      </div>
    </div>
  );
}
