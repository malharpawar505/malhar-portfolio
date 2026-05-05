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
  const [ref, visible] = useReveal(0.1);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;
    let startTs = 0;
    const dur = 1800;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [visible, target]);

  return <div ref={ref} style={{ display: 'inline' }}>{count}{suffix}</div>;
}
