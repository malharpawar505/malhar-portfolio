'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NetworkParticles({ count = 2000 }) {
  const points = useRef();
  const lines = useRef();
  const { mouse, viewport } = useThree();

  const [particles, originalPositions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 14;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originals[i * 3] = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;
      vels[i * 3] = (Math.random() - 0.5) * 0.008;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [positions, originals, vels];
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * 6 * 3), [count]);
  const lineColors = useMemo(() => new Float32Array(count * 6 * 6), [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array;
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      const dx = mouseX - positions[i3];
      const dy = mouseY - positions[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 6) {
        const force = (6 - dist) / 6;
        positions[i3] -= dx * force * 0.04;
        positions[i3 + 1] -= dy * force * 0.04;
      }

      const homeX = originalPositions[i3];
      const homeY = originalPositions[i3 + 1];
      const homeZ = originalPositions[i3 + 2];
      positions[i3] += (homeX - positions[i3]) * 0.008;
      positions[i3 + 1] += (homeY - positions[i3 + 1]) * 0.008;
      positions[i3 + 2] += (homeZ - positions[i3 + 2]) * 0.008;

      positions[i3 + 1] += Math.sin(time * 0.3 + homeX * 0.5) * 0.008;
      positions[i3] += Math.cos(time * 0.2 + homeY * 0.3) * 0.005;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y += 0.0004;
    points.current.rotation.x = Math.sin(time * 0.1) * 0.05;

    // Connection lines between nearby particles
    let lineIdx = 0;
    const maxConnections = count * 3;
    const connectionDist = 2.8;

    for (let i = 0; i < Math.min(count, 400) && lineIdx < maxConnections; i++) {
      const i3 = i * 3;
      for (let j = i + 1; j < Math.min(count, 400) && lineIdx < maxConnections; j++) {
        const j3 = j * 3;
        const ddx = positions[i3] - positions[j3];
        const ddy = positions[i3 + 1] - positions[j3 + 1];
        const ddz = positions[i3 + 2] - positions[j3 + 2];
        const d = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);

        if (d < connectionDist) {
          const alpha = (1 - d / connectionDist) * 0.15;
          const li = lineIdx * 6;
          linePositions[li] = positions[i3];
          linePositions[li + 1] = positions[i3 + 1];
          linePositions[li + 2] = positions[i3 + 2];
          linePositions[li + 3] = positions[j3];
          linePositions[li + 4] = positions[j3 + 1];
          linePositions[li + 5] = positions[j3 + 2];

          const ci = lineIdx * 6;
          lineColors[ci] = 0.06; lineColors[ci + 1] = 0.73; lineColors[ci + 2] = 0.51;
          lineColors[ci + 3] = 0.06; lineColors[ci + 4] = 0.73; lineColors[ci + 5] = 0.51;
          lineIdx++;
        }
      }
    }

    if (lines.current) {
      lines.current.geometry.setDrawRange(0, lineIdx * 2);
      lines.current.geometry.attributes.position.needsUpdate = true;
      lines.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group>
      <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#10b981"
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>

      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineColors.length / 3}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function AuroraOrbs() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.08) * 0.15;
  });

  return (
    <group ref={group}>
      {/* Primary aurora orb */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2}>
        <mesh position={[-4, 3, -15]}>
          <sphereGeometry args={[3, 32, 32]} />
          <MeshDistortMaterial
            color="#10b981"
            speed={2}
            distort={0.5}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* Secondary orb */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={3}>
        <mesh position={[5, -4, -12]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <MeshDistortMaterial
            color="#3b82f6"
            speed={3}
            distort={0.6}
            transparent
            opacity={0.03}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* Tertiary orb */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[0, 0, -20]}>
          <sphereGeometry args={[5, 32, 32]} />
          <MeshDistortMaterial
            color="#f59e0b"
            speed={1.5}
            distort={0.3}
            transparent
            opacity={0.02}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* Orbital ring - subtle */}
      <Float speed={1} rotationIntensity={2} floatIntensity={1}>
        <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <mesh>
            <torusGeometry args={[6, 0.015, 16, 128]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.2}>
        <group rotation={[Math.PI / 3, -Math.PI / 4, Math.PI / 6]}>
          <mesh>
            <torusGeometry args={[7, 0.01, 16, 128]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function StarField() {
  const starsRef = useRef();
  const starCount = 4000;

  const starPositions = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = -20 - Math.random() * 80;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y += 0.0001;
    starsRef.current.rotation.x += 0.00005;
  });

  return (
    <Points ref={starsRef} positions={starPositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e2e8f0"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

export default function AntigravityBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ background: '#07070d' }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#3b82f6" />

        <NetworkParticles count={2500} />
        <AuroraOrbs />
        <StarField />

        <fog attach="fog" args={['#07070d', 10, 35]} />
      </Canvas>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, transparent 0%, rgba(7, 7, 13, 0.4) 100%)
          `
        }}
      />
    </div>
  );
}
