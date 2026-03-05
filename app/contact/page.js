'use client';
import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { Send, Github, Linkedin, Mail, MapPin, CheckCircle2 } from 'lucide-react';

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
    <div className="page-enter pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-accent" /> Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Let's Connect</h1>
          <p className="text-text-secondary max-w-lg mb-14 leading-relaxed">
            Have a project in mind, hiring for a data role, or want to discuss data engineering and AI? Reach out.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={2}>
              {sent ? (
                <div className="p-10 bg-accent-dim border border-accent/30 rounded-2xl text-center">
                  <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-accent mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">Thank you for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Name</label>
                      <input
                        className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Message</label>
                    <textarea
                      className="w-full px-4 py-3.5 bg-bg-card border border-border rounded-xl text-sm input-focus min-h-[160px] resize-y"
                      placeholder="Tell me about your project or opportunity..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || sending}
                    className="btn-ripple inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-accent to-emerald-600 text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(80,200,120,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              )}
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <Reveal delay={3}>
              <div className="p-7 bg-bg-card border border-border rounded-2xl">
                <h3 className="text-lg font-bold mb-5">Other Ways to Connect</h3>
                <div className="space-y-4">
                  {[
                    { icon: Linkedin, label: 'linkedin.com/in/malharpawar505', href: 'https://www.linkedin.com/in/malharpawar505/' },
                    { icon: Github, label: 'github.com/malharpawar505', href: 'https://github.com/malharpawar505' },
                    { icon: Mail, label: 'malharpawar505@gmail.com', href: 'mailto:malharpawar505@gmail.com' },
                    { icon: MapPin, label: 'Pune, Maharashtra, India', href: null },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const content = (
                      <span className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors">
                        <Icon size={16} className="flex-shrink-0 text-text-muted" /> {item.label}
                      </span>
                    );
                    return item.href ? (
                      <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a>
                    ) : <div key={i}>{content}</div>;
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="p-7 bg-accent-dim border border-accent/20 rounded-2xl">
                <h4 className="text-sm font-bold text-accent mb-3">Currently Available For</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2"><span className="text-accent">→</span> Full-time Data Engineering roles</li>
                  <li className="flex items-center gap-2"><span className="text-accent">→</span> Analytics Engineering positions</li>
                  <li className="flex items-center gap-2"><span className="text-accent">→</span> BI & AI consulting projects</li>
                  <li className="flex items-center gap-2"><span className="text-accent">→</span> Freelance Power BI development</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
