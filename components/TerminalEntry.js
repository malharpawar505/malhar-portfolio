'use client';
import { useState, useEffect } from 'react';
import { useReveal } from './Reveal';

export default function TerminalEntry({ activity, index, isLast }) {
  const [ref, visible] = useReveal(0.05); // Trigger almost immediately
  const [typedTitle, setTypedTitle] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setTypedTitle(activity.title.substring(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex >= activity.title.length) {
        clearInterval(intervalId);
        setTimeout(() => setShowContent(true), 50); // Faster content reveal
      }
    }, 15); // Increased typing speed

    return () => clearInterval(intervalId);
  }, [visible, activity.title]);

  const dateStr = new Date(activity.date).toISOString().split('T')[0];

  return (
    <div ref={ref} className="flex gap-4 group">
      <div className="flex flex-col items-center mt-1">
        <div className={`w-3 h-3 rounded-full ${visible ? 'bg-accent' : 'bg-border'} transition-colors duration-500 relative z-10`}>
          {visible && <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />}
        </div>
        {!isLast && <div className="w-px h-full bg-border mt-2" />}
      </div>
      
      <div className="pb-6 flex-1">
        <p className="font-mono text-xs text-text-muted mb-2">
          <span className="text-accent-blue/80">root@malhar</span>:<span className="text-accent-gold/80">~</span>$ log --date={dateStr}
        </p>
        
        <h4 className="font-bold mb-1.5 font-mono text-text-primary text-[15px]">
          {typedTitle}
          {visible && !showContent && <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />}
        </h4>
        
        <div className={`transition-all duration-700 overflow-hidden ${showContent ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}>
          <p className="text-sm text-text-secondary leading-relaxed mb-3 border-l-2 border-border/50 pl-3 ml-1">
            {activity.description}
          </p>
          <div className="flex gap-2 flex-wrap mt-2 pl-4">
            {activity.tags?.map((t, j) => (
              <span key={j} className="text-[10px] font-mono text-accent-gold/80 px-2 py-0.5 rounded border border-accent-gold/20 bg-accent-gold/5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
