'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="page"><h1>Não foi possível carregar esta página</h1><p>Os dados estão temporariamente indisponíveis. Nenhuma ausência de registro é inferida desta falha.</p><button className="btn" onClick={reset}>Tentar novamente</button></main>;}
