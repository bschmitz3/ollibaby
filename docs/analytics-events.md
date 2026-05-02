# Contrato de eventos de analytics — Ollibaby

**Marco atual:** Marco 2 — MVP mensurável  
**Integração atual:** PostHog (client-side) + `console.info` em development; `console.info` server-side para redirects  
**Ferramenta externa (client):** PostHog — ver seção [Integração PostHog](#integração-posthog)  
**Banco de eventos:** ainda não implementado  
**Atualizar este documento** sempre que um evento for adicionado, removido ou tiver payload alterado.

---

## Princípios

- Eventos devem medir comportamento real — não vaidade.
- Preço unitário, exposição de oferta, clique e redirect são as métricas centrais do funil.
- Clique afiliado e não afiliado devem ser distinguíveis para separar potencial de monetização de confiança.
- Nunca logar URL afiliada completa em eventos (parâmetros mudam; tokens não devem ser persistidos).
- Não incluir dados pessoais nem dados de criança nos payloads.
- Nomes de eventos devem ser estáveis e versionáveis — mudanças de nome exigem atualização coordenada de call sites e documentação.

---

## Funil mínimo

| Etapa | Evento |
|-------|--------|
| Busca | `search_performed` |
| Visualização de produto | `canonical_product_viewed` |
| Produto sem oferta | `product_without_offer_viewed` |
| Exposição de oferta | `offer_viewed` |
| Clique em oferta | `offer_clicked` |
| Classificação do clique | `affiliate_link_clicked` / `non_affiliate_link_clicked` |
| Redirect server-side | `outbound_redirect_started` |
| Reporte de erro | `error_reported` |

---

## Eventos client-side

Todos disparados via `trackEvent` de `src/lib/analytics/track.ts`.  
Em development: `console.info("[analytics]", event)`.  
Em production: no-op até integração com ferramenta externa.

---

### `search_performed`

**Origem:** `src/components/search-form.tsx` — `onSubmit` do formulário de busca  
**Quando dispara:** ao submeter o formulário de busca (incluindo busca vazia)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `q` | `string` | Termo de busca digitado (pode ser vazio) |
| `hasSearch` | `boolean` | Se o termo não estava vazio após trim |
| `category` | `string \| undefined` | Filtro de categoria ativo |
| `offerAvailability` | `string \| undefined` | Filtro de disponibilidade de oferta ativo |
| `brand` | `string \| undefined` | Filtro de marca ativo |
| `size` | `string \| undefined` | Filtro de tamanho ativo |

**Finalidade:** medir volume e tipo de intenção de busca; entender contexto de filtros aplicados na hora da busca.

---

### `canonical_product_viewed`

**Origem:** `src/components/product-view-tracker.tsx` — `useEffect` no mount  
**Quando dispara:** ao abrir qualquer página de produto canônico, independente de ter oferta

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `productId` | `string` | ID canônico do produto |
| `category` | `string` | Categoria (`diaper` / `wipe`) |
| `brand` | `string` | Marca |
| `line` | `string` | Linha do produto |
| `quantity` | `number` | Quantidade total normalizada |
| `unitType` | `string` | Tipo de unidade (`diaper` / `wipe`) |
| `rankedOffersCount` | `number` | Número de ofertas elegíveis exibidas |

**Finalidade:** medir quais produtos são mais visualizados; base para calcular taxa de conversão (views → cliques).

---

### `product_without_offer_viewed`

**Origem:** `src/components/product-without-offer-tracker.tsx` — `useEffect` no mount  
**Quando dispara:** ao abrir página de produto que não tem nenhuma oferta elegível ranqueada

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `productId` | `string` | ID canônico do produto |
| `productName` | `string` | Nome do produto |
| `category` | `string` | Categoria |
| `brand` | `string` | Marca |
| `line` | `string` | Linha do produto |
| `size` | `string \| null` | Tamanho (nulo para lenços) |
| `eligibleOffersCount` | `number` | Sempre `0` neste evento |

**Finalidade:** identificar produtos com demanda mas sem cobertura de oferta; priorizar expansão de mocks e, futuramente, coleta de dados reais.

**Observação:** renderizado condicionalmente apenas quando `rankedOffers.length === 0`. Não dispara para produtos com oferta.

---

### `offer_viewed`

**Origem:** `src/components/offer-view-tracker.tsx` — `useEffect` no mount  
**Quando dispara:** ao renderizar cada `OfferCard` na página de produto (uma vez por oferta exibida)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `productId` | `string` | ID do produto canônico |
| `offerId` | `string` | ID da oferta |
| `retailerId` | `string` | ID do retailer |
| `sellerName` | `string \| undefined` | Nome do vendedor (quando disponível) |
| `unitPriceInCents` | `number` | Preço por unidade sem frete (base para ranking) |
| `unitPriceWithShippingInCents` | `number \| undefined` | Preço por unidade com frete (quando informado) |
| `isAffiliate` | `boolean` | Se a oferta tem URL afiliada |
| `rankPosition` | `number` | Posição na lista ranqueada (1 = melhor) |

**Finalidade:** medir impressões de ofertas; calcular taxa de exposição → clique por posição de ranking.

**Observação:** implementado via `OfferViewTracker` separado do `OfferCard` para não transformar `OfferCard` em Client Component. Não usa `IntersectionObserver` — dispara no mount da página, não na entrada no viewport.

---

### `offer_clicked`

**Origem:** `src/components/offer-card.tsx` — `TrackedLink` no botão "Ver oferta"  
**Quando dispara:** ao clicar no botão "Ver oferta" de qualquer oferta ranqueada

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `offerId` | `string` | ID da oferta |
| `productId` | `string` | ID do produto canônico |
| `isAffiliate` | `boolean` | Se a oferta tem URL afiliada |
| `unitType` | `string` | Tipo de unidade |
| `effectiveUnitPriceInCents` | `number` | Preço unitário efetivo usado no ranking |
| `destinationType` | `"affiliate" \| "direct"` | Tipo de destino |

**Finalidade:** medir intenção de compra geral; base do funil de conversão.

**Observação:** evento geral de clique. Sempre disparado junto com `affiliate_link_clicked` ou `non_affiliate_link_clicked`.

---

### `affiliate_link_clicked`

**Origem:** `src/components/offer-card.tsx` — evento secundário do `TrackedLink`  
**Quando dispara:** ao clicar em oferta cuja `offer.affiliateUrl` está preenchida

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `offerId` | `string` | ID da oferta |
| `productId` | `string` | ID do produto canônico |
| `unitType` | `string` | Tipo de unidade |
| `effectiveUnitPriceInCents` | `number` | Preço unitário efetivo |

**Finalidade:** medir potencial de monetização; base para calcular RPM afiliado estimado.

---

### `non_affiliate_link_clicked`

**Origem:** `src/components/offer-card.tsx` — evento secundário do `TrackedLink`  
**Quando dispara:** ao clicar em oferta sem `offer.affiliateUrl`

**Payload:** mesmo que `affiliate_link_clicked`

**Finalidade:** medir confiança do usuário em ofertas não afiliadas; comparar comportamento com cliques afiliados.

---

### `error_reported`

**Origem:** `src/components/report-offer-error.tsx` — `TrackedLink` no link "Reportar erro"  
**Quando dispara:** ao clicar em "Reportar erro" em qualquer oferta

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `offerId` | `string` | ID da oferta reportada |
| `productId` | `string` | ID do produto canônico |

**Finalidade:** medir frequência de erros reportados por oferta; identificar ofertas de baixa qualidade antes de ter pipeline de validação automático.

---

### `category_filter_clicked`

**Origem:** `src/app/page.tsx` — `TrackedLink` nos filtros de categoria  
**Quando dispara:** ao clicar em um filtro de categoria (Todos / Fraldas / Lenços)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `q` | `string` | Busca ativa |
| `hasSearch` | `boolean` | Se havia busca ativa |
| `category` | `string` | Categoria anterior |
| `brand` | `string \| undefined` | Marca ativa |
| `size` | `string \| undefined` | Tamanho ativo |
| `offerAvailability` | `string \| undefined` | Filtro de disponibilidade ativo |
| `clickedCategory` | `string` | Categoria clicada |

---

### `offer_availability_filter_clicked`

**Origem:** `src/app/page.tsx` — `TrackedLink` nos filtros de disponibilidade de oferta  
**Quando dispara:** ao clicar em filtro de disponibilidade (Todos / Com oferta)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `q` | `string` | Busca ativa |
| `hasSearch` | `boolean` | Se havia busca ativa |
| `category` | `string \| undefined` | Categoria ativa |
| `brand` | `string \| undefined` | Marca ativa |
| `size` | `string \| undefined` | Tamanho ativo |
| `offerAvailability` | `string \| undefined` | Disponibilidade anterior |
| `clickedOfferAvailability` | `string` | Disponibilidade clicada |

---

### `brand_filter_clicked`

**Origem:** `src/app/page.tsx` — `TrackedLink` nos filtros de marca  
**Quando dispara:** ao clicar em filtro de marca (Todas ou marca específica)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `q` | `string` | Busca ativa |
| `hasSearch` | `boolean` | Se havia busca ativa |
| `category` | `string \| undefined` | Categoria ativa |
| `brand` | `string \| undefined` | Marca anterior |
| `size` | `string \| undefined` | Tamanho ativo |
| `offerAvailability` | `string \| undefined` | Disponibilidade ativa |
| `clickedBrand` | `string` | Marca clicada (`"all"` para "Todas") |

---

### `size_filter_clicked`

**Origem:** `src/app/page.tsx` — `TrackedLink` nos filtros de tamanho  
**Quando dispara:** ao clicar em filtro de tamanho (Todos ou tamanho específico); visível apenas para categoria fraldas

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `q` | `string` | Busca ativa |
| `hasSearch` | `boolean` | Se havia busca ativa |
| `category` | `string \| undefined` | Categoria ativa |
| `brand` | `string \| undefined` | Marca ativa |
| `size` | `string \| undefined` | Tamanho anterior |
| `offerAvailability` | `string \| undefined` | Disponibilidade ativa |
| `clickedSize` | `string` | Tamanho clicado (`"all"` para "Todos") |

---

## Eventos server-side

Todos disparados via `trackServerEvent` de `src/lib/analytics/track-server.ts`.  
Sempre executados, em todos os ambientes.  
Atualmente: `console.info("[server-analytics]", event)`.  
**Não re-exportados pelo barrel `src/lib/analytics/index.ts`** — importar diretamente apenas em código server-side.

---

### `outbound_redirect_started`

**Origem:** `src/app/go/[offerId]/route.ts` — Route Handler `GET`  
**Quando dispara:** ao receber uma requisição válida para `/go/[offerId]`, antes do redirect 302

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `offerId` | `string` | ID da oferta |
| `canonicalProductId` | `string` | ID do produto canônico |
| `retailerId` | `string` | ID do retailer |
| `isAffiliate` | `boolean` | Se a oferta tem URL afiliada |
| `hasAffiliateUrl` | `boolean` | Se `offer.affiliateUrl` está preenchida |
| `destinationHost` | `string` | Hostname de destino (ex.: `"example.com"`) |
| `timestamp` | `string` | ISO-8601, gerado internamente |

**Finalidade:** contagem definitiva de redirects efetivos; detectar discrepância entre `offer_clicked` (client) e redirect real (server); base para futura receita afiliada.

**Observação:** URL completa de destino nunca é logada. Apenas `destinationHost` é registrado.

---

### `outbound_redirect_invalid_url`

**Origem:** `src/app/go/[offerId]/route.ts` — Route Handler `GET`  
**Quando dispara:** quando `offer.affiliateUrl ?? offer.url` não é uma URL válida (falha ao construir `new URL()`)

**Payload:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `offerId` | `string` | ID da oferta |
| `canonicalProductId` | `string` | ID do produto canônico |
| `retailerId` | `string` | ID do retailer |
| `isAffiliate` | `boolean` | Se a oferta tem URL afiliada |
| `timestamp` | `string` | ISO-8601, gerado internamente |

**Finalidade:** detectar dados de oferta corrompidos antes que o usuário receba um erro `502`; sinaliza necessidade de validação de URLs no pipeline de importação.

---

## Decisões registradas

1. **`offer_clicked` + eventos específicos coexistem:** `offer_clicked` mede intenção geral; `affiliate_link_clicked` e `non_affiliate_link_clicked` medem classificação do destino. Os três sempre disparam juntos no mesmo clique.

2. **`offer_viewed` é emitido por `OfferViewTracker` separado** — mantém `OfferCard` como Server Component opcional e respeita o princípio de superfície client-side mínima.

3. **`outbound_redirect_started` não registra URL completa** — `destinationHost` é suficiente para análise de retailer sem expor parâmetros de afiliado.

4. **`trackServerEvent` não é exportado pelo barrel** — importar diretamente de `@/lib/analytics/track-server` torna visível para qualquer revisor que a função é exclusivamente server-side.

---

## Próximas decisões

- [x] Escolher ferramenta externa de analytics → **PostHog** (Marco 2).
- [ ] GA4: decidir se integraremos em paralelo ou substituiremos PostHog.
- [ ] Definir persistência server-side mínima para `outbound_redirect_started` (tabela em banco, fila, ou evento PostHog server-side).
- [ ] Definir política de retenção dos eventos.
- [ ] Definir dashboard mínimo: funil busca → visualização → clique → redirect.
- [ ] Definir convenção de versionamento do schema de eventos quando payloads mudarem.
- [ ] **Implementar consent banner** e chamar `posthog.opt_out_capturing()` por padrão antes de habilitar para tráfego público relevante (LGPD/GDPR).

---

## Integração PostHog

**Status:** ativo — client-side e server-side (Marco 2)

PostHog foi escolhido como primeira ferramenta externa de analytics. A integração é mínima e incremental, mantendo a camada interna de eventos inalterada.

### Configuração

| Opção | Valor | Motivo |
|-------|-------|--------|
| `autocapture` | `false` | Eventos gerenciados manualmente via `trackEvent` |
| `capture_pageview` | `false` | Pageviews gerenciados via `canonical_product_viewed` |
| `capture_pageleave` | `false` | Não necessário nesta fase |
| `disable_session_recording` | `true` | Fora de escopo (Marco 2) |

### Inicialização

Feita em `instrumentation-client.ts` (raiz do projeto), que executa antes da hidratação do React. Só inicializa se `NEXT_PUBLIC_POSTHOG_KEY` estiver definida — sem chave, sem captura.

### Fluxo de envio

Todos os eventos passam por `trackEvent` em `src/lib/analytics/track.ts`. O PostHog não recebe eventos diretamente dos componentes.

```
componente → trackEvent() → console.info (dev) + posthog.capture() (se chave configurada)
```

### Variáveis de ambiente necessárias

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Pendências antes de tráfego público

- **TODO:** implementar consent banner e chamar `posthog.opt_out_capturing()` por padrão antes de habilitar coleta para usuários em jurisdições LGPD/GDPR.

---

## Integração PostHog server-side

**Status:** ativo — `posthog-node` via `trackServerEvent` (Marco 2)

Os eventos server-side `outbound_redirect_started` e `outbound_redirect_invalid_url` são enviados ao PostHog quando `POSTHOG_PROJECT_API_KEY` estiver configurada.

### Comportamento

| Condição | Resultado |
|----------|-----------|
| `POSTHOG_PROJECT_API_KEY` não configurada | retorno silencioso, sem envio |
| `NODE_ENV=development` | `console.info("[server-analytics]", event)` + envio se chave existir |
| Production com chave | envio ao PostHog, sem log |

### Configuração do client

- `flushAt: 1` + `flushInterval: 0` — client por requisição, flush imediato antes do shutdown
- `await client.shutdown()` garante entrega antes do handler encerrar
- `runtime = "nodejs"` no route handler assegura compatibilidade com `posthog-node`

### Decisões de design

- **`distinctId: "server"`** — identificador fixo para eventos de sistema sem usuário associado
- **`$process_person_profile: false`** — evita criação de perfil de pessoa para esses eventos de infraestrutura
- **URL completa de destino não é enviada** — apenas `destinationHost` (hostname) no payload
- **`trackServerEvent` não é exportada pelo barrel `src/lib/analytics/index.ts`** — importação direta de `@/lib/analytics/track-server` apenas em código server-side

### Variáveis de ambiente necessárias

```
POSTHOG_PROJECT_API_KEY=phc_...
POSTHOG_HOST=https://us.i.posthog.com
```
