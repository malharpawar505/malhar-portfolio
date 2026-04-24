import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const logos = [
  { name: 'Azure', src: 'https://cdn.simpleicons.org/microsoftazure/0078D4', top: '15%', left: '10%', delay: 0 },
  { name: 'Databricks', src: 'https://cdn.simpleicons.org/databricks/FF3621', top: '25%', left: '80%', delay: 1.5 },
  { name: 'Power BI', src: 'https://cdn.simpleicons.org/powerbi/F2C811', top: '65%', left: '15%', delay: 3 },
  { name: 'Python', src: 'https://cdn.simpleicons.org/python/3776AB', top: '75%', left: '75%', delay: 2 },
  { name: 'SQL', src: 'https://cdn.simpleicons.org/postgresql/4169E1', top: '45%', left: '90%', delay: 0.5 },
  { name: 'Fabric', src: 'https://cdn.simpleicons.org/microsoft/0078D4', top: '50%', left: '5%', delay: 2.5 },
];

function InteractiveLogo({ logo, index, mouseX, mouseY }) {
  // Use springs for smooth repel movement
  const xOffset = useSpring(0, { stiffness: 100, damping: 30 });
  const yOffset = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const updateRepel = () => {
      // Find the center of the logo element
      const el = document.getElementById(`logo-${index}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from mouse
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Repel threshold (pixels)
      const maxDistance = 250;
      
      if (distance < maxDistance && distance > 0) {
        // Calculate repel force (stronger when closer)
        const force = (maxDistance - distance) / maxDistance;
        const repelX = -(dx / distance) * force * 50; // max 50px repel
        const repelY = -(dy / distance) * force * 50;
        
        xOffset.set(repelX);
        yOffset.set(repelY);
      } else {
        // Return to original position
        xOffset.set(0);
        yOffset.set(0);
      }
    };

    const intervalId = setInterval(updateRepel, 50); // check distance 20 times a sec
    return () => clearInterval(intervalId);
  }, [mouseX, mouseY, index, xOffset, yOffset]);

  return (
    <motion.div
      id={`logo-${index}`}
      className="absolute w-12 h-12 md:w-16 md:h-16"
      style={{ top: logo.top, left: logo.left, x: xOffset, y: yOffset }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, 5, -5, 0] }}
      transition={{
        duration: 8 + (index % 3) * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: logo.delay
      }}
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: logo.delay
        }}
        className="w-full h-full"
      >
        <img 
          src={logo.src} 
          alt={logo.name} 
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all" 
        />
      </motion.div>
    </motion.div>
  );
}

export default function FloatingLogos() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
      {logos.map((logo, index) => (
        <InteractiveLogo key={index} logo={logo} index={index} mouseX={mousePos.x} mouseY={mousePos.y} />
      ))}
    </div>
  );
}
