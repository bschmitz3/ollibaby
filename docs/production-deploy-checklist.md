# Checklist de deploy e validação em produção — Ollibaby

Documento operacional para preparar e validar um deploy na Vercel com analytics (PostHog), redirects `/go/` e SEO programático. Use como lista de verificação antes e depois da promoção para produção.

**Importante:** não cole segredos, tokens nem valores reais de chaves neste arquivo nem em issues públicas. Use apenas placeholders na documentação e gerenciadores de segredo na Vercel.

---

## Pré-requisitos

- [ ] Projeto Next.js conectado à Vercel (repositório Git linkado, branch de produção definida).
- [ ] URL de **produção** ou **preview** definida para os testes (domínio customizado ou `*.vercel.app`).
- [ ] Projeto **PostHog** criado e chaves disponíveis no painel do projeto (team/project settings).
- [ ] Variáveis de ambiente planejadas e cadastradas na Vercel (Production e Preview conforme a política do time).
- [ ] Acesso ao **GitHub Actions** (ou ao CI configurado no repositório) para conferir pipelines no commit implantado.
- [ ] Se já existir domínio em produção: acesso ao **Google Search Console** para envio/validação de sitemap quando aplicável.

---

## Variáveis de ambiente esperadas na Vercel

| Variável | Onde roda | Uso resumido |
|----------|-----------|----------------|
| `NEXT_PUBLIC_SITE_URL` | Build + cliente/servidor (valor público no bundle) | URL base do site (metadata, sitemap, robots, links absolutos). Defina a URL canônica de produção (sem barra final desnecessária). |
| `NEXT_PUBLIC_POSTHOG_KEY` | Cliente | Chave de projeto PostHog para `posthog-js` (inicialização no browser). **É exposta no bundle** — use apenas a chave pensada para o front (project API key / key pública do snippet). |
| `NEXT_PUBLIC_POSTHOG_HOST` | Cliente | Host da API PostHog para o SDK JS (ex.: região EU/US conforme o projeto). |
| `POSTHOG_PROJECT_API_KEY` | **Somente servidor** | Chave usada por `posthog-node` em rotas/API server-side (ex.: eventos no redirect `/go/`). **Não** prefixar com `NEXT_PUBLIC_`; **nunca** referenciar no código cliente. |
| `POSTHOG_HOST` | Servidor | Host da API para `posthog-node` (alinhado ao mesmo projeto/região que o cliente). |

Checklist de segurança das variáveis:

- [ ] Confirmado: variáveis **`NEXT_PUBLIC_*`** são públicas no bundle — não colocar segredos nelas.
- [ ] Confirmado: **`POSTHOG_PROJECT_API_KEY`** existe apenas em ambiente server na Vercel e não aparece em código cliente nem em repositório.
- [ ] Confirmado: produção usa valores de **Production** na Vercel; previews usam **Preview** se quiser projeto ou flags separados no PostHog.

---

## Antes do deploy

- [ ] `git status` limpo (sem alterações não intencionais; commit que será implantado identificado).
- [ ] CI verde no GitHub no branch/commit que será implantado.
- [ ] Pipeline local completo verde no mesmo estado do commit (ex.: `pnpm run lint`, `pnpm run build`, validações de catálogo e mocks conforme o projeto documenta).
- [ ] `.env.local` **não** commitado (permanece apenas na máquina local).
- [ ] `.env.example` no repositório reflete as variáveis necessárias (sem valores secretos reais).

---

## Após o deploy (smoke manual na URL implantada)

Substitua `{BASE}` pela URL de produção ou preview em uso.

### Funcional

- [ ] Home (`{BASE}/`) carrega sem erro visível.
- [ ] Abrir pelo menos uma **página de produto** (`{BASE}/produtos/{id}`) conhecida no catálogo.
- [ ] **Busca** (envio do formulário / query na URL) retorna resultados coerentes.
- [ ] **Filtros** na home (categoria, disponibilidade de oferta, marca, tamanho quando aplicável) atualizam a listagem.
- [ ] Clicar numa **oferta** que use o fluxo outbound.
- [ ] Confirmar **redirect** via `/go/[offerId]` (URL intermediária `{BASE}/go/...` antes do destino externo, conforme implementação).
- [ ] `{BASE}/sitemap.xml` responde **200** e lista URLs esperadas (home + produtos canônicos; **sem** entradas `/go/`).
- [ ] `{BASE}/robots.txt` responde **200** e referencia o sitemap.
- [ ] Em `robots.txt`, **`/go/`** está **bloqueado** (disallow).
- [ ] No XML do sitemap, **nenhuma** URL contém o caminho `/go/`.

### Visual

- [ ] Nenhuma regressão visual relevante (layout, tipografia, espaçamentos principais) em home e página de produto.

---

## Validação PostHog

### Configuração esperada no cliente (referência)

No projeto, o SDK JS é inicializado com **autocapture desligado**, **pageview automático desligado** e **session recording desligado**. A validação abaixo confere esse comportamento efetivo em produção/preview.

### Eventos client-side (captura explícita)

Conferir no PostHog (Live events ou últimos eventos) ao reproduzir fluxos na URL implantada:

