'use client';
import { useState, useEffect } from 'react';
import {
  LayoutGrid, Layers, FileText, Activity, MessageSquare,
  Plus, Eye, EyeOff, Trash2, LogOut, X, ChevronDown,
  Send, Settings, Bell
} from 'lucide-react';

const ADMIN_PASS = 'admin123';
const ADMIN_EMAIL = 'malhar@admin.com';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 bg-bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, textarea, placeholder, rows }) {
  const cls = "w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus";
  return (
    <div>
      <label className="block text-sm font-semibold text-text-secondary mb-2">{label}</label>
      {textarea ? (
        <textarea className={`${cls} resize-y`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} />
      ) : (
        <input className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [tab, setTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // New item states
  const [np, setNp] = useState({ title: '', industry: '', category: 'BI', problem: '', architecture: '', tools: '', modeling: '', pipeline: '', dashboards: '', insights: '', timeline: '', tags: '', status: 'draft' });
  const [nb, setNb] = useState({ title: '', category: '', excerpt: '', status: 'draft' });
  const [na, setNa] = useState({ title: '', description: '', tags: '' });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/blogs').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
    ]).then(([p, b, a, m]) => {
      setProjects(p); setBlogs(b); setActivities(a); setMessages(m);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) setAuthed(true);
  };

  const addProject = async () => {
    await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(np) });
    setNp({ title: '', industry: '', category: 'BI', problem: '', architecture: '', tools: '', modeling: '', pipeline: '', dashboards: '', insights: '', timeline: '', tags: '', status: 'draft' });
    setModal(null);
    fetchAll();
  };

  const addBlog = async () => {
    await fetch('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nb) });
    setNb({ title: '', category: '', excerpt: '', status: 'draft' });
    setModal(null);
    fetchAll();
  };

  const addActivity = async () => {
    await fetch('/api/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(na) });
    setNa({ title: '', description: '', tags: '' });
    setModal(null);
    fetchAll();
  };

  const toggleProjectStatus = async (p) => {
    await fetch(`/api/projects/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: p.status === 'published' ? 'draft' : 'published' }) });
    fetchAll();
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const toggleBlogStatus = async (b) => {
    await fetch(`/api/blogs/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: b.status === 'published' ? 'draft' : 'published' }) });
    fetchAll();
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  // ─── LOGIN SCREEN ───
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-sm p-10 bg-bg-card border border-border rounded-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className="font-mono text-2xl font-bold text-accent mb-2">MP/admin</div>
            <p className="text-sm text-text-muted">Sign in to manage your portfolio</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Email</label>
              <input className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus" placeholder="malhar@admin.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button onClick={handleLogin} className="w-full py-3.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl hover:shadow-[0_8px_30px_rgba(80,200,120,0.3)] transition-all">
              Sign In
            </button>
            <p className="text-center text-xs text-text-muted mt-3">Demo: malhar@admin.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ───
  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'projects', label: 'Projects', icon: Layers, count: projects.length },
    { key: 'blog', label: 'Blog', icon: FileText, count: blogs.length },
    { key: 'activity', label: 'Activity', icon: Activity, count: activities.length },
    { key: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => !m.read).length },
  ];

  return (
    <div className="pt-20 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-bg-secondary border-r border-border fixed top-[72px] bottom-0 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="font-mono text-sm font-bold text-accent">MP/admin</div>
          <div className="text-xs text-text-muted mt-1">Portfolio Manager</div>
        </div>
        <nav className="py-3">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                  tab === item.key ? 'text-accent bg-accent-dim border-r-2 border-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                }`}>
                <Icon size={16} /> {item.label}
                {item.count > 0 && <span className="ml-auto text-xs font-mono bg-bg-card px-2 py-0.5 rounded-full">{item.count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button onClick={() => setAuthed(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-accent-red hover:bg-bg-card rounded-lg transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-border flex">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                tab === item.key ? 'text-accent' : 'text-text-muted'
              }`}>
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 sm:p-8 pb-24 lg:pb-8">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-text-muted mt-1">Welcome back, Malhar</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Published Projects', value: projects.filter(p => p.status === 'published').length, color: 'text-accent' },
                { label: 'Blog Articles', value: blogs.filter(b => b.status === 'published').length, color: 'text-accent-gold' },
                { label: 'Activity Entries', value: activities.length, color: 'text-accent-blue' },
                { label: 'Messages', value: messages.length, color: 'text-accent-red' },
              ].map((s, i) => (
                <div key={i} className="p-5 bg-bg-card border border-border rounded-xl">
                  <div className={`font-mono text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-bg-card border border-border rounded-xl mb-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { setTab('projects'); setModal('project'); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary text-sm font-bold rounded-xl">
                  <Plus size={15} /> New Project
                </button>
                <button onClick={() => { setTab('blog'); setModal('blog'); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-bg-card-hover transition-colors">
                  <Plus size={15} /> New Blog Post
                </button>
                <button onClick={() => { setTab('activity'); setModal('activity'); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-bg-card-hover transition-colors">
                  <Plus size={15} /> Log Activity
                </button>
              </div>
            </div>

            {/* Recent messages */}
            <div className="p-6 bg-bg-card border border-border rounded-xl">
              <h3 className="font-bold mb-4">Recent Messages</h3>
              {messages.length === 0 ? (
                <p className="text-sm text-text-muted">No messages yet.</p>
              ) : messages.slice(0, 5).map(m => (
                <div key={m.id} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{m.email}</p>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-1">{m.message}</p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono flex-shrink-0 ml-4">{new Date(m.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Projects</h1>
              <button onClick={() => setModal('project')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary text-sm font-bold rounded-xl">
                <Plus size={15} /> Add Project
              </button>
            </div>
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Title</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg-card-hover transition-colors">
                        <td className="px-5 py-4 font-semibold text-sm">{p.title}</td>
                        <td className="px-5 py-4 text-sm text-text-secondary hidden sm:table-cell">{p.category}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${p.status === 'published' ? 'tag-green' : 'bg-white/5 text-text-muted'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => toggleProjectStatus(p)} className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all" title={p.status === 'published' ? 'Unpublish' : 'Publish'}>
                              {p.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={() => deleteProject(p.id)} className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent-red transition-all" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BLOG */}
        {tab === 'blog' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Manage Blog</h1>
              <button onClick={() => setModal('blog')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary text-sm font-bold rounded-xl">
                <Plus size={15} /> New Post
              </button>
            </div>
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Title</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(b => (
                      <tr key={b.id} className="border-b border-border last:border-0 hover:bg-bg-card-hover transition-colors">
                        <td className="px-5 py-4 font-semibold text-sm">{b.title}</td>
                        <td className="px-5 py-4 text-sm text-text-secondary hidden sm:table-cell">{b.category}</td>
                        <td className="px-5 py-4 text-xs font-mono text-text-muted hidden md:table-cell">{b.date}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${b.status === 'published' ? 'tag-green' : 'bg-white/5 text-text-muted'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => toggleBlogStatus(b)} className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all">
                              {b.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={() => deleteBlog(b.id)} className="p-2 border border-border rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent-red transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Activity Feed</h1>
              <button onClick={() => setModal('activity')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary text-sm font-bold rounded-xl">
                <Plus size={15} /> Log Activity
              </button>
            </div>
            <div className="space-y-0">
              {activities.map((a, i) => (
                <div key={a.id} className="flex gap-5 pb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent border-2 border-bg-primary ring-4 ring-accent-dim flex-shrink-0" />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-mono text-[11px] text-text-muted mb-1">{a.date}</p>
                    <h4 className="text-sm font-semibold mb-1">{a.title}</h4>
                    <p className="text-sm text-text-secondary">{a.description}</p>
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {a.tags?.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono text-text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            {messages.length === 0 ? (
              <div className="text-center py-16 text-text-muted">No messages yet.</div>
            ) : (
              <div className="space-y-3">
                {messages.map(m => (
                  <div key={m.id} className="p-5 bg-bg-card border border-border rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-sm">{m.name}</span>
                        <span className="text-text-muted text-xs ml-2">{m.email}</span>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">{new Date(m.date).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── MODALS ─── */}
      {modal === 'project' && (
        <Modal title="Add New Project" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FormField label="Project Title *" value={np.title} onChange={v => setNp(p => ({ ...p, title: v }))} placeholder="e.g. Sales Analytics Platform" />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Industry" value={np.industry} onChange={v => setNp(p => ({ ...p, industry: v }))} placeholder="e.g. QSR, Finance" />
              <FormField label="Timeline" value={np.timeline} onChange={v => setNp(p => ({ ...p, timeline: v }))} placeholder="e.g. 2024" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">Category</label>
                <select value={np.category} onChange={e => setNp(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus">
                  <option value="BI">BI</option>
                  <option value="Data Engineering">Data Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">Status</label>
                <select value={np.status} onChange={e => setNp(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <FormField label="Business Problem" value={np.problem} onChange={v => setNp(p => ({ ...p, problem: v }))} textarea placeholder="Describe the business problem..." />
            <FormField label="Data Architecture" value={np.architecture} onChange={v => setNp(p => ({ ...p, architecture: v }))} textarea />
            <FormField label="Tools (comma-separated)" value={np.tools} onChange={v => setNp(p => ({ ...p, tools: v }))} placeholder="Power BI, SQL, Azure" />
            <FormField label="Data Modeling" value={np.modeling} onChange={v => setNp(p => ({ ...p, modeling: v }))} textarea />
            <FormField label="Pipeline / ETL" value={np.pipeline} onChange={v => setNp(p => ({ ...p, pipeline: v }))} textarea />
            <FormField label="Dashboards" value={np.dashboards} onChange={v => setNp(p => ({ ...p, dashboards: v }))} textarea />
            <FormField label="Key Insights" value={np.insights} onChange={v => setNp(p => ({ ...p, insights: v }))} textarea />
            <FormField label="Tags (comma-separated)" value={np.tags} onChange={v => setNp(p => ({ ...p, tags: v }))} placeholder="Power BI, Fabric" />
            <div className="flex gap-3 pt-2">
              <button onClick={addProject} disabled={!np.title}
                className="px-6 py-3 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl disabled:opacity-50 hover:shadow-lg transition-all">
                Add Project
              </button>
              <button onClick={() => setModal(null)} className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-bg-card-hover transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'blog' && (
        <Modal title="New Blog Post" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FormField label="Title *" value={nb.title} onChange={v => setNb(p => ({ ...p, title: v }))} />
            <FormField label="Category" value={nb.category} onChange={v => setNb(p => ({ ...p, category: v }))} placeholder="e.g. Data Engineering, AI" />
            <FormField label="Excerpt" value={nb.excerpt} onChange={v => setNb(p => ({ ...p, excerpt: v }))} textarea rows={4} />
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Status</label>
              <select value={nb.status} onChange={e => setNb(p => ({ ...p, status: e.target.value }))}
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm input-focus">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={addBlog} disabled={!nb.title}
                className="px-6 py-3 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl disabled:opacity-50 hover:shadow-lg transition-all">
                Add Post
              </button>
              <button onClick={() => setModal(null)} className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-bg-card-hover transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'activity' && (
        <Modal title="Log Activity" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FormField label="What did you work on? *" value={na.title} onChange={v => setNa(p => ({ ...p, title: v }))} />
            <FormField label="Description" value={na.description} onChange={v => setNa(p => ({ ...p, description: v }))} textarea rows={3} />
            <FormField label="Tags (comma-separated)" value={na.tags} onChange={v => setNa(p => ({ ...p, tags: v }))} placeholder="AI, MCP, Power BI" />
            <div className="flex gap-3 pt-2">
              <button onClick={addActivity} disabled={!na.title}
                className="px-6 py-3 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl disabled:opacity-50 hover:shadow-lg transition-all">
                Log It
              </button>
              <button onClick={() => setModal(null)} className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-bg-card-hover transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
