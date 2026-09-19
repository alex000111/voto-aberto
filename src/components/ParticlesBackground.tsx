'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    console.log('Iniciando partículas...');
    initParticlesEngine(async (engine) => {
      console.log('Engine injetada, carregando slim...');
      // carrega apenas os recursos essenciais do tsparticles para performance
      await loadSlim(engine);
    }).then(() => {
      console.log('Slim carregado com sucesso! Alterando init para true.');
      setInit(true);
    }).catch((err) => {
      console.error('Erro ao carregar partículas:', err);
    });
  }, []);

  if (!init) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }}>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: '#ff0000' },
            move: { 
              direction: 'none', 
              enable: true, 
              outModes: { default: 'bounce' }, 
              speed: 5, 
              straight: false 
            },
            number: { value: 50 },
            opacity: { 
              value: 1
            },
            shape: { type: 'circle' },
            size: { 
              value: 15
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
