import Link from 'next/link';
import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Voto Aberto — Observatório Eleitoral e Dados Oficiais 2026',
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
        <a className="skip-link" href="#conteudo">Pular para o conteúdo principal</a>
        <Header />
        <div id="conteudo">
          {children}
        </div>
        <footer>
          <div className="footer-content">
            <div className="footer-brand">
              <h4>Voto Aberto • Observatório Cívico 2026</h4>
              <p>
                Iniciativa cívica independente e apartidária dedicada à transparência eleitoral.
                Todos os dados são coletados diretamente das bases abertas do Tribunal Superior Eleitoral (TSE)
                e demais fontes governamentais primárias. Não pontuamos candidaturas nem emitimos recomendações de voto.
              </p>
            </div>

            <div className="footer-col">
              <h5>Módulos de Consulta</h5>
              <ul>
                <li><Link href="/candidaturas">Candidaturas e Perfis</Link></li>
                <li><Link href="/comparador">Comparador de Propostas</Link></li>
                <li><Link href="/pesquisas">Pesquisas Eleitorais</Link></li>
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
            <span>Fonte antes de opinião. Informação verificável. Decisão é sua.</span>
            <span>Eleições Gerais de 2026 • Dados Públicos sob Licença Aberta</span>
          </div>
        </footer>
      </body>
    </html>
  );
}