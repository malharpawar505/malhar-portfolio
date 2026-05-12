'use client';
import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-mono font-bold text-xl mb-3">
              <span className="text-accent">malhar</span><span className="text-text-muted">.</span><span className="text-text-primary">dev</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md mb-6">
              Data Engineer & Analytics Architect building intelligent data systems, AI-powered BI platforms, and scalable analytics solutions.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://github.com/malharpawar505', icon: Github, label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/malharpawar505/', icon: Linkedin, label: 'LinkedIn' },
                { href: 'mailto:pawarmalhar505@gmail.com', icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  className="w-10 h-10 rounded-xl border border-border bg-bg-card flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-text-muted uppercase tracking-widest mb-5">Navigation</h4>
            <div className="flex flex-col gap-3">
              {['Projects', 'AI Lab', 'Blog', 'Contact'].map(item => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-1.5 group">
                  {item}
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-text-muted uppercase tracking-widest mb-5">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/malharpawar505" target="_blank" rel="noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Github size={14} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/malharpawar505/" target="_blank" rel="noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn
              </a>
              <a href="mailto:pawarmalhar505@gmail.com"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Mail size={14} /> Email
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider" />
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Malhar Pawar. Built with precision and purpose.
          </p>
          <p className="text-xs text-text-muted/50">
            Pune, India
          </p>
        </div>
      </div>
    </footer>
  );
}
