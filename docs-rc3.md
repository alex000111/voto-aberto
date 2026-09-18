# Produção 10 — RC3 / Public Beta Readiness

- Ficha de candidatura passa a descobrir recursos oficiais da própria circunscrição no catálogo TSE 2026.
- Endpoint `/api/candidaturas/:id/documentos` expõe apenas metadados oficiais e trata indisponibilidade como erro, nunca como ausência de registro.
- Índices adicionais para consultas públicas e auditoria.
- Mobile permanece congelado até a homologação web.

## Gate ainda externo ao código
Para marcar como homologado: banco Supabase real, migrations aplicadas, secrets de produção, ingestão integral, `npm run check` e `npm run smoke` no deploy.
