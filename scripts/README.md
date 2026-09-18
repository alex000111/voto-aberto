# ETL
`tse-catalog.mjs` inspeciona o catálogo público. Em produção, os importadores devem baixar os recursos oficiais, validar encoding/delimitador, calcular checksum, registrar a coleta em `sources` e só então fazer upsert. Falha de fonte não deve apagar o último snapshot válido.
