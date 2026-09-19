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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
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
              random: false, 
              speed: 2, 
              straight: true 
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { 
              value: 0.5,
              random: true,
              animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            shape: { type: 'circle' },
            size: { 
              value: { min: 1, max: 3 },
              random: true,
              animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
