# Produção 07 — Dados eleitorais integrados

Objetivo: consolidar a descoberta das fontes oficiais de 2026 e fazer a interface consumir somente registros persistidos e auditáveis.

## Datasets
- candidatos-2026
- pesquisas-eleitorais-2026
- prestacao-de-contas-eleitorais-2026

O catálogo é consultado pela API CKAN do Portal de Dados Abertos. Falhas são reportadas como indisponibilidade. Nenhum dado político é completado por inferência.

## Próxima homologação
Executar `npm install`, `npm run typecheck` e `npm run build` em ambiente com acesso de rede estável; aplicar schema/migrations no Supabase; configurar secrets; executar ingestores; validar amostras contra a fonte primária antes de publicação.
