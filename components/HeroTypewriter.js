'use client';
import { useState, useEffect } from 'react';

/**
 * HeroTypewriter — types out children text on mount, then shows a blinking cursor.
 * Props:
 *   text      — the full string to type
 *   speed     — ms per character (default 35)
 *   delay     — ms to wait before typing starts (default 400)
 *   className — extra classes for the wrapper span
 */
export default function HeroTypewriter({ text, speed = 35, delay = 400, className = '' }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    let interval;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="hero-cursor"
        style={{ opacity: done ? undefined : 0 }}
        aria-hidden="true"
      >|</span>
    </span>
  );
}
