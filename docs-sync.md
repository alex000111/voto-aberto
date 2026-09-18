# Sincronização e atualização

## Fluxo
TSE -> catálogo CKAN -> fingerprint SHA-256 -> snapshot -> evento de mudança -> API/frontend.

## Persistência
Execute `src/lib/db/schema.sql` no PostgreSQL/Supabase. Configure `.env.local` com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` e `NEXT_PUBLIC_SITE_URL`.

## Agendamento
`GET /api/sync` executa a sincronização. O endpoint aceita `Authorization: Bearer <CRON_SECRET>`. `vercel.json` contém uma sugestão de execução a cada 15 minutos. Ajuste a frequência ao plano/hospedagem e à frequência real da fonte.

## Segurança editorial
Mudanças estruturadas provenientes diretamente de fontes oficiais podem ser auto-publicadas após validação. Alegações, classificações de desinformação e interpretações políticas devem ir para `review_queue` e não devem ser publicadas automaticamente.

## Falha segura
`GET /api/status` verifica disponibilidade das fontes. Indisponibilidade nunca deve ser convertida em lista vazia ou zero registros.
