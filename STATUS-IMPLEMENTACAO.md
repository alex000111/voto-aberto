# Revisão local — RC5

## Implementado

- Dependências atualizadas e travadas em package-lock; auditoria sem vulnerabilidades na verificação local.
- Rotas administrativas exigem segredo, mesmo quando a variável não está configurada. Falhas do banco não retornam sucesso fictício.
- ZIP/CSV oficial: validação de colunas, domínio HTTPS, redirecionamentos, limites de expansão e download.
- Importação de candidaturas em lotes temporários com publicação transacional, histórico, concorrência e proteção contra fontes incompletas.
- CPF, título e email não são preservados nos novos snapshots públicos. A API de histórico não expõe snapshots antigos.
- Importação transacional de pesquisas com metodologia e plano amostral, sem inventar margem, confiança ou resultados.
- Importação financeira por UF via arquivo oficial local, preservando linhas detalhadas sem criar somas de campanha.
- Busca, filtros e paginação de candidaturas; filtros financeiros; paginação de pesquisas.
- Comparador consulta trechos revisados e limita a comparação ao mesmo cargo e circunscrição.
- Checagens consultam dossiês publicados e revisados; histórico de correções e navegação estadual.
- **Módulo Recife (`/recife`)**: Implementação com indicadores oficiais municipais (DataSUS, IBGE, INEP, SNIS, SDS-PE), matriz de competências constitucionais federativas (Art. 30 da CF/88) e direcionamento para planos de governo.
- **Assistente Cívico Documental (`/assistente`)**: Motor de busca textual e temático em propostas e diretrizes de governo registradas no TSE, com citação literal, página do documento original e link oficial, mantendo estrita neutralidade.
- **App Mobile Expo (`mobile/`)**: Telas completas integradas para navegação rápida (Candidaturas, Recife, Pesquisas, Comparador e Metodologia).
- Repositório Git inicializado localmente com `.gitignore` endurecido (protegendo `.env.local`, builds e zips de fontes pesadas).

## Verificações feitas

- 12 testes automatizados executados e aprovados via `npm test` (incluindo integridade de dados de Recife e motor de busca documental).
- Checagem estrita de tipos TypeScript (`tsc --noEmit`) sem erros.
- Compilação e build completo de produção Next.js 15 (`next build`) aprovado com geração estática e dinâmica de todas as rotas.

## Próximos passos recomendados

- Conectar as credenciais do Supabase em nuvem no arquivo `.env.local` e rodar as migrações via `supabase/setup.sql`.
- Rodar a carga de dados oficiais em produção (`npm run ingest:candidates`, `npm run ingest:polls`, `npm run ingest:finance`).
- Criar o repositório remoto no GitHub e configurar o deploy (ex.: Vercel, Fly.io ou VPS).

