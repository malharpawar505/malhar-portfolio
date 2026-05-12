'use client';
import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { Send, Github, Linkedin, Mail, MapPin, CheckCircle2, Zap } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  return (
    <div className="page-enter pt-28 pb-24 min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[130px] pointer-events-none orb-drift" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-accent-gold/4 rounded-full blur-[110px] pointer-events-none orb-drift-2" />
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent" /> Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Let's Connect</h1>
          <p className="text-text-secondary max-w-lg mb-14 leading-relaxed">
            Have a project in mind, hiring for a data role, or want to discuss data engineering and AI? Reach out — I respond within 24 hours.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={2}>
              {sent ? (
                <div className="gradient-card p-12 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center text-accent mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-accent mb-3">Message Sent!</h3>
                  <p className="text-text-secondary leading-relaxed">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest">Name</label>
                      <input
                        className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus text-text-primary placeholder:text-text-muted/50 transition-all duration-200"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus text-text-primary placeholder:text-text-muted/50 transition-all duration-200"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest">Message</label>
                    <textarea
                      className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus text-text-primary placeholder:text-text-muted/50 min-h-[180px] resize-y transition-all duration-200"
                      placeholder="Tell me about your project or opportunity..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>

                  {/* Character indicator */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-text-muted">Fields marked are required</p>
                    <span className="text-xs font-mono text-text-muted">{form.message.length} chars</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || sending}
                    className="btn-ripple shine w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-gradient-to-r from-accent to-emerald-400 text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <Send size={15} /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              )}
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <Reveal delay={3}>
              <div className="gradient-card p-7 rounded-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-accent/5 rounded-full blur-2xl" />
                <h3 className="text-base font-bold mb-5 relative z-10">Other Ways to Connect</h3>
                <div className="space-y-3 relative z-10">
                  {[
                    { icon: Linkedin, label: 'linkedin.com/in/malharpawar505', href: 'https://www.linkedin.com/in/malharpawar505/', color: '#0a66c2' },
                    { icon: Github, label: 'github.com/malharpawar505', href: 'https://github.com/malharpawar505', color: '#8b949e' },
                    { icon: Mail, label: 'pawarmalhar505@gmail.com', href: 'mailto:pawarmalhar505@gmail.com', color: '#10b981' },
                    { icon: MapPin, label: 'Pune, Maharashtra, India', href: null, color: '#f59e0b' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const inner = (
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary/50 transition-colors duration-200 group/link">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18` }}>
                          <Icon size={14} style={{ color: item.color }} />
                        </div>
                        <span className="text-sm text-text-secondary group-hover/link:text-text-primary transition-colors duration-200 truncate">{item.label}</span>
                      </div>
                    );
                    return item.href ? (
                      <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>
                    ) : <div key={i}>{inner}</div>;
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="p-7 rounded-2xl border border-accent/20 bg-accent/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                    <Zap size={14} />
                  </div>
                  <h4 className="text-sm font-bold text-accent">Currently Available For</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-text-secondary relative z-10">
                  {[
                    'Full-time Data Engineering roles',
                    'Analytics Engineering positions',
                    'BI & AI consulting projects',
                    'Technical collaboration & mentoring',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={5}>
              <div className="p-5 rounded-2xl border border-border bg-bg-card text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent badge-pulse" />
                  <span className="text-xs font-mono text-accent font-semibold">Online · Responds quickly</span>
                </div>
                <p className="text-xs text-text-muted">Typical response time: &lt; 24 hours</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
