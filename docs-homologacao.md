# Homologação — Voto Aberto

Antes de publicação pública:
1. Executar `src/lib/db/schema.sql` e as migrations 005/006 no Supabase.
2. Definir `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SYNC_SECRET` e `CRON_SECRET` apenas no ambiente do servidor.
3. Executar ingestão de teste com limite pequeno e conferir amostras contra o TSE.
4. Executar ingestão completa; validar contagens por UF/cargo e registros BR/PE.
5. Repetir a ingestão sem mudança e confirmar `changed=0`.
6. Simular alteração controlada em ambiente de teste e confirmar fechamento de `valid_to`, nova versão e `change_event`.
7. Confirmar que indisponibilidade upstream não apaga dados existentes.
8. Testar filtros, páginas individuais, 404 e responsividade.
9. Nunca expor `SUPABASE_SERVICE_ROLE_KEY` ao navegador.
10. Somente publicar módulos de alegações/checagem após fluxo editorial humano estar configurado.
