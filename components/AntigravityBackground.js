'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom hook to get CSS variables
function useCSSVariable(variableName) {
  const [value, setValue] = useState('#50c878'); // Default accent color

  useEffect(() => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (val) setValue(val);
  }, [variableName]);

  return value;
}

function ParticleField({ count = 3000 }) {
  const points = useRef();
  const { mouse, viewport } = useThree();
  const accentColor = useCSSVariable('--accent');

  // Create particle positions and original positions for magnetic effect
  const [particles, originalPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originals[i * 3] = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;
    }
    return [positions, originals];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array;

    // Subtle drift
    points.current.rotation.y = time * 0.05;
    points.current.rotation.x = time * 0.02;

    // Magnetic interaction
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const px = originalPositions[i3];
      const py = originalPositions[i3 + 1];
      const pz = originalPositions[i3 + 2];

      // Calculate distance to mouse (projected to 3D roughly)
      const dx = mouseX - px;
      const dy = mouseY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 4) {
        const force = (4 - dist) / 4;
        positions[i3] += (dx * force * 0.1 - (positions[i3] - px)) * 0.1;
        positions[i3 + 1] += (dy * force * 0.1 - (positions[i3 + 1] - py)) * 0.1;
      } else {
        // Return to original
        positions[i3] += (px - positions[i3]) * 0.05;
        positions[i3 + 1] += (py - positions[i3 + 1]) * 0.05;
      }
      
      // Vertical float wave
      positions[i3 + 1] += Math.sin(time + px) * 0.002;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={accentColor}
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function TechElements() {
  const accentColor = useCSSVariable('--accent');
  const goldColor = useCSSVariable('--accent-gold');

  return (
    <group>
      {/* Central Orbital Rings */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <ringGeometry args={[4.5, 4.52, 128]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.5, 5.51, 128]} />
            <meshBasicMaterial color={goldColor} transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>

      {/* Floating Geometric Objects */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-5, 3, -10]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={accentColor} wireframe transparent opacity={0.1} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={3}>
        <mesh position={[6, -4, -12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={goldColor} wireframe transparent opacity={0.08} />
        </mesh>
      </Float>

      {/* Distorted Glow Sphere */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, -15]}>
          <sphereGeometry args={[8, 64, 64]} />
          <MeshDistortMaterial
            color={accentColor}
            speed={1}
            distort={0.3}
            radius={1}
            transparent
            opacity={0.03}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CinematicFog() {
  const bgColor = useCSSVariable('--bg-primary');
  return <fog attach="fog" args={[bgColor, 5, 25]} />;
}

export default function AntigravityBackground() {
  const bgColor = useCSSVariable('--bg-primary');

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ backgroundColor: bgColor }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#5db0ff" />
        
        <ParticleField count={2500} />
        <TechElements />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={3000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.5} 
        />
        
        <CinematicFog />
      </Canvas>

      {/* Overlay noise/vignette for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} 
      />
      
      {/* Subtle radial glow to maintain branding vibe */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(80, 200, 120, 0.08) 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, rgba(226, 192, 109, 0.06) 0%, transparent 50%)`
        }}
      />
    </div>
  );
}