- [ ] `search_performed` — ao submeter busca relevante.
- [ ] `canonical_product_viewed` — ao carregar página de produto (tracker dedicado).
- [ ] `offer_viewed` — quando ofertas ranqueadas aparecem na página (conforme lista).
- [ ] `offer_clicked` / `affiliate_link_clicked` / `non_affiliate_link_clicked` — ao clicar em oferta conforme o tipo de link implementado.
- [ ] Eventos de filtros (`category_filter_clicked`, `offer_availability_filter_clicked`, `brand_filter_clicked`, `size_filter_clicked`) ao usar filtros na home.
- [ ] `product_without_offer_viewed` — em produto sem oferta ranqueável, se aplicável ao cenário testado.
- [ ] `error_reported` — se testar fluxo de reportar erro, quando existir.

Para cada evento crítico do fluxo de monetização/navegação, conferir **payloads**:

- [ ] Identificadores estáveis quando existirem: `productId` e `offerId` nos cliques de oferta; `canonicalProductId` onde o tracker de produto/oferta enviar; `retailerId` quando presente; flags como `isAffiliate`, `destinationType`, campos de preço unitário quando aplicável.
- [ ] Nenhum campo que viole política interna de dados (evitar PII não necessária).

### Eventos server-side (redirect)

Ao acionar uma oferta que passe por `/go/[offerId]`:

- [ ] Evento **`outbound_redirect_started`** aparece com propriedades coerentes (ex.: `offerId`, `canonicalProductId`, `retailerId`, `isAffiliate`, `hasAffiliateUrl`, `destinationHost` como host, não URL completa sensível desnecessária).
- [ ] Em cenário de URL de destino inválida (se reproduzível em ambiente seguro), **`outbound_redirect_invalid_url`** pode ser esperado conforme implementação.

### O que **não** deve aparecer como captura “automática” indesejada

- [ ] **`$pageview`** não deve surgir por pageview automático do SDK (está desativado na init).
- [ ] **`$autocapture`** não deve aparecer por autocapture genérico (está desativado).
- [ ] **Session recording** não deve estar ativa para visitantes (gravador desativado na configuração atual).

**Nota:** há **atraso** eventual entre ação no site e evento visível no PostHog (ingestão, filtros de projeto, amostragem). Em caso de dúvida, repetir o fluxo e aguardar alguns minutos ou usar a visualização de eventos ao vivo.

---

## Validação SEO

Na página de produto implantada:

- [ ] **`<title>`** específico ao produto (padrão inclui nome do produto e comparador por unidade).
- [ ] **`meta description`** específica; menção a preço unitário só quando houver melhor oferta ranqueável (alinhado à implementação).
- [ ] **Open Graph** básico (`og:title`, `og:description`, URL/canonical social quando emitidos).
- [ ] **JSON-LD** tipo `Product` presente e válido (validador estruturado ou inspeção manual).
- [ ] No JSON-LD: **nenhuma URL afiliada externa completa** — `Offer.url` deve apontar para a página do produto no próprio site, conforme política implementada.
- [ ] **Sitemap** submetível ao Search Console (URL absoluta do `sitemap.xml`).
- [ ] **Robots** coerente: permissivo para páginas públicas; bloqueio de `/go/`.

---

## Critérios de aprovação (go/no-go)

Considerar o deploy **aprovado** para produção apenas se:

- [ ] Deploy **acessível** e estável na URL de produção acordada.
- [ ] **Analytics** validado (eventos client-side esperados + `outbound_redirect_started` no fluxo `/go/`).
- [ ] **Redirect** outbound funcionando para oferta de teste.
- [ ] **Sitemap** e **robots** corretos e consistentes com `NEXT_PUBLIC_SITE_URL`.
- [ ] **Sem regressão visual relevante** nas páginas verificadas.
- [ ] **CI verde** no commit implantado no repositório.

Se qualquer item bloqueador falhar, não promover ou reverta conforme a seção Rollback.

---

## Rollback

### Como voltar a um commit anterior na Vercel

- [ ] No dashboard da Vercel: abrir o projeto → **Deployments** → localizar um deployment anterior **bem-sucedido** → **Promote to Production** (ou equivalente para tornar aquele build a produção atual), **ou**
- [ ] Fazer **revert** do merge no GitHub e deixar a Vercel implantar o novo HEAD após o revert, **ou**
- [ ] Redefinir temporariamente o branch de produção / fix em hotfix, conforme política do time.

### Quando fazer rollback

- Erro **500** generalizado ou home inacessível.
- Redirect `/go/` quebrado para todas ou quase todas as ofertas (risco direto a usuários e métricas).
- **Vazamento** de variável server-only para o cliente ou build expondo segredo (acionar rotação de chaves + rollback).
- Regressão SEO crítica apenas se afetar descoberta/legalidade acordada — caso típico: deploy pode ficar com correção rápida forward em vez de rollback, decisão do time.

### Sintomas bloqueadores (exemplos)

- [ ] Taxa de erro alta em produção nas rotas principais.
- [ ] PostHog server-side inoperante **e** decisões de produto dependem de eventos de redirect (corrigir ou reverter até restaurar observabilidade mínima).
- [ ] Conteúdo incorreto ou inseguro servido em escala (decisão conjunta com produto/compliance).

---

## Referências internas

- Estado do projeto e SEO: `docs/00-project-current-state.md`
- Variáveis de exemplo (sem segredos reais): `.env.example`

---

**Última revisão:** checklist operacional alinhado ao Ollibaby (Next.js App Router, PostHog cliente/servidor, `/go/[offerId]`, sitemap e robots).
