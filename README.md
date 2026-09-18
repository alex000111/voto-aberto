# Voto Aberto — RC4

Observatório de dados eleitorais com fontes rastreáveis. Não recomenda voto nem pontua candidaturas.

## Executar localmente

Requer Node.js 24. Nesta pasta, use `npm.cmd ci` e `npm.cmd run dev -- --hostname 127.0.0.1`, ou abra `iniciar.cmd`. Acesse http://127.0.0.1:3000.

## Banco e dados

Leia [CONFIGURAR-SUPABASE.md](CONFIGURAR-SUPABASE.md). O arquivo consolidado está em [supabase/setup.sql](supabase/setup.sql). As chaves ficam somente no servidor, em `.env.local`, nunca no GitHub.

```powershell
npm.cmd run db:prepare
npm.cmd run ingest:candidates
npm.cmd run ingest:polls
npm.cmd run ingest:finance -- --file="C:\caminho\oficial.zip" --uf=PE
```

A primeira execução depende de criar o banco e preencher as variáveis. Importações nacionais devem rodar em um processo de longa duração; não há cron habilitado automaticamente na hospedagem.

## Verificação

```powershell
npm.cmd test
npm.cmd run check
npm.cmd audit --omit=dev
npm.cmd run smoke
```

`smoke` exige servidor e banco configurados. O teste de banco usa PostgreSQL embutido e não substitui a validação contra Supabase real.

## Estado do produto

[STATUS-IMPLEMENTACAO.md](STATUS-IMPLEMENTACAO.md) distingue código implementado, verificações e pendências. Recife, assistente documental e mobile não estão concluídos. Propostas e checagens dependem de conteúdo revisado. O projeto ainda não foi publicado no GitHub ou hospedado externamente nesta revisão.
