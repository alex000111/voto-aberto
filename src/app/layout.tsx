import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import Header from '../components/Header';
import ParticlesBackground from '../components/ParticlesBackground';
export const metadata = {
  title: 'Voto Aberto — Observatório Eleitoral e Dados Oficiais • Brasil 2026',
  description: 'Observatório público de dados eleitorais com fontes rastreáveis do TSE, IBGE e órgãos oficiais. Sem ranking nem recomendação de voto.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ParticlesBackground />
        <a className="skip-link" href="#conteudo">Pular para o conteúdo principal</a>
        <Header />
        <div id="conteudo">
          {children}
        </div>

        {/* Faixa Tricolor Cívica no Rodapé */}
        <div className="civic-ribbon" aria-hidden="true" />

        <footer>
          <div className="footer-content">
            <div className="footer-brand">
              <h4>🇧🇷 Voto Aberto • Observatório Cívico Nacional 2026</h4>
              <p>
                Iniciativa cívica independente e apartidária dedicada à transparência eleitoral e ao controle social.
                Todos os dados são coletados diretamente das bases abertas do Tribunal Superior Eleitoral (TSE)
                e órgãos governamentais sob as diretrizes da Lei de Acesso à Informação (Lei 12.527/2011) e do Art. 37 da Constituição Federal.
                Não ranqueamos candidaturas nem emitimos recomendação de voto.
              </p>
            </div>

            <div className="footer-col">
              <h5>Módulos de Consulta</h5>
              <ul>
                <li><Link href="/candidaturas">Candidaturas e Perfis (20.984)</Link></li>
                <li><Link href="/propostas">Propostas com Resumos</Link></li>
                <li><Link href="/comparador">Comparador de Diretrizes</Link></li>
                <li><Link href="/checagem">🛡️ Radar Anti-Fake News</Link></li>
                <li><Link href="/pesquisas">Pesquisas (PesqEle)</Link></li>
                <li><Link href="/financiamento">Finanças de Campanha</Link></li>
                <li><Link href="/recife">Recife e Federalismo</Link></li>
                <li><Link href="/assistente">Assistente Cívico</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Transparência e Controle</h5>
              <ul>
                <li><Link href="/metodologia">Metodologia e Princípios</Link></li>
                <li><Link href="/fontes">Fontes Oficiais Utilizadas</Link></li>
                <li><Link href="/monitor">Painel de Monitoramento</Link></li>
                <li><Link href="/correcoes">Histórico de Correções</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>🇧🇷 República Federativa do Brasil • 26 Estados e Distrito Federal</span>
            <span>Art. 1º, parágrafo único da CF/88: Todo o poder emana do povo • Dados Públicos Abertos</span>
          </div>
        </footer>

        {/* VLibras Widget para acessibilidade em Libras */}
        {/* @ts-ignore - vw attributes are required by VLibras */}
        <div vw="true" className="enabled">
          {/* @ts-ignore */}
          <div vw-access-button="true" className="active"></div>
          {/* @ts-ignore */}
          <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
        <Script src="https://vlibras.gov.br/app/vlibras-plugin.js" strategy="lazyOnload" />
        <Script id="vlibras-init" strategy="lazyOnload">
          {`new window.VLibras.Widget('https://vlibras.gov.br/app');`}
        </Script>
      </body>
    </html>
  );
}