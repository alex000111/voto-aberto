# Ingestão registro a registro

1. O catálogo CKAN do TSE é consultado para descobrir o recurso CSV atual, sem URL de arquivo fixada no código.
2. O arquivo é decodificado como Windows-1252 e separado por ponto-e-vírgula, padrão comum nos arquivos eleitorais.
3. `SQ_CANDIDATO` é usado como chave estável quando disponível.
4. Cada linha é normalizada e recebe fingerprint SHA-256.
5. `candidates` guarda o estado atual; `candidate_versions` preserva snapshots; `change_events` registra alterações.
6. Falhas de download ou parsing retornam erro e não são convertidas em lista vazia.
7. O cron padrão consulta a fonte a cada 6 horas. Ajuste a agenda conforme a frequência oficial e limites do provedor.

Variáveis: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SYNC_SECRET`, `CRON_SECRET`.
