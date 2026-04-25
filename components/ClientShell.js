'use client';
import dynamic from 'next/dynamic';
import MouseTrailer from './MouseTrailer';

const AntigravityBackground = dynamic(() => import('./AntigravityBackground'), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <MouseTrailer />
      <AntigravityBackground />
    </>
  );
}
