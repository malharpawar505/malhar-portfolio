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

function ParticleField({ count = 3500 }) {
  const points = useRef();
  const { mouse, viewport } = useThree();
  const accentColor = useCSSVariable('--accent');

  const [particles, originalPositions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 25;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originals[i * 3] = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;

      vels[i * 3] = (Math.random() - 0.5) * 0.01;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [positions, originals, vels];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Add velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Magnetic repel/attract logic
      if (dist < 5) {
        const force = (5 - dist) / 5;
        positions[i3] -= dx * force * 0.05;
        positions[i3 + 1] -= dy * force * 0.05;
      }

      // Keep within bounds and return to flow
      const homeX = originalPositions[i3];
      const homeY = originalPositions[i3 + 1];
      positions[i3] += (homeX - positions[i3]) * 0.01;
      positions[i3 + 1] += (homeY - positions[i3 + 1]) * 0.01;
      
      // Floating wave
      positions[i3 + 2] += Math.sin(time * 0.5 + homeX) * 0.005;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y += 0.001;
  });

  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={accentColor}
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

function TechElements() {
  const accentColor = useCSSVariable('--accent');
  const goldColor = useCSSVariable('--accent-gold');

  return (
    <group>
      {/* Central Orbital Rings - More Complex */}
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
        <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <mesh>
            <ringGeometry args={[4, 4.02, 128]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.5, 4.51, 128]} />
            <meshBasicMaterial color={goldColor} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[5, 5.01, 128]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>

      {/* Advanced Floating Objects with Wobble/Distort */}
      <Float speed={2} rotationIntensity={3} floatIntensity={3}>
        <mesh position={[-7, 5, -8]}>
          <octahedronGeometry args={[1.5, 2]} />
          <MeshWobbleMaterial color={accentColor} factor={1} speed={2} wireframe transparent opacity={0.12} />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={2} floatIntensity={5}>
        <mesh position={[8, -6, -10]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial color={goldColor} speed={3} distort={0.4} wireframe transparent opacity={0.1} />
        </mesh>
      </Float>

      {/* Nebula Core */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function CinematicFog() {
  const bgColor = useCSSVariable('--bg-primary');
  return <fog attach="fog" args={[bgColor, 8, 30]} />;
}

export default function AntigravityBackground() {
  const bgColor = useCSSVariable('--bg-primary');

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ backgroundColor: bgColor }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5db0ff" />
        
        <ParticleField count={3000} />
        <TechElements />
        
        <Stars 
          radius={120} 
          depth={60} 
          count={6000} 
          factor={6} 
          saturation={0} 
          fade 
          speed={2.5} 
        />
        
        <CinematicFog />
      </Canvas>

      {/* Premium Overlay Layers */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} 
      />
      
      {/* Advanced Lighting Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background: `radial-gradient(circle at 10% 20%, rgba(80, 200, 120, 0.12) 0%, transparent 40%),
                       radial-gradient(circle at 90% 80%, rgba(226, 192, 109, 0.08) 0%, transparent 40%),
                       radial-gradient(circle at 50% 50%, rgba(8, 10, 9, 0) 0%, rgba(8, 10, 9, 0.4) 100%)`
        }}
      />
    </div>
  );
}
