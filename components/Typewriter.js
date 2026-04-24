'use client';
import { useState, useEffect } from 'react';
import { useReveal } from './Reveal';

export default function Typewriter({ codeString, delay = 0, speed = 30 }) {
  const [ref, visible] = useReveal(0.1);
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (visible && !hasStarted) {
      setTimeout(() => setHasStarted(true), delay * 1000);
    }
  }, [visible, delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(codeString.substring(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex >= codeString.length) {
        clearInterval(intervalId);
      }
    }, speed);
    
    return () => clearInterval(intervalId);
  }, [hasStarted, codeString, speed]);

  // Syntax highlighting for JSON
  const highlightCode = (text) => {
    if (!text) return <span className="inline-block w-2 h-4 bg-accent/80 animate-pulse ml-1" />;
    
    // Very basic regex-based JSON highlighting just for this block
    const highlighted = text
      .replace(/("[^"]*")(\s*:)/g, '<span class="text-accent">$1</span>$2')
      .replace(/:\s*("[^"]*")/g, ': <span class="text-accent-gold">$1</span>')
      .replace(/[{}]/g, '<span class="text-text-muted">$&</span>');

    return (
      <span 
        dangerouslySetInnerHTML={{ __html: highlighted }} 
        className="relative"
      ></span>
    );
  };

  return (
    <pre ref={ref} className="font-mono text-[13px] leading-[1.9] whitespace-pre-wrap">
      {highlightCode(displayedText)}
      {hasStarted && displayedText.length < codeString.length && (
        <span className="inline-block w-2 h-3.5 bg-accent/80 animate-pulse ml-1 align-middle" />
      )}
    </pre>
  );
}
