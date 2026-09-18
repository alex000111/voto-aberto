# Voto Aberto 0.8.0 RC1

Objetivo desta release: fechar a cadeia de confiabilidade antes do beta público.

## Critérios de homologação
- Banco de produção configurado e migrações aplicadas.
- `/api/readiness` retorna HTTP 200.
- Sincronização integral de candidaturas concluída sem erro.
- Mudanças geram versão anterior com `valid_to` e novo `change_event`.
- Ausência no upstream só desativa registro em sincronização integral; filtros e testes limitados nunca desativam dados.
- Interface pública não exibe dados fictícios quando banco/fonte estão indisponíveis.
- Chaves de service role permanecem exclusivamente no servidor.
- `npm run check` aprovado no ambiente de deploy.

## Próximo gate
Após RC1: ligar Supabase de homologação, executar ingestão real, testar páginas e só então abrir Public Beta.
