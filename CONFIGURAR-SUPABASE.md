# Conectar o Voto Aberto ao Supabase

O site funciona localmente; o banco ainda não foi criado. Nenhuma credencial ou dado foi enviado a um projeto Supabase nesta preparação.

1. Acesse [o painel do Supabase](https://supabase.com/dashboard) e crie um projeto na sua conta. Escolha o plano e a região conforme sua necessidade; guarde a senha do banco no seu gerenciador de senhas.
2. Abra o **SQL Editor** desse projeto e execute o conteúdo completo de `supabase/setup.sql`. Esse arquivo reúne o esquema e todas as migrações na ordem certa. Para regenerá-lo: `npm.cmd run db:prepare`.
3. No diálogo **Connect** ou nas configurações de API, obtenha a URL do projeto e uma chave **secret** do servidor. A integração usa a Data API e exige que ela esteja habilitada. Consulte a [documentação de chaves](https://supabase.com/docs/guides/api/api-keys).
4. Abra `.env.local` nesta pasta e preencha `SUPABASE_URL` e `SUPABASE_SECRET_KEY`. Como alternativa, a chave legada `service_role` pode ser colocada em `SUPABASE_SERVICE_ROLE_KEY`. Não preencha as duas opções. Não use a chave `anon` ou `publishable` para a importação. Mantenha os segredos de sincronização já gerados.
5. Reinicie o servidor local. Não coloque `.env.local` no GitHub nem envie a chave pelo chat.
6. No terminal desta pasta, execute:

```powershell
npm.cmd run ingest:candidates
npm.cmd run ingest:polls
```

Os comandos carregam `.env.local`. A importação integral de candidaturas é publicada em uma transação, após preparar todos os lotes. Uma queda inesperada superior a 10% exige revisão, em vez de desativar registros silenciosamente. Cargas limitadas (`-- --uf=PE --limit=100`) servem para diagnóstico e não aprovam o readiness da base nacional.

Para finanças, baixe **Prestação de contas de candidatos** no [catálogo oficial](https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2026). O ZIP é grande: use o processo local por UF, após importar candidaturas:

```powershell
npm.cmd run ingest:finance -- --file="C:\caminho\arquivo-oficial.zip" --uf=PE
```

Receitas e despesas contratadas são preservadas como linhas do arquivo, com tipo de prestação e proveniência. Não há soma global ou inferência de despesa paga. O comando substitui a fotografia financeira da UF apenas após a validação e dentro de uma transação. O arquivo de entrada deve vir do link oficial; não há verificação criptográfica de autoria no ZIP.

Para conferir a base:

```powershell
npm.cmd run smoke
```

`/api/health` verifica configuração e acesso ao banco. `/api/readiness` verifica a base de candidaturas e a última carga integral com menos de 24 horas. Esses sinais não certificam os demais módulos nem substituem a homologação com dados reais.

## Publicação e atualização

Antes de publicar, configure as mesmas variáveis no servidor, rode os testes e execute uma carga completa. O `vercel.json` não agenda ingestão pesada dentro de uma requisição: escolha um worker ou execução agendada com duração compatível com o banco e a quantidade de registros. Nenhum agendamento externo foi criado.

O comparador exige trechos de propostas com fonte, página e revisão editorial. Checagens exigem evidências, `reviewed_at` e `published_at`. Não há geração automática de conclusões políticas. Recife, assistente com citações e aplicativo móvel ainda exigem desenvolvimento específico.

Referências: [Data API do Supabase](https://supabase.com/docs/guides/api), [criação de tabelas e rotas](https://supabase.com/docs/guides/api/creating-routes).
