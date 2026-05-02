# Checklist de teste real do PostHog

**Marco atual:** Marco 2 — MVP mensurável  
**Objetivo:** Validar que os eventos client-side e server-side chegam corretamente ao PostHog em ambiente de desenvolvimento local com chaves reais.

---

## Pré-requisitos

- [ ] Conta e projeto criados em [app.posthog.com](https://app.posthog.com)
- [ ] Project API Key disponível (começa com `phc_`)
- [ ] Região/host confirmados (US: `https://us.i.posthog.com` ou EU: `https://eu.i.posthog.com`)
- [ ] `.env.local` configurado localmente com as chaves reais
- [ ] **Nunca commitar chaves reais** — `.env.local` deve estar no `.gitignore`

---

## Variáveis esperadas em `.env.local`

```
# Client-side
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Server-side
POSTHOG_PROJECT_API_KEY=phc_...
POSTHOG_HOST=https://us.i.posthog.com
```

> As chaves client-side e server-side podem ser a mesma Project API Key do projeto.

---

## Fluxo de teste

Execute o servidor local antes de iniciar:

```bash
pnpm run dev
```

Abrir o painel do PostHog em outra aba: **Activity → Live events** ou **Events**.

### Passos

- [ ] **1. Reiniciar o dev server** com as variáveis de ambiente configuradas
- [ ] **2. Abrir a home** em `http://localhost:3000`
- [ ] **3. Fazer uma busca** no campo de busca da home
- [ ] **4. Clicar em um produto** nos resultados
- [ ] **5. Abrir um produto com ofertas** (um dos 5 produtos com oferta mockada)
- [ ] **6. Clicar em "Ver oferta"** em uma oferta listada
- [ ] **7. Confirmar que o redirect ocorre** para a URL de destino esperada
- [ ] **8. Voltar e abrir um produto sem oferta** (qualquer um dos 21 sem oferta mockada)
- [ ] **9. Reportar erro em oferta** (se o botão estiver disponível na UI)

---

## Eventos esperados

| Evento | Origem | Como disparar | Payload crítico a conferir |
|--------|--------|---------------|---------------------------|
| `search_performed` | Client — `search-form.tsx` | Submeter busca na home | `query` (texto da busca) |
| `canonical_product_viewed` | Client — `product-view-tracker.tsx` | Abrir qualquer página de produto | `productId`, `productName`, `category` |
| `offer_viewed` | Client — `offer-view-tracker.tsx` | Abrir produto com oferta elegível | `productId`, `offerId`, `retailerId`, `unitPriceInCents`, `rankPosition` |
| `offer_clicked` | Client — `offer-card.tsx` via `tracked-link.tsx` | Clicar em "Ver oferta" | `offerId`, `retailerId`, `unitPriceInCents` |
| `affiliate_link_clicked` | Client — `offer-card.tsx` via `tracked-link.tsx` | Clicar em oferta com URL afiliada | `offerId`, `retailerId` |
| `non_affiliate_link_clicked` | Client — `offer-card.tsx` via `tracked-link.tsx` | Clicar em oferta sem URL afiliada | `offerId`, `retailerId` |
| `outbound_redirect_started` | Server — `/go/[offerId]/route.ts` | Qualquer clique em oferta que complete o redirect | `offerId`, `canonicalProductId`, `retailerId`, `isAffiliate`, `destinationHost` |
| `product_without_offer_viewed` | Client — `product-without-offer-tracker.tsx` | Abrir produto sem ofertas elegíveis | `productId`, `productName`, `eligibleOffersCount` (deve ser `0`) |
| `error_reported` | Client — `report-offer-error.tsx` | Clicar em "Reportar erro" em uma oferta | `offerId`, `retailerId` |

> `offer_clicked` e `affiliate_link_clicked` (ou `non_affiliate_link_clicked`) devem aparecer juntos para o mesmo clique.

---

## Eventos que **não** devem aparecer

- [ ] `$pageview` — pageview automático está desativado (`capture_pageview: false`)
- [ ] `$autocapture` — autocaptura está desativada (`autocapture: false`)
- [ ] Eventos de session recording (`$snapshot`, `$recording_*`) — gravação de sessão desativada (`disable_session_recording: true`)

Se qualquer um desses aparecer, revisar a configuração em `instrumentation-client.ts`.

---

## Checklist de privacidade

- [ ] Confirmar que nenhum payload contém a URL afiliada completa (apenas `destinationHost` no evento server-side)
- [ ] Confirmar que nenhum payload contém nome, e-mail, CPF ou qualquer dado pessoal
- [ ] Confirmar que nenhum payload contém dados de criança (idade, peso, nome)
- [ ] Confirmar que eventos server-side usam `distinctId: "server"` (visível no painel PostHog)
- [ ] Confirmar que eventos server-side têm `$process_person_profile: false` nas propriedades

---

## Critérios de aprovação

- [ ] Todos os 9 eventos esperados aparecem no painel do PostHog durante o fluxo
- [ ] Nenhum evento automático (`$pageview`, `$autocapture`, `$snapshot`) é gerado
- [ ] Payloads conferidos e sem dados sensíveis
- [ ] Redirect `/go/[offerId]` continua funcionando corretamente após o tracking
- [ ] Pipeline local continua verde:

```bash
pnpm run lint && \
pnpm run build && \
pnpm run catalog:typecheck && \
pnpm run catalog:test && \
pnpm run catalog:validate-approved && \
pnpm run validate:mock-offers && \
pnpm run validate:mock-price-history
```
