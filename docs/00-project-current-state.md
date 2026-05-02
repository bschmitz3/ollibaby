# Ollibaby — Estado atual do projeto (auditoria técnica e produto)

**Versão do documento:** 1.0  
**Data de referência:** 2026-05-01  
**Finalidade:** Base para auditoria, atualização de roadmap e planejamento dos próximos passos.  
**Escopo:** Repositório `ollibaby` (aplicação Next.js + pipeline de catálogo em `scripts/catalog` + documentação em `docs/`).

---

## 1. Resumo executivo

O Ollibaby é um comparador web focado em **fraldas** e **lenços umedecidos**, com ênfase em **preço por unidade** (fralda ou lenço), transparência sobre afiliados e um catálogo **canônico curado**. No código atual, a experiência é **funcional em desenvolvimento**, com **dados mockados** para produtos fora do conjunto mínimo de ofertas e **sem persistência em banco**, **sem integrações reais de afiliados** e **sem scraping em produção**.

**Principais entregas já implementadas:** UI da home com busca e filtros; página de produto com lista ranqueada de ofertas; modelo de dados de produto canônico e oferta; regras de elegibilidade e ordenação de ofertas; histórico de preço mockado com classificação simples (bom/médio/alto); pipeline offline de catálogo (mock → CSV → importação → validação → export para a app); testes automatizados do pipeline de catálogo (Vitest).

**Principal bloqueio de release/build:** o comando **`pnpm run build` falha** na checagem TypeScript por um erro em `scripts/catalog/src/extractors/extract-from-title.ts` (incompatibilidade `string | null` vs `DiaperType | null`). O `tsconfig` inclui `**/*.ts`, fazendo o build da Next.js validar também os scripts do catálogo.

**Stack planejada vs real:** documentação de decisões (`docs/00-decisoes-mvp.md`) menciona **Supabase/PostgreSQL** e **Prisma**; **não há dependências nem código** dessas tecnologias no `package.json` ou na app — permanecem **pendentes**.

---

## 2. Contexto de produto e documentação existente

No repositório já existem documentos de produto e estratégia que definem o norte do MVP:

| Documento | Conteúdo relevante |
|-----------|---------------------|
| `docs/01-ollibaby_documentacao_base.md` | Visão ampla do produto (fases: buscador → estoque → rotina). |
| `docs/03_ollibaby_mvp_documentacao.md` | Escopo do MVP, hipóteses, métricas, SEO programático, etc. |
| `docs/00-decisoes-mvp.md` | Decisões travadas (stack inicial, fora de escopo, ADR-001 do catálogo versionado). |
| `docs/02_ollibaby_analise_viabilidade_financeira.md` | Análise financeira (referência para roadmap comercial). |

Este arquivo **`00-project-current-state.md`** complementa os anteriores descrevendo **o que o código faz hoje**, **o que está incompleto** e **discrepâncias** entre documentação de produto e implementação.

---

## 3. Stack técnica (estado real)

### 3.1 Dependências principais (`package.json`)

| Área | Versão / escolha |
|------|-------------------|
| Framework | Next.js **16.2.4** |
| React | **19.2.4** |
| Linguagem | TypeScript **^5** |
| Estilo | Tailwind CSS **^4** (@tailwindcss/postcss) |
| ESLint | **^9** com eslint-config-next **16.2.4** |
| Execução de scripts TS | **tsx** |
| Testes (pipeline catálogo) | **Vitest** **^3.2.4** |

### 3.2 Planejado nas decisões e ainda ausente

- **Supabase / PostgreSQL** — não integrado.
- **Prisma** — não integrado.
- **Analytics (PostHog ou GA4)** — não integrado; apenas logger em dev (vide seção 7).
- **PWA** — não há manifest/service worker evidentes na estrutura App Router inspecionada.
- **Deploy** — não há `vercel.json` / `vercel.ts` no repositório; deploy pode estar só na plataforma (não versionado).

### 3.3 Workspace

- Existe `pnpm-workspace.yaml` com configuração de **`ignoredBuiltDependencies`** (sharp, unrs-resolver); **não** é um monorepo multi-pacotes — alinha-se à decisão “app único” na prática.

