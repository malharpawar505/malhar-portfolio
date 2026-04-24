'use client';
import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-mono font-bold text-xl text-accent mb-3">MP<span className="text-text-muted font-normal">/portfolio</span></div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              Data Engineer & Analytics Architect building intelligent data systems, AI-powered BI platforms, and scalable analytics solutions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-text-muted uppercase tracking-widest mb-4">Navigation</h4>
            <div className="flex flex-col gap-2.5">
              {['Projects', 'AI Lab', 'Blog', 'Contact'].map(item => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-1 group">
                  {item}
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-text-muted uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex flex-col gap-2.5">
              <a href="https://github.com/malharpawar505" target="_blank" rel="noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Github size={15} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/malharpawar505/" target="_blank" rel="noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Linkedin size={15} /> LinkedIn
              </a>
              <a href="mailto:pawarmalhar505@gmail.com"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
                <Mail size={15} /> Email
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Malhar Pawar. Built with precision and purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
