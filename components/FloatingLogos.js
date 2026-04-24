'use client';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Azure', src: 'https://cdn.simpleicons.org/microsoftazure/6b8a79', top: '15%', left: '10%', delay: 0 },
  { name: 'Databricks', src: 'https://cdn.simpleicons.org/databricks/6b8a79', top: '25%', left: '80%', delay: 1.5 },
  { name: 'Power BI', src: 'https://cdn.simpleicons.org/powerbi/6b8a79', top: '65%', left: '15%', delay: 3 },
  { name: 'Python', src: 'https://cdn.simpleicons.org/python/6b8a79', top: '75%', left: '75%', delay: 2 },
  { name: 'SQL', src: 'https://cdn.simpleicons.org/postgresql/6b8a79', top: '45%', left: '90%', delay: 0.5 },
  { name: 'Spark', src: 'https://cdn.simpleicons.org/apachespark/6b8a79', top: '50%', left: '5%', delay: 2.5 },
];

export default function FloatingLogos() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      {logos.map((logo, index) => (
        <motion.div
          key={index}
          className="absolute w-12 h-12 md:w-16 md:h-16"
          style={{ top: logo.top, left: logo.left }}
          initial={{ y: 0, opacity: 0.5 }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8 + (index % 3) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: logo.delay
          }}
        >
          <img src={logo.src} alt={logo.name} className="w-full h-full object-contain filter grayscale opacity-50" />
        </motion.div>
      ))}
    </div>
  );
}
