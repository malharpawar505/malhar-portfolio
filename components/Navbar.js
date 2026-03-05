'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell } from 'lucide-react';

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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight group">
            <span className="text-accent transition-transform duration-300 group-hover:scale-110">MP</span>
            <span className="text-text-muted font-normal text-sm hidden sm:inline">/portfolio</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                  pathname === item.href
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/admin"
              className="ml-2 px-5 py-2 bg-accent-dim border border-accent/30 rounded-lg text-accent text-sm font-semibold hover:bg-accent/20 hover:border-accent/50 transition-all duration-200"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-text-primary p-2 -mr-2"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] animate-fade-in">
          <div className="absolute inset-0 bg-bg-primary/97 backdrop-blur-2xl" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 text-text-primary p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-2xl font-semibold transition-all duration-300 opacity-0 animate-fade-up`}
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
              >
                <span className={pathname === item.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}>
                  {item.label}
                </span>
              </Link>
            ))}
            <Link
              href="/admin"
              className="mt-4 px-8 py-3 bg-accent-dim border border-accent/30 rounded-lg text-accent font-semibold opacity-0 animate-fade-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
