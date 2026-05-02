# Checklist de release — Ollibaby

**Marco atual:** Marco 1 — Release técnico estável  
**Uso:** checklist antes de PR, merge ou deploy técnico  
**Atualizar este documento** sempre que comandos, fluxo ou critérios de marco mudarem.

---

## Antes de abrir um PR

### Pipeline local completo

```bash
pnpm run lint && \
pnpm run build && \
pnpm run catalog:typecheck && \
pnpm run catalog:test && \
pnpm run catalog:validate-approved && \
pnpm run validate:mock-offers && \
pnpm run validate:mock-price-history
```

Todos os comandos devem passar com exit code 0.

### Integridade dos dados

- [ ] Nenhuma mudança não intencional em arquivos gerados (`src/data/catalog/canonical-products.ts`).
- [ ] Novas ofertas mockadas referenciam um `canonicalProductId` que existe no catálogo aprovado.
- [ ] IDs usados em `mock-offers.ts` e `mock-price-history.ts` existem no catálogo canônico atual.
- [ ] Preço unitário calculado é coerente com quantidade e preço total declarados.
- [ ] Não foi introduzida uma segunda fonte de verdade de produtos (ex.: novo mock de produtos paralelo ao catálogo).

---

## Antes de merge

- [ ] CI verde (`lint`, `build`, `catalog:typecheck`, `catalog:test`, `catalog:validate-approved`, `validate:mock-offers`, `validate:mock-price-history`).
- [ ] Build verde (TypeScript da app sem erros).
- [ ] Testes do catálogo verdes (35/35 ou mais se novos testes foram adicionados).
- [ ] README atualizado se comandos, scripts ou fluxo do catálogo mudaram.
- [ ] Nenhuma feature não implementada descrita como pronta em docs ou comentários.

---

## Antes de deploy técnico

- [ ] Variáveis de ambiente necessárias confirmadas (atualmente nenhuma obrigatória além de `.env.local` para features opcionais).
- [ ] Confirmado que dados de ofertas exibidos ainda são mockados/semi-estáticos nesta fase.
- [ ] Confirmado que links afiliados reais ainda não estão ativos (enquanto esse for o caso).
- [ ] Confirmado que analytics em produção ainda não está ativo (enquanto esse for o caso).
- [ ] Páginas de produtos sem oferta mockada não aparecem quebradas — exibem estado "sem oferta" de forma clara.
- [ ] Usuário consegue ver preço unitário e estado da oferta onde aplicável.

---

## Bloqueadores para chamar de MVP público

Enquanto qualquer item abaixo estiver em aberto, o produto **não deve ser divulgado como MVP pronto para tráfego real**:

- Sem analytics em produção — impossível validar métricas do MVP.
- Sem outbound redirect rastreável — não há controle de cliques em ofertas.
- Sem links afiliados reais — sem receita possível.
- Sem dados reais ou processo confiável de atualização de ofertas — produto desatualizado.
- Sem SEO mínimo por produto — páginas não indexáveis individualmente.
- Cobertura de mocks insuficiente — 21 de 26 produtos sem oferta visível ao usuário.

---

## Critérios para avançar ao Marco 2

- [ ] Marco 1 concluído: build estável, CI verde, README e checklist atualizados, dead code removido.
- [ ] CI verde em `main` sem intervenção manual.
- [ ] Decisão registrada sobre instrumentação inicial (PostHog, GA4 ou alternativa).
- [ ] Próxima tarefa escolhida entre:
  - Analytics em produção, ou
  - Outbound redirect rastreável com primeiros links afiliados reais.
