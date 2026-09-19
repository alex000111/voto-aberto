'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#10b981', '#34d399', '#fbbf24', '#38bdf8', '#60a5fa'];
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
      const numCols = Math.floor(canvas.width / fontSize);
      cols = Array(numCols).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      // Fundo semi-transparente para o efeito de rastro
      ctx.fillStyle = 'rgba(7, 13, 24, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      cols.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;

        // Topo da coluna fica mais brilhante
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        ctx.fillText(char, x, y * fontSize);

        // Reinicia a coluna aleatoriamente após sair da tela
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          cols[i] = 0;
        }
        cols[i]++;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
        opacity: 0.35,
      }}
    />
  );
}

