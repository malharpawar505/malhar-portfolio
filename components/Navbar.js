'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/ai-lab', label: 'AI Lab' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const winH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(winH > 0 ? (window.scrollY / winH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Scroll Progress */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-mono font-bold text-lg tracking-tight group">
            <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110 group-hover:border-accent/40">
              M
            </span>
            <span className="text-text-primary">
              malhar<span className="text-accent">.</span>dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 relative ${
                  pathname === item.href
                    ? 'text-accent bg-accent/8'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-text-primary p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-bg-primary/98 backdrop-blur-2xl" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-mono font-bold text-lg text-accent">malhar<span className="text-text-muted">.</span>dev</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-text-primary p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full text-center text-xl font-semibold py-4 rounded-xl transition-all duration-300 opacity-0 animate-fade-up ${
                    pathname === item.href
                      ? 'text-accent bg-accent/8'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                  }`}
                  style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
