'use client';

import { useEffect, useRef, useState } from 'react';

const COLORS = ['#10b981', '#34d399', '#fbbf24', '#38bdf8', '#60a5fa'];
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Detecta o tema atual e acompanha mudanças
  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    let cols: number[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Array(Math.floor(canvas.width / fontSize)).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(4, 8, 16, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      cols.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : COLORS[Math.floor(Math.random() * COLORS.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) cols[i] = 0;
        cols[i]++;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      // Limpa o canvas ao sair do modo escuro
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isDark]);

  // No modo claro, não renderiza nada
  if (!isDark) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  );
}