---

## 4. Estrutura do repositório (mapa rápido)

| Caminho | Função |
|---------|--------|
| `src/app/` | App Router: `layout.tsx`, `page.tsx` (home), `produtos/[id]/page.tsx`. |
| `src/components/` | Componentes de UI (busca, cards, tracking, histórico, explicação). |
| `src/lib/` | Regras de negócio: `offers`, `pricing`, `catalog/search`, `price-history`, `formatters`, `analytics`. |
| `src/types/` | Tipos `CanonicalProduct`, `Offer`, etc. |
| `src/data/catalog/canonical-products.ts` | **Gerado** — catálogo canônico exportado para a app (não editar manualmente). |
| `src/data/mock-offers.ts`, `mock-retailers.ts`, `mock-price-history.ts` | Dados mockados de ofertas, lojas e histórico. |
| `src/data/mock-products.ts` | Lista mock **legada / não referenciada** pelo restante do código (dead code). |
| `scripts/catalog/` | Pipeline de catálogo, normalizers, testes, exportadores. |
| `docs/` | Documentação de produto + este arquivo de estado. |

---

## 5. Catálogo canônico (implementado)

### 5.1 Fonte da verdade na aplicação

- O arquivo `src/data/catalog/canonical-products.ts` é **auto-gerado** a partir de `scripts/catalog/data/final/canonical-products.approved.json`.
- Comando documentado: **`pnpm catalog:export-to-app`** (`catalog:export-to-app` no `package.json`).
- **ADR-001** (`docs/00-decisoes-mvp.md`): catálogo inicial versionado no repo, revisão via CSV/Sheets, sem banco nesta etapa.

### 5.2 Volume e validação

- Validação executada em 2026-05-01: **`pnpm catalog:validate-approved`** retornou **`count`: 26**, **`errorsCount`: 0**.
- Os produtos usam IDs estáveis no formato agregador (ex.: `diaper-pampers-confort-sec-g-fita-regular-52-fralda`).

### 5.3 Adaptação para o domínio da app

- `src/lib/catalog/search.ts` converte registros do catálogo exportado para o tipo `CanonicalProduct` da app (`category` `diaper`/`wet_wipe`, `unitType` `diaper`/`wipe`, etc.).
- Busca textual: normalização NFD, remoção de acentos, lowercase; matching contra marca, linha, nome, tamanho e **sinônimos**.

### 5.4 Pipeline offline (`scripts/catalog`)

Funcionalidades descritas em `scripts/catalog/README.md`:

- `pnpm catalog:mock` — gera candidatos e draft localmente (sem APIs externas por padrão).
- `pnpm catalog:export-review` / `pnpm catalog:import-review` — fluxo CSV ↔ JSON aprovado.
- `pnpm catalog:validate-approved` — validação do JSON aprovado.
- APIs Brave/Serper/Firecrawl: **desativadas por padrão**; guards para não gastar créditos acidentalmente.

### 5.5 Testes do pipeline

- **`pnpm catalog:test`**: **9 arquivos, 35 testes**, todos passando (executado em 2026-05-01).
- Cobertura centrada em normalização, export, import, rejeição, IDs canônicos, guards do Firecrawl — **não** há suíte Vitest/Jest equivalente para `src/app` ou `src/components`.

---

## 6. Ofertas e preços (implementado — mock)

### 6.1 Dados

- **`mockRetailers`**: 4 vendedores fictícios (Amazon BR, Mercado Livre, farmácia e loja exemplo), com flags de afiliado e score de confiabilidade **não usados no ranking atual**.
- **`mockOffers`**: **10 ofertas** distribuídas em **5 produtos canônicos** (2 ofertas por produto nesse mock).
- Consequência na UX: **21 dos 26 produtos** não têm ofertas mockadas elegíveis; aparecem como “sem oferta no mock” ou lista vazia na página de produto, ainda que existam no catálogo.

### 6.2 Validadores auxiliares

