## Pipeline de Catálogo Canônico (MVP Ollibaby)

### Objetivo
Gerar uma lista **canônica, limpa e padronizada** de produtos recorrentes de bebê (por enquanto: **fraldas** e **lenços umedecidos**) para o MVP do Ollibaby, com foco em **evitar comparar produtos errados**.

### Produto canônico vs oferta
- **Produto canônico**: “versão limpa” (marca/linha/tamanho/quantidade/unidade), independente de loja.
- **Oferta**: anúncio/URL em uma loja (Amazon, Mercado Livre, Shopee, Magalu etc.) que será associado depois a um produto canônico.

### Por que o pipeline é conservador
O maior risco do MVP é o pipeline associar títulos a produtos errados. Então a regra é:
- Em caso de dúvida → **`needs_review`** ou **`rejected`**
- Nunca aprovar automaticamente com confiança baixa

### Estrutura (alta nível)
- `data/mock/`: entradas locais (mocks) para rodar offline
- `data/processed/`: candidatos extraídos (`product-candidates.json`)
- `data/review/`: CSV para revisão no Google Sheets (`canonical-review.csv`)
- `data/final/`: rascunho e aprovados

### Rodando o modo mock (100% local)
Gera:
- `scripts/catalog/data/processed/product-candidates.json`
- `scripts/catalog/data/final/canonical-products.draft.json`

Comando:

```bash
pnpm catalog:mock
```

### Exportar CSV para revisão (Google Sheets)
Gera:
- `scripts/catalog/data/review/canonical-review.csv`

Comando:

```bash
pnpm catalog:export-review
```

### Revisar no Google Sheets
Fluxo sugerido:
- Abrir/Importar `canonical-review.csv` no Sheets
- Preencher:
  - `approved` com `true` nas linhas corretas
  - `corrected_brand`, `corrected_line`, `corrected_size`, `corrected_quantity` quando precisar corrigir extrações
  - `review_notes` para registrar decisões

### Importar o CSV revisado
Lê:
- `scripts/catalog/data/review/canonical-review.csv`

Gera:
- `scripts/catalog/data/final/canonical-products.approved.json`

Comando:

```bash
pnpm catalog:import-review
```

### APIs externas (Brave/Serper/Firecrawl) estão desativadas nesta etapa
Por custo e segurança, **nenhuma API externa é chamada** nesta primeira versão.
- `FIRECRAWL_ENABLED` é **false por padrão**
- O código tem proteção para **nunca** planejar/executar crawl se `FIRECRAWL_ENABLED` não for `true`
- Mesmo quando habilitado, o “crawl” ainda é **estrutura futura** (não executa chamadas reais)

### Como evitar gasto acidental de créditos (futuro)
- Mantenha `FIRECRAWL_ENABLED` **desligado** (padrão)
- Use `DRY_RUN=true` (padrão) para qualquer modo que no futuro possa ter custo
- Respeite `FIRECRAWL_MAX_PAGES_PER_RUN` para limitar a execução

### Testes

```bash
pnpm catalog:test
```

