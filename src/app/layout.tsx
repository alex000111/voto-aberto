import Link from 'next/link';
import './globals.css';import Header from '../components/Header';
export const metadata={title:'Voto Aberto — Informação verificável',description:'Observatório público de dados eleitorais com fontes rastreáveis.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><div id="conteudo">{children}</div><footer><nav><Link href="/metodologia">Metodologia</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/monitor">Monitor</Link> · <Link href="/correcoes">Correções</Link></nav><span>Voto Aberto • Observatório Eleitoral 2026</span><span>Informação verificável. Decisão é sua.</span></footer></body></html>}
