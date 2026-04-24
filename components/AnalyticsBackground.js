'use client';
import { motion } from 'framer-motion';

export default function AnalyticsBackground() {
  // Array to generate background bars
  const bars = Array.from({ length: 15 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.08]">
      
      {/* --- Animated Line Chart (SVG) --- */}
      <svg 
        className="absolute bottom-0 w-full h-1/2" 
        preserveAspectRatio="none" 
        viewBox="0 0 1000 200"
      >
        <motion.path
          d="M 0 150 Q 50 50 150 120 T 300 80 T 450 160 T 600 60 T 750 140 T 900 40 T 1000 100"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path
          d="M 0 100 Q 80 180 200 90 T 400 120 T 550 40 T 700 150 T 850 80 T 1000 160"
          fill="none"
          stroke="var(--accent-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />
      </svg>

      {/* --- Animated Bar Chart --- */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-end justify-between px-10 gap-4">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            className="w-16 bg-gradient-to-t from-accent-dim/40 to-transparent rounded-t-sm"
            initial={{ height: '10%' }}
            animate={{
              height: ['10%', `${Math.random() * 80 + 20}%`, '10%'],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* --- Floating Data Nodes (Scatter Plot Vibe) --- */}
      <div className="absolute top-1/4 right-1/4 w-full h-full">
        {[1, 2, 3, 4, 5].map((node) => (
          <motion.div
            key={`node-${node}`}
            className="absolute w-2 h-2 rounded-full bg-accent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -50, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

    </div>
  );
}