- `pnpm validate:mock-offers` — consistência oferta ↔ produto (IDs, `unitType`, quantidades, preços).
- `pnpm validate:mock-price-history` — coerência do histórico mock por `productId`.

Execução em 2026-05-01 — **`pnpm validate:mock-offers`** e **`pnpm validate:mock-price-history`**: **OK**.

Resumo reportado pelo validador de ofertas:

- `totalProducts`: 26  
- `totalOffers`: 10  
- `totalEligibleOffers`: 10  
- `productsWithEligibleOffer`: 5  
- `productsWithoutEligibleOffer`: 21  

Resumo do histórico: `productsWithPriceHistory`: 5.

### 6.3 Modelo `Offer` (`src/types/offer.ts`)

Campos já modelados para evolução futura: frete, total, disponibilidade, estimativa de entrega, contexto regional/CEP, confianças de match e quantidade, datas de coleta/validação, afiliado, status (`published`/`hidden`/`review`). Na UI mock, parte desses campos é preenchida com valores de exemplo.

---

## 7. Regras de ranking (implementado — simplificado)

Implementação em `src/lib/offers.ts`:

**Elegibilidade (`isOfferEligibleForRanking`):**

- `status === "published"`;
- `availabilityStatus === "available"`;
- `matchConfidence >= 0.85`;
- `quantityConfidence >= 0.85`;
- preço unitário efetivo finito.

**Preço efetivo:** usa `unitPriceWithShippingInCents` quando é número finito; caso contrário `unitPriceWithoutShippingInCents`.

**Ordenação:** menor preço unitário efetivo primeiro; desempate por maior `matchConfidence`, depois maior `quantityConfidence`.

**O que ainda não entra no ranking (gap vs documentação de produto):**

- Peso explícito de **frete viável** além do número já embutido em `unitPriceWithShippingInCents`.
- **Prazo de entrega**, **confiabilidade da loja/vendedor** (`reliabilityScore`), **recência** (`collectedAt` / `lastValidatedAt`).
- **Histórico de preço** como critério de ordenação (hoje só serve ao componente de resumo na página de produto).

Documentação (`docs/00-decisoes-mvp.md`, seção de pesos) descreve uma política mais rica; o código implementa um **MVP técnico mínimo** alinhado ao comentário no código: afiliado **não** é critério de ordenação.

---

## 8. Interface do usuário (implementado)

### 8.1 Home (`src/app/page.tsx`)

- Hero com posicionamento do MVP e aviso de links afiliados.
- **Busca** via query string `q` (form GET).
- **Filtros** persistentes na URL: `category` (todos/fraldas/lenços), `offerAvailability` (com/sem oferta ranqueável), `brand`, `size` (oculto para lenços).
- Listagem em grade com `ProductCard`: melhor oferta mock, selo afiliado/não afiliado, match/quantidade %, link para detalhes.
- `ComparisonExplainer`: bloco educativo “Como o Ollibaby compara”.
- Componentes cliente:`SearchForm`; links/filtros usam `TrackedLink`.

### 8.2 Página de produto (`src/app/produtos/[id]/page.tsx`)

- Resolução de produto por ID; **`notFound()`** se inválido (sem `not-found.tsx` customizado — cai no default do Next.js).
- `ProductViewTracker`: dispara evento de visualização no cliente.
- Botão **Reportar erro** (mailto para `contato@ollibaby.com` com template).
- `PriceHistorySummary`: sinal vs média mockada.
- Lista `OfferCard` com detalhes de preços e link “Ver oferta” (URLs **example.com**).

### 8.3 Componentes relacionados

- `OfferCard` + `ReportOfferError` (mailto por oferta).
- `TrackedLink` / `SearchForm` / `ProductViewTracker`: integração com camada de analytics local.

### 8.4 Layout global (`src/app/layout.tsx`)

- Metadata estática global em português (title/description únicos).
- Fontes Geist; `lang="pt-BR"`.

**Gap de SEO:** não há **`generateMetadata`** nem **`generateStaticParams`** nas rotas de produto — todas as páginas `/produtos/[id]` compartilham o mesmo título/descrição do layout, o que contradiz o objetivo de “SEO programático” citado na documentação de MVP.

