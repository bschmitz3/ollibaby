# Ollibaby

Comparador de preço unitário para produtos recorrentes de bebê — fraldas e lenços umedecidos.

---

## Visão geral

O Ollibaby é uma aplicação web gratuita para famílias brasileiras compararem ofertas de fraldas e lenços umedecidos pelo **preço unitário normalizado** (R$/fralda, R$/lenço), tornando a comparação entre pacotes de tamanhos diferentes direta e honesta.

O projeto está no **Marco 1 — Release técnico estável**. O build de produção passa, o CI está configurado e o catálogo canônico de 26 produtos está curado e validado. Os dados de ofertas e histórico de preços ainda são mockados — não há integrações reais de afiliados, scraping em produção ou banco de dados nesta fase.

O objetivo imediato é consolidar a fundação técnica antes de avançar para dados reais e distribuição pública.

---

## Stack

| Área | Tecnologia |
|------|------------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Package manager | pnpm |
| Pipeline de catálogo | TypeScript, tsx, Vitest |
| CI | GitHub Actions |

---

## Pré-requisitos

- Node.js 20+
- pnpm
- Git

---

## Rodando localmente

```bash
pnpm install
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## Comandos principais

| Script | Descrição |
|--------|-----------|
| `pnpm run dev` | Servidor de desenvolvimento |
| `pnpm run build` | Build de produção (inclui typecheck da app) |
| `pnpm run lint` | ESLint em todo o projeto |
| `pnpm run catalog:typecheck` | Typecheck do pipeline de catálogo |
| `pnpm run catalog:test` | Testes do pipeline de catálogo (Vitest) |
| `pnpm run catalog:validate-approved` | Valida o JSON de produtos aprovados |
| `pnpm run validate:mock-offers` | Valida consistência dos mocks de ofertas |
| `pnpm run validate:mock-price-history` | Valida consistência do histórico de preço mockado |

---

## Pipeline de validação local

Rode antes de abrir um PR para replicar o CI localmente:

```bash
pnpm run lint && \
pnpm run build && \
pnpm run catalog:typecheck && \
pnpm run catalog:test && \
pnpm run catalog:validate-approved && \
pnpm run validate:mock-offers && \
pnpm run validate:mock-price-history
```

---

## App vs. pipeline de catálogo

| Caminho | Responsabilidade |
|---------|-----------------|
| `src/` | Aplicação Next.js (UI, regras de negócio, dados exportados) |
| `scripts/catalog/` | Pipeline offline de curadoria e exportação do catálogo |

O `tsconfig.json` raiz exclui `scripts/**`, de forma que o `next build` valida apenas a aplicação. O pipeline de catálogo tem seu próprio `scripts/catalog/tsconfig.json` e é validado via `catalog:typecheck` e `catalog:test`.

---

## Estado atual dos dados

- **26 produtos** aprovados no catálogo canônico (`src/data/catalog/canonical-products.ts`).
- **10 ofertas mockadas** elegíveis para ranking.
- **5 produtos** com pelo menos uma oferta elegível.
- **21 produtos** sem oferta mockada — aparecem no catálogo sem preço ranqueado.
- **5 produtos** com histórico de preço mockado.
- Todos os dados de ofertas e preços são **semi-estáticos/mockados** nesta fase.

---

## CI

O workflow `.github/workflows/ci.yml` roda em `push` e `pull_request` para a branch `main`.

Steps em ordem:

1. `pnpm run lint`
2. `pnpm run build`
3. `pnpm run catalog:typecheck`
4. `pnpm run catalog:test`
5. `pnpm run catalog:validate-approved`
6. `pnpm run validate:mock-offers`
7. `pnpm run validate:mock-price-history`

---

## Deploy (Vercel) e variáveis

Na Vercel (**Production** e **Preview**, conforme política do time), configure pelo menos:

| Variável | Observação |
|----------|------------|
| `NEXT_PUBLIC_SITE_URL` | URL canônica **sem** barra final (ex.: `https://<projeto>.vercel.app`). Obrigatória para `sitemap.xml`, `robots.txt` e metadados absolutos; sem ela, esses artefatos podem apontar para `http://localhost:3000`. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Pública no bundle; habilita captura client-side no PostHog quando definida. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host da API PostHog (região do projeto). |
| `POSTHOG_PROJECT_API_KEY` | **Somente servidor** — eventos no redirect `/go/`; não usar prefixo `NEXT_PUBLIC_`. |
| `POSTHOG_HOST` | Host da API para `posthog-node`. |

Lista completa e placeholders: `.env.example`. Checklist operacional e smoke test: `docs/production-deploy-checklist.md`.

---

## Limitações atuais

- Sem banco de dados ou persistência.
- Sem scraping ou coleta de preços em produção.
- Sem links afiliados reais (URLs de exemplo).
- Analytics via PostHog quando as variáveis estão definidas no ambiente (local ou Vercel); conferir consentimento/LGPD antes de ampliar tráfego.
- Sem autenticação ou cadastro de usuários.
- Sem funcionalidades de estoque, alertas de preço ou rotina infantil.

---

## Roadmap técnico resumido

1. **Marco 1 — Release técnico estável** *(em andamento)*: build estável, CI, documentação e checklist de release.
2. **Marco 2 — Instrumentação**: analytics em produção, redirecionamento para afiliados rastreado, primeiros links afiliados reais.
3. **Marco 3 — SEO inicial**: *parcialmente entregue* — metadata por produto, `sitemap.xml`, `robots.txt` e JSON-LD; evoluir conforme domínio, Search Console e conteúdo.
4. **Marco 4 — Dados reais**: persistência mínima, pipeline de coleta e ofertas reais para ao menos um subconjunto do catálogo.
5. **Marco 5 — Retenção** *(condicional)*: favoritos ou alertas de preço, se houver tração validada.
