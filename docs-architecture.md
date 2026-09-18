# Arquitetura

## Camadas
1. **Ingestão** — jobs obtêm recursos oficiais e registram horário, checksum e origem.
2. **Normalização** — converte campos para o modelo interno sem reescrever conteúdo político.
3. **Persistência** — PostgreSQL/Supabase; tabelas em `src/lib/db/schema.sql`.
4. **API** — rotas somente leitura para o produto público; endpoints administrativos devem exigir autenticação.
5. **Interface** — páginas nacionais e recortes PE/Recife.
6. **Evidência** — propostas e checagens preservam URL/documento, página e data de revisão.

## Guardrails editoriais
- Sem recomendação, score ou ranking de candidatos.
- Não inferir proposta ausente.
- Pesquisa eleitoral sempre acompanhada de metadados metodológicos.
- Situação de candidatura é dado mutável e deve ser datado.
- Checagens mantêm alegação e evidências separadas.
- Correções são versionadas.
