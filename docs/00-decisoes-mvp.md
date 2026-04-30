# Ollibaby — Decisões do MVP

## Status

Documento vivo.

Última atualização: 2026-04-30.

---

## 1. Objetivo do MVP

O MVP do Ollibaby será um comparador web/PWA especializado em produtos recorrentes para bebês, com foco inicial em fraldas e lenços umedecidos.

O objetivo principal é validar se pais, mães e cuidadores no Brasil confiam em uma experiência nichada para encontrar ofertas melhores, comparando produtos por preço unitário real e não apenas por preço total.

A proposta central do MVP é ajudar famílias a comparar fraldas e lenços de forma justa, considerando:

- produto correto;
- linha correta;
- tamanho correto;
- quantidade;
- preço unitário;
- frete, quando disponível;
- disponibilidade;
- confiabilidade da oferta;
- atualização recente.

---

## 2. Decisão de produto

O MVP recomendado é:

> Um comparador web/PWA de fraldas e lenços umedecidos, baseado em catálogo canônico curado, matching confiável, preço unitário normalizado e links afiliados rastreados.

O Ollibaby será gratuito para famílias.

A monetização inicial será feita por links de afiliados, sem comprometer a ordem das melhores ofertas.

Ofertas não afiliadas podem aparecer acima de ofertas afiliadas quando forem melhores para o usuário.

---

## 3. Stack inicial

| Área | Decisão |
|---|---|
| Framework | Next.js |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Banco de dados | Supabase/PostgreSQL |
| ORM | Prisma |
| Deploy | Vercel |
| Analytics | A definir: PostHog ou GA4 |
| Editor principal | Cursor |
| Gerenciador de pacotes | pnpm |
| Estrutura | App único, sem monorepo no início |

---

## 4. Escopo incluído no MVP

O MVP inclui:

- busca pública sem cadastro;
- catálogo canônico de fraldas e lenços;
- página de produto canônico;
- lista de ofertas;
- preço unitário normalizado;
- ranking por melhor oferta real;
- links afiliados rastreados;
- ofertas não afiliadas quando relevantes;
- histórico simples de preço;
- botão de reportar erro;
- tracking de eventos;
- páginas SEO iniciais;
- CEP opcional, se tecnicamente viável.

---

## 5. Fora de escopo no MVP

O MVP não inclui:

- app nativo;
- WhatsApp em massa;
- SMS;
- rotina infantil completa;
- cadastro obrigatório;
- IA avançada de previsão;
- chatbot de recomendação;
- recomendação médica ou nutricional;
- fórmulas infantis;
- vitaminas e suplementos;
- ranking patrocinado;
- mídia paga ampla;
- scraping massivo de centenas de lojas;
- integração com profissionais de saúde;
- relatórios para pediatra;
- marketplace próprio;
- checkout próprio.

---

## 5.1 Hold (institucional/marketing/editorial)

Decisão de foco do MVP: **novas seções institucionais/marketing** e **explicações editoriais amplas** ficam em hold.

Isso **não** significa remover o que já existe — apenas **não expandir agora**.

Foco imediato do desenvolvimento:

- confiança na comparação;
- qualidade dos sinais de oferta (matching, quantidade, frete, disponibilidade, atualização);
- filtros úteis;
- tracking básico futuro;
- histórico de preço mockado futuro.

---

## 6. Categorias iniciais

| Categoria | Status | Justificativa |
|---|---|---|
| Fraldas | Incluída | Alta recorrência, alto volume e comparação clara por unidade. |
| Lenços umedecidos | Incluída | Alta recorrência, boa normalização por unidade e compra frequente. |
| Pomadas e cremes | Fora do primeiro corte | Úteis, mas menor recorrência e maior dispersão de atributos. |
| Fórmulas infantis | Fora do MVP | Alto risco regulatório, reputacional e de comunicação. |
| Vitaminas e suplementos | Fora do MVP | Risco de claims de saúde e interpretação médica. |

---

## 7. Princípios de ranking

O ranking deve priorizar o melhor resultado para o usuário, não a comissão.

A presença de link afiliado nunca deve superar:

1. produto correto;
2. preço unitário menor;
3. disponibilidade;
4. frete viável;
5. confiabilidade do vendedor;
6. atualização recente.

Critérios principais:

| Critério | Peso |
|---|---|
| Preço unitário normalizado | Alto |
| Confiança do matching | Muito alto |
| Confiança da quantidade | Muito alto |
| Disponibilidade | Alto |
| Frete | Alto quando disponível |
| Prazo de entrega | Médio |
| Confiabilidade da loja/vendedor | Alto |
| Atualização recente | Alto |
| Histórico de preço | Médio |
| Presença de afiliado | Baixo |

---

## 8. Política inicial de afiliados

O Ollibaby poderá monetizar por links afiliados.

Essa monetização não deve alterar o preço para o usuário nem influenciar indevidamente a curadoria das melhores ofertas.

Texto público sugerido:

> Alguns links podem gerar comissão para o Ollibaby. Isso não altera o preço para você e não deve influenciar a curadoria das melhores ofertas.

Ofertas não afiliadas podem e devem aparecer quando forem melhores para o usuário.

---

## 9. Normalização de preço

A comparação deve priorizar preço unitário real.

Para fraldas:

```txt
preço por fralda = preço total / quantidade total de fraldas
```

Para lenços umedecidos:

```txt
preço por lenço = preço total / quantidade total de lenços
```

Regras:

