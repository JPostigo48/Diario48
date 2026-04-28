'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  phaseSpeed: number;
  isHub: boolean;
}

const NODE_COUNT = 42;
const MAX_DIST   = 230;
const WRAP       = 120;

function createNodes(w: number, h: number): Node[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const isHub = i < 10;
    const speed = isHub
      ? 0.28 + Math.random() * 0.22
      : 0.55 + Math.random() * 0.55;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: isHub ? 10 + Math.random() * 5 : 6 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.006 + Math.random() * 0.01,
      isHub,
    };
  });
}

export default function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<Node[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const acc = getComputedStyle(document.documentElement)
      .getPropertyValue('--acc').trim() || '#4f8ef7';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      canvas.width  = rect.width;
      canvas.height = rect.height;
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(canvas.width, canvas.height);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;

      // Mover nodos — wrap toroidal: salen por un lado, entran por el otro
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += n.phaseSpeed;
        if (n.x < -WRAP)    n.x = w + WRAP;
        if (n.x > w + WRAP) n.x = -WRAP;
        if (n.y < -WRAP)    n.y = h + WRAP;
        if (n.y > h + WRAP) n.y = -WRAP;
      }

      // Aristas — ancho variable: nodos cercanos = línea más gruesa
      ctx.strokeStyle = acc;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const proximity = 1 - dist / MAX_DIST;
            ctx.globalAlpha = proximity * 0.60;
            ctx.lineWidth   = 1 + proximity; // 1px (lejos) → 2px (cerca)
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodos
      ctx.fillStyle = acc;
      for (const n of nodes) {
        const pulse = 0.75 + 0.15 * Math.sin(n.phase); // rango 0.60 – 0.90
        const alpha = n.isHub ? Math.min(pulse + 0.05, 0.90) : pulse;

        // Halo exterior (solo hubs)
        if (n.isHub) {
          ctx.globalAlpha = alpha * 0.13;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Disco principal
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