---

## 9. Analytics e tracking (implementado — apenas desenvolvimento)

Arquivo `src/lib/analytics.ts`:

- `trackEvent` só executa no **browser** e **somente** se `NODE_ENV === "development"` — em produção, **nenhum evento é emitido** para PostHog/GA4 ou backend.

Eventos definidos no código:

- `search_submitted`
- `category_filter_clicked`, `offer_availability_filter_clicked`, `brand_filter_clicked`, `size_filter_clicked`
- `product_viewed`
- `offer_clicked`
- `offer_error_report_clicked`

**Discrepância com `docs/00-decisoes-mvp.md` (seção 11):** lá aparecem nomes como `search_performed`, `canonical_product_viewed`, `affiliate_link_clicked`, etc. O código usa outros identificadores e não separia clique afiliado vs não afiliado em eventos distintos (há `destinationType` no payload de `offer_clicked`).

---

## 10. Histórico de preço (implementado — mock)

- `src/data/mock-price-history.ts`: séries para os **mesmos 5 produtos** que têm ofertas mock.
- `src/lib/price-history.ts`: média histórica (mínimo 2 pontos), classificação `good` / `average` / `high` vs ±5% da média.
- UI: `PriceHistorySummary` na página de produto.

---

## 11. Qualidade, CI e comandos verificados

### 11.1 Resultados (2026-05-01)

| Comando | Resultado |
|---------|-----------|
| `pnpm run build` | **FALHOU** — erro TS em `scripts/catalog/src/extractors/extract-from-title.ts` (linha ~180, `diaperType`). |
| `pnpm run lint` | **OK** |
| `pnpm catalog:test` | **OK** (35 testes) |
| `pnpm catalog:validate-approved` | **OK** (26 produtos, 0 erros) |
| `pnpm validate:mock-offers` | **OK** |
| `pnpm validate:mock-price-history` | **OK** |

### 11.2 CI/CD

- **Não há workflows** em `.github/` no repositório — ausência de gates automáticos de build/test em PR.

### 11.3 README raiz

- Ainda é o **template padrão** do `create-next-app` — não descreve scripts `catalog:*`, validadores nem o propósito do Ollibaby.

---

## 12. Erros conhecidos e dívidas técnicas

### 12.1 Crítico (bloqueia build de produção)

1. **TypeScript no build Next inclui `scripts/catalog`** — falha em `extract-from-title.ts` ao passar `inferredDiaperType.inferred` para `generateCanonicalId` esperando `DiaperType | null`.

**Opções de correção (para roadmap técnico):**  
(a) Ajustar tipagem ou fazer cast/narrowing seguro para `DiaperType`;  
(b) Excluir `scripts/**` do `include` do `tsconfig` usado pelo `next build` e usar tsconfig separado para o catálogo (mudança estrutural).

### 12.2 Alto impacto no produto / auditoria

2. **Sem metadata SEO por produto** — impacto direto em discoverabilidade.
3. **Analytics desligado fora de `development`** — impede validação das métricas do MVP em ambiente real.
4. **Ofertas mock só em 5 SKUs** — experiência incompleta para a maior parte do catálogo de 26 itens.
5. **Ranking simplificado** vs política documentada de pesos (prazo, confiabilidade, recência).

### 12.3 Médio / manutenção

6. **`src/data/mock-products.ts` não é importado** — risco de confusão e drift; candidato a remoção ou fusão documentada.
7. **`README.md` genérico** — onboarding ruim para novos contribuidores e auditores.
8. **Sem testes automatizados da UI ou das libs em `src/lib`** além do pipeline do catálogo.
9. **Reporte de erro só via mailto** — sem ticket interno, sem fila, sem métricas de qualidade de dados.

### 12.4 Baixo / consistência documental

10. Nomes de eventos de analytics divergem da doc de decisões.
11. Decisão “Supabase + Prisma” ainda não refletida no código — roadmap deve marcar como **não iniciado** ou atualizar a decisão.

---

## 13. Matriz: MVP documentado × implementação