- o preço unitário deve ter destaque igual ou maior que o preço total;
- o usuário deve ver a quantidade usada no cálculo;
- kits devem mostrar quantidade por pacote e quantidade total;
- quando houver frete, exibir preço unitário com e sem frete;
- quando a quantidade não for confiável, a oferta não deve aparecer no ranking principal;
- o ranking padrão deve ordenar por menor preço unitário confiável.

---

## 10. Score de confiança

Cada oferta deve ter pelo menos dois scores:

| Score | Descrição |
|---|---|
| `match_confidence` | Confiança de que a oferta corresponde ao produto canônico correto. |
| `quantity_confidence` | Confiança de que a quantidade foi extraída corretamente. |

Regras iniciais:

| Score | Ação |
|---:|---|
| 0,95 a 1,00 | Exibir normalmente. |
| 0,85 a 0,94 | Exibir com cautela. |
| 0,70 a 0,84 | Enviar para revisão ou esconder do ranking principal. |
| Abaixo de 0,70 | Não exibir automaticamente. |

---

## 11. Eventos mínimos de tracking

| Evento | Descrição |
|---|---|
| `search_performed` | Usuário realizou busca. |
| `canonical_product_viewed` | Usuário abriu produto canônico. |
| `offer_viewed` | Oferta foi exibida. |
| `offer_clicked` | Usuário clicou em oferta. |
| `affiliate_link_clicked` | Clique em link afiliado. |
| `non_affiliate_link_clicked` | Clique em oferta não afiliada. |
| `error_reported` | Usuário reportou problema. |
| `cep_added` | Usuário informou CEP. |

---

## 12. Critérios de sucesso do MVP

Critérios mínimos de 30 a 60 dias:

| Critério | Meta mínima |
|---|---:|
| CTR para lojistas | Acima de 15% |
| Erro de matching | Abaixo de 5% |
| Receita por 1.000 sessões | Acima de R$ 20 |
| Custo mensal | Abaixo de R$ 3.000 |
| Reportes de erro graves | Em queda |
| Produtos com tráfego recorrente | Evidência positiva |

Critérios de 90 dias:

| Resultado | Condição |
|---|---|
| Sinal verde | CTR acima de 20%, receita por 1.000 sessões acima de R$ 50, erro de matching abaixo de 3%, custo controlado e múltiplas fontes afiliadas ativas. |
| Sinal amarelo | Boa demanda, mas baixa monetização ou problemas de dados. Corrigir antes de expandir. |
| Sinal vermelho | Baixa demanda, baixo CTR, alto custo operacional ou confiança insuficiente. Reduzir escopo ou rever tese. |

---

## 13. Decisões confirmadas

| Decisão | Status |
|---|---|
| Produto será gratuito para famílias | Confirmada |
| Monetização inicial por afiliados | Confirmada |
| Fraldas e lenços no MVP | Confirmada |
| Fórmulas fora do MVP | Confirmada |
| Vitaminas fora do MVP | Confirmada |
| App nativo fora do MVP | Confirmada |
| WhatsApp fora do MVP | Confirmada |
| Cadastro não obrigatório | Confirmada |
| Ranking não será comprado por comissão | Confirmada |
| Ofertas não afiliadas podem aparecer | Confirmada |
| Stack inicial com Next.js, Supabase e Prisma | Confirmada |
| Desenvolvimento principal no Cursor | Confirmada |

---

## 14. Notas para retomada futura

- A interface atual é provisória e serve apenas para validar o MVP funcionalmente. Não investir tempo excessivo em refinamento visual neste momento.
- O layout definitivo será criado posteriormente no Figma.
- Após a definição visual no Figma, o frontend será personalizado com base no novo design.
- Até lá, priorizar estrutura de dados, catálogo canônico, preço unitário, busca, tracking, afiliados e qualidade de matching.

---

## ADR-001 — Catálogo canônico inicial versionado no repositório

### Contexto

- O Ollibaby precisa comparar produtos recorrentes de bebê com confiança.
- O MVP começa com fraldas e lenços umedecidos.
- O catálogo canônico é necessário antes de scraping, afiliados, ranking e banco de dados.
- Já existe um pipeline em `scripts/catalog` para gerar, revisar, importar, validar e exportar o catálogo.
- O catálogo aprovado atual tem 26 produtos validados manualmente.

### Decisão

- Manter o catálogo canônico inicial versionado em `src/data/catalog/canonical-products.ts`.
- O arquivo é gerado automaticamente a partir de `scripts/catalog/data/final/canonical-products.approved.json`.
- A revisão humana acontece via CSV/Google Sheets.
- O comando `pnpm run catalog:export-to-app` gera o arquivo consumível pela aplicação.
- O comando `pnpm run catalog:validate-approved` valida o catálogo aprovado.
- Não usar banco de dados nesta etapa.
- Não integrar Firecrawl ainda.
- Serper/Brave só devem entrar depois, em modo discover, sem crawling.

### Consequências

- Ganho de simplicidade e auditabilidade.
- Evita custos prematuros de API.
- Permite usar o catálogo na UI e busca local.
- Exige disciplina para não editar manualmente o arquivo auto-gerado.
- Migração futura para Supabase/PostgreSQL continua possível.

### Critérios de aceite

- `pnpm run catalog:test` passa.
- `pnpm run lint` passa.
- `pnpm run catalog:validate-approved` retorna `errorsCount` 0.
- `src/data/catalog/canonical-products.ts` existe e exporta `canonicalProducts`.
