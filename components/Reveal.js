'use client';
import { useEffect, useRef, useState } from 'react';

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export function Reveal({ children, className = '', type = 'up', delay = 0 }) {
  const [ref, visible] = useReveal();
  const typeClass = type === 'left' ? 'reveal-left' : type === 'right' ? 'reveal-right' : type === 'scale' ? 'reveal-scale' : 'reveal';
  const stagger = delay > 0 ? `stagger-${Math.min(delay, 8)}` : '';

  return (
    <div ref={ref} className={`${typeClass} ${stagger} ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.5);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const dur = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}
