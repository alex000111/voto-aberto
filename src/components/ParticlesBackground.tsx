'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // carrega apenas os recursos essenciais do tsparticles para performance
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: ['#00875a', '#fbbf24', '#1d4ed8'] },
            move: { 
              direction: 'bottom', 
              enable: true, 
              outModes: { default: 'out' }, 
              speed: 1.5, 
              straight: true 
            },
            number: { density: { enable: true, width: 1920, height: 1080 }, value: 120 },
            opacity: { 
              value: 0.5
            },
            shape: { type: 'circle' },
            size: { 
              value: 2
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