Legenda: **Sim** (entregue de forma utilizável), **Parcial**, **Não**.

| Item do MVP (referência principal: `docs/03_ollibaby_mvp_documentacao.md` + `docs/00-decisoes-mvp.md`) | Estado no código |
|-----------------------------------------------------------------------------------------------------|------------------|
| Busca pública sem cadastro | **Sim** |
| Catálogo canônico | **Sim** (26 produtos, export versionado) |
| Página de produto canônico | **Sim** |
| Lista de ofertas ranqueadas | **Sim** (mock; cobertura parcial do catálogo) |
| Preço unitário normalizado | **Sim** |
| Ranking pela melhor oferta “real” | **Parcial** (critérios limitados vs doc) |
| Links afiliados rastreados | **Parcial** (URLs fictícias; tracking só em dev) |
| Ofertas não afiliadas quando melhores | **Sim** no modelo/ranking (mock misto) |
| Histórico simples de preço | **Sim** (mock) |
| Botão reportar erro | **Sim** (mailto) |
| Tracking de eventos | **Parcial** (console em dev; não produção) |
| Páginas SEO iniciais | **Parcial** (metadata global; sem página de produto otimizada) |
| CEP opcional | **Não** |
| Banco + persistência | **Não** |
| Scraping/coleta real | **Não** (pipeline preparado; APIs off) |
| PWA | **Não** evidenciado |

---

## 14. Pendências sugeridas para o roadmap (priorização indicativa)

### 14.1 Fundação release

1. Corrigir **build de produção** (TypeScript em `scripts/catalog` ou exclusão do escopo do Next).
2. Introduzir **CI** (build + lint + `catalog:test` + `catalog:validate-approved` + validadores mock).

### 14.2 Produto e dados

3. Expandir **mock de ofertas** ou conectar **primeira fonte real** para um subconjunto do catálogo.
4. Implementar **`generateMetadata` / JSON-LD** (se desejado) por produto para SEO.
5. Evoluir **ranking** para incluir recência e sinais de confiança adicionais quando dados existirem.

### 14.3 Instrumentação e operações

6. Integrar **PostHog ou GA4** e alinhar **nomes de eventos** ao dicionário da doc (ou atualizar a doc).
7. Substituir ou complementar mailto por **formulário** ou integração (Supabase, servidor de tickets).

### 14.4 Stack decidida e ainda não iniciada

8. **Supabase + Prisma**: modelagem de produtos, ofertas, histórico, usuários (se aplicável), jobs de atualização.

### 14.5 Higiene do repositório

9. README do projeto com comandos, fluxo do catálogo e variáveis de ambiente (quando existirem).
10. Remover ou documentar **`mock-products.ts`** legado.

---

## 15. Critérios de aceite (ADR-001) — status

Conforme `docs/00-decisoes-mvp.md`:

| Critério | Status |
|----------|--------|
| `pnpm run catalog:test` passa | **OK** |
| `pnpm run lint` passa | **OK** |
| `pnpm run catalog:validate-approved` → `errorsCount` 0 | **OK** |
| `src/data/catalog/canonical-products.ts` existe e exporta `canonicalProducts` | **OK** |
| `pnpm run lint` + critérios acima como gate de qualidade | CI **não configurado** |
| Implícito: build deployável | **`pnpm build` falha** atualmente |

---

## 16. Conclusão para auditoria

O projeto está **bem encaminhado na camada de modelo de dados e catálogo curado**, com **pipeline testável** e **UI demonstrando o fluxo principal** do comparador. Porém, para um MVP “auditável” como produto pronto para tráfego real, faltam: **build estável**, **instrumentação em produção**, **SEO por página**, **cobertura de ofertas** além de cinco SKUs mockados e a **stack de persistência** decidida mas não implementada.

Recomenda-se registrar no roadmap explícito: (1) destravar o build; (2) definir o primeiro marco de dados reais ou mocks completos; (3) fechar o pacote analytics + SEO mínimo antes de campanhas de aquisição.

---

*Documento gerado com base na inspeção do repositório e execução de comandos em 2026-05-01.*
