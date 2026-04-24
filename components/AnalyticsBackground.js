'use client';
import { motion } from 'framer-motion';

export default function AnalyticsBackground() {
  // Generate random particles
  const particles = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* --- Glowing Floating Orbs (Antigravity Vibe) --- */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full mix-blend-screen filter blur-[100px] opacity-40 bg-gradient-to-r from-emerald-500 to-teal-400"
        animate={{ 
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/4 w-[25vw] h-[25vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 bg-gradient-to-r from-purple-600 to-blue-500"
        animate={{ 
          x: [0, -150, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.3, 0.9, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/3 w-[35vw] h-[35vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 bg-gradient-to-r from-pink-500 to-orange-400"
        animate={{ 
          x: [0, 100, -100, 0],
          y: [0, 50, -150, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* --- Sleek Gradient Data Lines --- */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 1000">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M -100 800 Q 200 400 500 700 T 1100 500"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        />
        
        <motion.path
          d="M -100 400 Q 300 800 600 300 T 1100 600"
          fill="none"
          stroke="url(#lineGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, repeatType: "loop", delay: 2 }}
        />
      </svg>

      {/* --- Floating Antigravity Particles --- */}
      <div className="absolute inset-0">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.5 + 0.1,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.8)`
            }}
            animate={{
              y: [0, Math.random() * -200 - 100],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

    </div>
  );
}
