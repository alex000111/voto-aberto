# Produção 09 — RC2 / Homologação

Esta release fecha o caminho para um ambiente real de homologação.

## Ordem de implantação
1. Criar o projeto PostgreSQL/Supabase.
2. Executar `src/lib/db/schema.sql` e depois as migrations 005, 006, 008 e 009.
3. Configurar as cinco variáveis de `.env.example` no provedor de hospedagem.
4. Fazer o deploy sem expor `SUPABASE_SERVICE_ROLE_KEY`, `SYNC_SECRET` ou `CRON_SECRET` ao navegador.
5. Chamar `POST /api/ingest/candidates` com `Authorization: Bearer <SYNC_SECRET>` para a primeira carga.
6. Conferir `/api/health`, `/api/readiness`, `/monitor` e `/candidaturas?uf=PE`.
7. Executar `VOTO_ABERTO_URL=https://<host> npm run smoke`.

## Gate da Public Beta
A versão não é considerada pronta enquanto `health`, `readiness`, ingestão, build e smoke test não passarem no ambiente real. Falha da fonte oficial deve aparecer como indisponibilidade/erro, nunca como zero registros.
