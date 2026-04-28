# Ollibaby — Análise de Viabilidade Financeira

**Versão:** 0.1  
**Data:** 28/04/2026  
**Tipo:** análise financeira, comercial e estratégica  
**Base:** documentação fundacional do Ollibaby v0.2  
**Premissa central:** produto gratuito para famílias, monetização 100% via links de afiliados.

---

## 1. Resumo executivo

A viabilidade financeira do Ollibaby é **possível, mas não óbvia**. O projeto tem uma dor real, recorrência alta e um nicho com forte aderência a comparação de preço. Porém, o modelo 100% afiliado impõe uma restrição severa: para sustentar o produto apenas com comissão, o Ollibaby precisa gerar **volume relevante de tráfego qualificado**, alta confiança no matching das ofertas e custos operacionais muito controlados.

A análise indica que o MVP faz sentido financeiro se for tratado inicialmente como um **produto de validação de tráfego, confiança e conversão**, e não como negócio rentável desde o início.

A tese é mais forte quando o Ollibaby se posiciona como:

> “O melhor comparador especializado de produtos recorrentes para bebês, com preço unitário real, curadoria por produto exato e alerta de reposição.”

A tese fica fraca se o produto tentar competir apenas como “mais um agregador de ofertas”, pois marketplaces, comparadores generalistas, influenciadores de cupom e grupos de WhatsApp já capturam grande parte da atenção de compra.

### Veredito preliminar

**Vale construir o MVP**, desde que com estes critérios de corte:

1. MVP enxuto, focado primeiro em fraldas e lenços.
2. Custos mensais abaixo de R$ 2.000 a R$ 4.000 durante validação.
3. Scraping seletivo, não varredura massiva.
4. Forte foco em SEO, conteúdo programático e retenção por alertas.
5. Priorização de marketplaces com afiliados robustos.
6. Exibição de ofertas não afiliadas quando forem melhores, para preservar confiança.
7. Fórmulas e suplementos devem entrar com cautela por risco regulatório e reputacional.

**Não vale escalar infraestrutura, WhatsApp, IA avançada ou app nativo antes de validar unit economics.**

---

## 2. Fontes e referências utilizadas

Esta análise usa a documentação-base do Ollibaby e referências públicas sobre mercado, afiliados, e-commerce e ferramentas.

### Fontes internas

- `01-ollibaby_documentacao_base.md`, versão 0.2.

### Fontes externas principais

- Amazon Associados Brasil — Comissões Padrão: https://associados.amazon.com.br/welcome/compensation
- Mercado Livre — Programa de Afiliados e Criadores: https://www.mercadolivre.com.br/l/afiliados-home
- Magalu / Parceiro Magalu: https://www.parceiromagalu.com.br/
- Magalu / Influenciador Magalu: https://www.magazinevoce.com.br/
- Awin Brasil: https://www.awin.com/pt/
- Awin — Diretório de anunciantes: https://www.awin.com/br/search/advertiser-directory
- Lomadee: https://www.lomadee.com.br/
- Admitad Brasil: https://www.admitad.com/pt-br/
- Admitad Store Brasil: https://www.admitad.com/pt-br/store/
- Kwanko Brasil: https://www.kwanko.com/br/afiliados/
- Rakuten Advertising Brasil: https://rakutenadvertising.com/pt-br/
- ABComm — previsão de vendas online: https://dados.abcomm.org/previsao-de-vendas-online
- ABComm — crescimento do e-commerce brasileiro: https://dados.abcomm.org/crescimento-do-ecommerce-brasileiro
- IBGE Educa — nascimentos em 2024: https://educa.ibge.gov.br/criancas/voce-sabia/23121-numero-de-nascimentos-em-2024.html
- Agência Brasil — nascimentos no Brasil em 2024: https://agenciabrasil.ebc.com.br/geral/noticia/2025-12/numero-de-nascimentos-cai-58-em-2024-sexto-recuo-consecutivo
- Brave Search API Pricing: https://api-dashboard.search.brave.com/documentation/pricing
- Brave Search API: https://brave.com/search/api/
- Firecrawl Pricing: https://www.firecrawl.dev/pricing
- Serper.dev: https://serper.dev/
- WhatsApp Business Platform Pricing: https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- ANPD — tratamento de dados pessoais de crianças e adolescentes: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes
- Ministério da Saúde — NBCAL: https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/controle-e-regulacao-dos-alimentos/nbcal

---

## 3. Tese financeira do Ollibaby

O Ollibaby só se torna financeiramente interessante se conseguir capturar uma parte do comportamento recorrente de compra de famílias com bebês e crianças pequenas.

A lógica financeira é:

```text
tráfego qualificado
→ buscas de produtos recorrentes
→ clique em oferta
→ compra em marketplace/lojista
→ comissão afiliada
→ reinvestimento em dados, scraping, SEO e produto
```

O ponto central é que o Ollibaby não monetiza por assinatura, mensalidade ou venda direta. Portanto, ele precisa transformar **intenção de compra** em **cliques monetizáveis**.

### Fórmula simplificada de receita

```text
Receita mensal =
usuários ativos mensais
× compras mensais influenciadas por usuário
× ticket médio por compra
× comissão média efetiva
```

Outra forma, mais granular:

```text
Receita mensal =
sessões mensais
× CTR para lojas
× conversão pós-clique
× ticket médio
× comissão média efetiva
```

---

## 4. Contexto de mercado

### 4.1 Tamanho do público potencial

O Brasil registrou aproximadamente **2,38 milhões de nascimentos em 2024**, segundo dados do IBGE divulgados em 2025. Isso cria uma base anual grande de novas famílias entrando em uma jornada intensa de consumo recorrente infantil.

Mesmo com queda na natalidade, o mercado segue relevante porque:

- bebês consomem produtos recorrentes diariamente;
- famílias compram fraldas e lenços por vários anos;
- compras são frequentes;
- o custo acumulado é alto;
- a dor de ruptura de estoque é real;
- preço, frete e disponibilidade variam muito.

### 4.2 E-commerce brasileiro

A ABComm projeta crescimento contínuo do e-commerce brasileiro, com previsão de **R$ 259,08 bilhões em vendas online em 2026**. Esse contexto favorece produtos de comparação, curadoria, alerta e otimização de compra.

### 4.3 Característica do nicho

O nicho de produtos infantis recorrentes tem quatro características financeiramente interessantes:

1. **Alta recorrência:** fraldas e lenços são comprados repetidamente.
2. **Alta sensibilidade a preço:** pequenas diferenças unitárias geram economia mensal relevante.
3. **Complexidade de comparação:** packs, kits, tamanhos e linhas dificultam decisão.
4. **Urgência:** quando acaba, os pais compram rápido, mesmo pagando mais caro.

A combinação de recorrência + complexidade + urgência é positiva para um assistente de compra.

---

## 5. Categorias analisadas

| Categoria | Potencial de receita afiliada | Recorrência | Complexidade de comparação | Risco regulatório | Prioridade financeira |
|---|---:|---:|---:|---:|---:|
| Fraldas | Alto | Muito alta | Alta | Baixo | Muito alta |
| Lenços umedecidos | Médio/alto | Alta | Alta | Baixo | Alta |
| Pomadas/cremes | Médio | Média | Média | Médio | Média |
| Fórmulas infantis | Alto | Alta | Média/alta | Alto | Cautelosa |
| Vitaminas/suplementos | Médio | Média | Média | Alto | Baixa no MVP |

### Conclusão por categoria

O MVP financeiro deve começar por **fraldas e lenços**.

Fórmulas têm ticket alto e recorrência, mas carregam risco regulatório, sensibilidade médica e regras de comunicação. Elas podem ser analisadas como categoria de fase 2, com linguagem neutra e revisão jurídica.

Vitaminas e suplementos devem ser tratados com ainda mais cautela, pois o risco de claims inadequados é maior.

---

## 6. Discovery de programas de afiliados e redes

### 6.1 Amazon Associados Brasil

A Amazon Associados é um dos programas mais relevantes para o MVP porque:

- tem programa maduro;
- possui catálogo amplo;
- tem boa confiança de marca;
- cobre categorias relevantes;
- tem logística reconhecida;
- oferece comissão divulgada publicamente por categoria.

A página de comissões da Amazon Associados indica comissão padrão de **13% para Bebê, Beleza, Saúde e Cuidados Pessoais e Alimentos e Bebidas**, categorias altamente relacionadas ao escopo do Ollibaby.

#### Pontos positivos

- Comissão potencialmente alta para categorias do MVP.
- Boa conversão pela confiança da marca.
- Logística forte em grandes centros.
- Experiência de compra conhecida.
- Catálogo bom para fraldas, lenços, pomadas e alguns alimentos/suplementos.

#### Pontos de atenção

- Regras rígidas de uso do programa.
- Dependência de atribuição correta.
- Possíveis limites para exibição de preço e atualização de dados conforme políticas do programa.
- Disponibilidade regional e frete ainda variam.
- É necessário revisar termos de uso antes de usar scraping em páginas Amazon.

#### Nota de viabilidade

**Muito alta para MVP**, especialmente se houver cuidado com compliance do programa.

---

### 6.2 Mercado Livre Afiliados

O Mercado Livre afirma em sua página de afiliados que o programa permite ganhar **até 16% de porcentagem de parceria por venda** e destaca grande volume de produtos e cupons.

#### Pontos positivos

- Marketplace com altíssima penetração no Brasil.
- Grande catálogo de fraldas, lenços e produtos infantis.
- Forte logística via Mercado Envios.
- Alto reconhecimento e confiança.
- Possibilidade de cupons.
- Muitas ofertas competitivas.

#### Pontos de atenção

- Variação grande entre vendedores.
- Risco de inconsistência entre preço exibido e preço final.
- Produtos iguais podem aparecer duplicados.
- Disponibilidade e prazo dependem de vendedor e região.
- A comissão “até 16%” não significa comissão média para o Ollibaby.

#### Nota de viabilidade

**Muito alta**, mas exige forte normalização, deduplicação e avaliação de vendedor.

---

### 6.3 Shopee Afiliados

A Shopee é relevante pelo preço agressivo, cupons e alta penetração em compras de baixo e médio ticket. Porém, a informação pública oficial de comissão por categoria é menos transparente nos resultados disponíveis, e muitas fontes secundárias apontam grande variação por campanha, categoria e perfil de afiliado.

#### Pontos positivos

- Forte apelo de preço.
- Grande presença em grupos de ofertas.
- Marketplace popular para itens recorrentes e kits.
- Alto potencial para usuários sensíveis a preço.

#### Pontos de atenção

- Qualidade de vendedores varia.
- Prazo de entrega pode ser maior.
- Produtos podem ter maior risco de inconsistência.
- Comissão efetiva pode variar bastante.
- Frete e cupons influenciam muito o preço final.
- Necessário validar se produtos infantis recorrentes têm boa conversão e baixa taxa de cancelamento.

#### Nota de viabilidade

**Alta como fonte complementar**, mas não deve ser o pilar único de confiança do MVP.

---

### 6.4 Magalu / Parceiro Magalu / Influenciador Magalu

O Parceiro Magalu informa comissões de **até 12%** em vendas. O Influenciador Magalu permite montar uma loja com produtos do Magalu e ganhar comissão por venda.

#### Pontos positivos

- Marca forte no Brasil.
- Boa presença logística.
- Boa confiança de consumidor.
- Possibilidade de loja própria/curadoria.
- Catálogo de produtos infantis e farmácia/perfumaria pode ser relevante.

#### Pontos de atenção

- Catálogo pode ser menos profundo em algumas categorias versus marketplaces puros.
- Comissões variam.
- Experiência pode ser mais voltada a social commerce do que integração programática.
- Necessário avaliar limitações para links diretos, tracking e automação.

#### Nota de viabilidade

**Média/alta**, relevante para diversificação.

---

## 7. Redes e empresas similares à Awin

### 7.1 Awin

A Awin se posiciona como plataforma global de marketing de afiliados e informa trabalhar com milhares de empresas em vários setores, incluindo varejo e compras. A página de afiliados menciona mais de **30 mil marcas** globalmente.

#### Relevância para Ollibaby

Alta para discovery de varejistas, mas a cobertura específica no Brasil deve ser validada anunciante por anunciante. O diretório brasileiro da Awin existe, mas é necessário mapear quais anunciantes ativos têm categorias compatíveis com fraldas, farmácia, supermercado, bebê, saúde e beleza.

#### Possíveis tipos de lojistas a buscar

- Farmácias online.
- Perfumarias.
- Supermercados.
- Lojas de bebê.
- Lojas de departamento.
- Marketplaces com categoria bebê.
- Clubes de compra.

---

### 7.2 Lomadee

A Lomadee é uma rede brasileira historicamente relevante em marketing de afiliados. Sua página informa conexão entre marcas e afiliados e posiciona a plataforma como uma solução para anunciantes e afiliados.

#### Relevância para Ollibaby

Muito relevante por ser local e por historicamente ter relação com e-commerce brasileiro.

#### Possíveis vantagens

- Maior aderência ao mercado brasileiro.
- Potencial presença de varejistas nacionais.
- Familiaridade com modelos de conteúdo, cupom e oferta.
- Pode ser boa ponte para farmácias, supermercados e lojas infantis.

#### Pontos a validar

- Lista atual de anunciantes ativos.
- Comissões por categoria.
- Regras para sites de comparação.
- API/feed de produtos.
- Política para atualização automática de preço.

---

### 7.3 Admitad

A Admitad Brasil informa acesso a mais de **3.000 marcas em mais de 100 países** e sua store brasileira mostra centenas de programas, incluindo lojas virtuais.

#### Relevância para Ollibaby

Alta como rede complementar para ampliar cobertura. Pode ser útil para encontrar varejistas que não têm programa direto.

#### Pontos a validar

- Quais lojas brasileiras vendem fraldas, lenços e higiene infantil.
- Se há feed de produtos e deep links.
- Comissões reais por categoria.
- Janela de atribuição.
- Taxa de aprovação e cancelamento.

---

### 7.4 Kwanko

A Kwanko informa rede internacional com mais de **2.500 anunciantes** e campanhas em vários setores.

#### Relevância para Ollibaby

Média. Deve entrar no radar de discovery, mas a aderência específica ao varejo infantil no Brasil precisa ser validada.

---

### 7.5 Rakuten Advertising

A Rakuten Advertising é uma rede global de afiliados e performance. Pode ter anunciantes premium e ferramentas mais robustas.

#### Relevância para Ollibaby

Média. Vale mapear anunciantes disponíveis para Brasil, mas não deve ser prioridade antes de Amazon, Mercado Livre, Magalu, Awin, Lomadee e Admitad.

---

### 7.6 Outras possibilidades

Além das redes acima, o Ollibaby deve investigar:

- programas diretos de farmácias;
- programas diretos de supermercados;
- programas de cashback;
- plataformas de cupom;
- parcerias diretas com marcas de fraldas e lenços;
- retail media de marketplaces;
- API de ofertas de comparadores, quando permitida.

Possíveis varejistas a mapear:

- Drogasil / Droga Raia.
- Drogaria São Paulo / Pacheco.
- Panvel.
- Pague Menos.
- Carrefour.
- Pão de Açúcar.
- Extra.
- Assaí, quando aplicável online.
- Baby.com.br, se houver operação/afiliados ativos.
- Ri Happy.
- Época Cosméticos.
- Beleza na Web.
- Americanas, Casas Bahia e outros varejistas, com cautela conforme estabilidade comercial e programa disponível.

---

## 8. Estimativas de ticket e comissão

### 8.1 Premissas de ticket médio por categoria

Estas estimativas são conservadoras e devem ser validadas com dados reais do MVP.

| Categoria | Ticket típico por compra | Observação |
|---|---:|---|
| Fraldas | R$ 80 a R$ 220 | Kits e packs elevam ticket. |
| Lenços | R$ 25 a R$ 100 | Kits recorrentes têm melhor ticket. |
| Pomadas | R$ 25 a R$ 80 | Compra menos recorrente. |
| Fórmulas | R$ 60 a R$ 250 | Alto ticket, risco regulatório. |
| Vitaminas/suplementos | R$ 30 a R$ 120 | Depende de produto e recomendação profissional. |

### 8.2 Comissão média efetiva esperada

Embora alguns programas anunciem comissões “até” 12%, 13% ou 16%, a comissão efetiva real do Ollibaby deve ser estimada com desconto, por causa de:

- categorias com comissão menor;
- cancelamentos;
- pedidos não atribuídos;
- bloqueio por cupom de terceiros;
- produtos não comissionáveis;
- diferença entre clique e compra real;
- regras de janela de atribuição;
- variação por marketplace e campanha.

#### Cenários de comissão efetiva

| Cenário | Comissão efetiva sobre GMV influenciado |
|---|---:|
| Conservador | 3% |
| Base | 6% |
| Otimista | 9% |

Para planejamento, usar **6% como cenário-base** e **3% como cenário de sobrevivência**.

---

## 9. Funil financeiro estimado

### 9.1 Premissas de funil

| Métrica | Conservador | Base | Otimista |
|---|---:|---:|---:|
| CTR da página de oferta para lojista | 12% | 22% | 35% |
| Conversão pós-clique em compra | 1,5% | 3,0% | 5,0% |
| Ticket médio | R$ 90 | R$ 140 | R$ 180 |
| Comissão efetiva | 3% | 6% | 9% |
| Receita por 1.000 visitas | R$ 4,86 | R$ 55,44 | R$ 283,50 |

### 9.2 Interpretação

O funil é extremamente sensível a conversão e comissão.

No cenário conservador, 100.000 visitas/mês gerariam menos de R$ 500 de receita. No cenário-base, 100.000 visitas/mês gerariam cerca de R$ 5.544. No cenário otimista, o mesmo tráfego poderia gerar R$ 28.350.

Essa diferença mostra que o MVP precisa medir rapidamente:

- CTR real;
- conversão por marketplace;
- ticket real;
- comissão líquida;
- taxa de cancelamento;
- receita por sessão;
- receita por usuário recorrente.

---

## 10. Cenários de receita mensal

### 10.1 Receita baseada em visitas

| Visitas/mês | Conservador | Base | Otimista |
|---:|---:|---:|---:|
| 10.000 | R$ 49 | R$ 554 | R$ 2.835 |
| 50.000 | R$ 243 | R$ 2.772 | R$ 14.175 |
| 100.000 | R$ 486 | R$ 5.544 | R$ 28.350 |
| 250.000 | R$ 1.215 | R$ 13.860 | R$ 70.875 |
| 500.000 | R$ 2.430 | R$ 27.720 | R$ 141.750 |
| 1.000.000 | R$ 4.860 | R$ 55.440 | R$ 283.500 |

### 10.2 Receita baseada em usuários ativos

Premissas-base:

- 1 usuário ativo realiza 2 buscas relevantes/mês.
- 25% dos usuários ativos clicam em ofertas.
- 3% dos cliques viram compra.
- Ticket médio: R$ 140.
- Comissão efetiva: 6%.

| Usuários ativos mensais | Receita mensal estimada |
|---:|---:|
| 1.000 | R$ 126 |
| 5.000 | R$ 630 |
| 10.000 | R$ 1.260 |
| 25.000 | R$ 3.150 |
| 50.000 | R$ 6.300 |
| 100.000 | R$ 12.600 |

Essa visão é mais dura porque nem todo usuário ativo está no momento de compra. O estoque inteligente pode melhorar esse número porque antecipa o timing de compra.

---

## 11. Custo estimado do MVP

### 11.1 Custos mensais técnicos — MVP enxuto

| Item | Estimativa mensal |
|---|---:|
| Hospedagem web/API | R$ 100 a R$ 400 |
| Banco de dados / Supabase / Postgres | R$ 0 a R$ 300 |
| Jobs de scraping | R$ 100 a R$ 800 |
| APIs de busca | R$ 100 a R$ 500 |
| LLM/embeddings | R$ 50 a R$ 500 |
| Monitoramento/logs | R$ 0 a R$ 200 |
| Domínio/email/transacional | R$ 50 a R$ 200 |
| Proxy/browser remoto | R$ 0 a R$ 800 |
| Total | **R$ 400 a R$ 3.700/mês** |

### 11.2 Custos mensais — MVP com crescimento inicial

| Item | Estimativa mensal |
|---|---:|
| Infra web/API | R$ 500 a R$ 2.000 |
| Banco/cache/storage | R$ 300 a R$ 1.500 |
| Scraping/browser/proxy | R$ 1.000 a R$ 5.000 |
| APIs de busca | R$ 300 a R$ 2.000 |
| LLM/embeddings | R$ 300 a R$ 2.000 |
| Email/push | R$ 100 a R$ 800 |
| Observabilidade | R$ 200 a R$ 1.000 |
| Ferramentas de produto/analytics | R$ 200 a R$ 1.000 |
| Total | **R$ 2.900 a R$ 15.300/mês** |

### 11.3 Custo de WhatsApp

WhatsApp deve ser evitado como canal padrão no MVP.

Motivos:

- cobrança por mensagens/conversas conforme regras da plataforma;
- necessidade de templates;
- opt-in;
- potencial custo alto em alertas frequentes;
- risco de enviar alertas que não geram receita afiliada suficiente.

Recomendação:

- MVP: email + push web/app + dashboard.
- WhatsApp: apenas teste controlado para alertas críticos ou usuários engajados.
- Usar digest consolidado, não alerta unitário.

---

## 12. Break-even

### 12.1 Fórmula

```text
Visitas necessárias para break-even =
custo mensal / receita por visita
```

### 12.2 Break-even por cenário

Usando a receita por 1.000 visitas calculada anteriormente:

| Custo mensal | Conservador | Base | Otimista |
|---:|---:|---:|---:|
| R$ 1.000 | 205.761 visitas | 18.037 visitas | 3.527 visitas |
| R$ 3.000 | 617.284 visitas | 54.113 visitas | 10.582 visitas |
| R$ 5.000 | 1.028.807 visitas | 90.188 visitas | 17.637 visitas |
| R$ 10.000 | 2.057.613 visitas | 180.375 visitas | 35.273 visitas |
| R$ 15.000 | 3.086.420 visitas | 270.563 visitas | 52.910 visitas |

### 12.3 Leitura realista

O Ollibaby precisa operar no cenário-base para ser viável.

Se o funil real ficar próximo do cenário conservador, o produto não se sustenta financeiramente apenas com afiliados, a menos que tenha tráfego orgânico massivo e custo quase zero.

---

## 13. Unit economics por compra influenciada

### Cenário-base

```text
Ticket médio: R$ 140
Comissão efetiva: 6%
Receita por pedido: R$ 8,40
```

### Interpretação

Cada pedido afiliado no cenário-base gera cerca de **R$ 8,40** de receita.

Se o custo mensal for R$ 3.000, o Ollibaby precisará de aproximadamente:

```text
R$ 3.000 / R$ 8,40 = 358 pedidos comissionados/mês
```

Se o custo mensal for R$ 10.000:

```text
R$ 10.000 / R$ 8,40 = 1.191 pedidos comissionados/mês
```

### Conclusão

A sustentabilidade depende de gerar centenas a milhares de pedidos mensais comissionados. Isso é factível no médio prazo, mas improvável logo no lançamento sem tráfego orgânico ou audiência própria.

---

## 14. Impacto do estoque inteligente na receita

O buscador sozinho depende de intenção ativa: o usuário precisa lembrar de procurar.

O estoque inteligente aumenta a viabilidade porque cria momentos próprios de conversão:

- alerta de estoque baixo;
- alerta de preço bom;
- compra antecipada antes da urgência;
- lembrete de mudança de tamanho;
- recomendação de kit mais vantajoso.

### Hipótese financeira

Usuários com estoque cadastrado tendem a ter:

- maior retenção;
- mais compras influenciadas por mês;
- maior confiança;
- maior ticket;
- maior recorrência.

### Estimativa comparativa

| Tipo de usuário | Compras influenciadas/mês | Receita estimada/mês por usuário |
|---|---:|---:|
| Usuário ocasional do buscador | 0,02 a 0,05 | R$ 0,17 a R$ 0,42 |
| Usuário recorrente com alertas | 0,10 a 0,25 | R$ 0,84 a R$ 2,10 |
| Usuário altamente engajado com estoque | 0,30 a 0,60 | R$ 2,52 a R$ 5,04 |

O estoque inteligente pode multiplicar a receita por usuário, mas também aumenta complexidade, custos de produto e responsabilidade com dados.

---

## 15. Estratégia de aquisição

### 15.1 SEO programático

Provavelmente o canal mais importante.

Exemplos de páginas:

- “Fralda Pampers Confort Sec G menor preço”
- “Fralda Huggies Supreme Care XG preço por unidade”
- “Lenço umedecido Pampers 384 unidades preço por lenço”
- “Melhor preço fralda tamanho M”
- “Comparar fralda Pampers Pants vs Huggies Tripla Proteção”
- “Preço por fralda: como calcular”

### 15.2 Conteúdo utilitário

Conteúdo deve ser orientado à economia e organização, não apenas review genérico.

Exemplos:

- Como calcular preço por fralda.
- Quantas fraldas um bebê usa por dia.
- Como montar estoque de fraldas para gêmeos.
- Quando trocar tamanho de fralda.
- Como comparar kits de lenços umedecidos.
- Como economizar em fraldas sem comprar errado.

### 15.3 Comunidades

- Grupos de pais.
- Fóruns.
- Instagram/TikTok com conteúdo de economia.
- Parcerias com perfis parentais.
- Comunidades de gêmeos.
- Newsletter de ofertas.

### 15.4 Canais pagos

Não recomendados no MVP, exceto testes muito pequenos.

O afiliado dificilmente sustenta mídia paga ampla porque a margem por compra é baixa.

---

## 16. Riscos financeiros principais

### 16.1 Dependência de poucos afiliados

Amazon, Mercado Livre, Shopee e Magalu podem mudar regras, comissões ou aprovar/reprovar o projeto.

Mitigação:

- integrar múltiplas redes;
- manter ofertas não afiliadas;
- negociar parcerias diretas quando houver tração;
- criar base própria de dados e histórico de preço.

### 16.2 Baixa atribuição

Usuários podem clicar, comparar e comprar depois por outro caminho.

Mitigação:

- alertas com deep links;
- lista de favoritos;
- tracking por produto;
- cupom quando disponível;
- experiência de decisão rápida.

### 16.3 Comissão líquida menor que o esperado

A comissão anunciada não é comissão real. Cancelamentos, categorias não elegíveis e regras específicas reduzem receita.

Mitigação:

- acompanhar receita por marketplace e categoria;
- cortar fontes com baixa conversão;
- priorizar lojas com comissão comprovada;
- calcular ranking econômico interno.

### 16.4 Custo de scraping maior que receita

Scraping pode escalar mal se o produto tentar monitorar tudo.

Mitigação:

- começar com catálogo canônico pequeno;
- atualizar por demanda;
- priorizar produtos populares;
- usar busca + scraping seletivo;
- cache e revalidação inteligente;
- evitar renderização de navegador quando HTML simples resolve.

### 16.5 Frete inviabiliza oferta

Produto barato pode não ser a melhor compra se o frete for alto.

Mitigação:

- preço unitário com e sem frete;
- CEP opcional;
- ranking por preço total estimado;
- indicadores de frete grátis;
- alertar quando frete não foi validado.

### 16.6 Risco regulatório e reputacional

Fórmulas, vitaminas e dados infantis exigem cuidado.

Mitigação:

- MVP começa com fraldas e lenços;
- fórmulas entram com política editorial;
- sem recomendação médica;
- LGPD e consentimento desde o início.

---

## 17. Pontos críticos de validação do MVP

O MVP deve responder a perguntas objetivas.

### 17.1 Validação de demanda

- Pais pesquisam preços com frequência suficiente?
- Eles entendem e valorizam preço unitário?
- Eles confiam em um buscador nichado?
- Eles voltam ao produto sem app instalado?

### 17.2 Validação de monetização

- Qual CTR real para ofertas?
- Qual conversão pós-clique por marketplace?
- Qual ticket médio real?
- Qual comissão líquida por categoria?
- Qual receita por 1.000 sessões?
- Qual receita por usuário recorrente?

### 17.3 Validação de operação

- Qual custo por produto monitorado?
- Quantas ofertas quebram/desatualizam?
- Qual taxa de match incorreto?
- Quanto trabalho manual é necessário?
- Quais lojas bloqueiam scraping?

---

## 18. Métricas financeiras recomendadas

### Métricas primárias

- Receita por 1.000 sessões.
- Receita por usuário ativo mensal.
- Receita por produto monitorado.
- Receita por marketplace.
- Receita por categoria.
- CTR para lojistas.
- Conversão pós-clique.
- Comissão líquida efetiva.
- Custo mensal de scraping.
- Custo por oferta válida.

### Métricas de confiança

- Taxa de preço incorreto.
- Taxa de produto incorreto.
- Taxa de oferta indisponível.
- Taxa de clique com retorno negativo.
- Reclamações por 1.000 sessões.

### Métricas de retenção

- Usuários recorrentes em 7, 14 e 30 dias.
- Alertas criados.
- Produtos favoritados.
- Estoques cadastrados.
- Compras recorrentes influenciadas.

---

## 19. Modelo financeiro de 12 meses

### Premissas do cenário-base

- MVP lançado com fraldas e lenços.
- Crescimento orgânico via SEO e comunidades.
- Sem mídia paga relevante.
- Custo inicial baixo.
- Receita por 1.000 visitas: R$ 55,44.
- Custos sobem com tráfego e scraping.

| Mês | Visitas | Receita estimada | Custo estimado | Resultado |
|---:|---:|---:|---:|---:|
| 1 | 2.000 | R$ 111 | R$ 1.500 | -R$ 1.389 |
| 2 | 5.000 | R$ 277 | R$ 1.800 | -R$ 1.523 |
| 3 | 10.000 | R$ 554 | R$ 2.200 | -R$ 1.646 |
| 4 | 20.000 | R$ 1.109 | R$ 2.800 | -R$ 1.691 |
| 5 | 35.000 | R$ 1.940 | R$ 3.200 | -R$ 1.260 |
| 6 | 50.000 | R$ 2.772 | R$ 3.800 | -R$ 1.028 |
| 7 | 75.000 | R$ 4.158 | R$ 4.500 | -R$ 342 |
| 8 | 100.000 | R$ 5.544 | R$ 5.200 | R$ 344 |
| 9 | 130.000 | R$ 7.207 | R$ 6.000 | R$ 1.207 |
| 10 | 170.000 | R$ 9.425 | R$ 7.000 | R$ 2.425 |
| 11 | 220.000 | R$ 12.197 | R$ 8.000 | R$ 4.197 |
| 12 | 280.000 | R$ 15.523 | R$ 9.500 | R$ 6.023 |

### Leitura

No cenário-base, o Ollibaby pode chegar ao break-even entre os meses 7 e 9, mas isso depende de crescimento orgânico consistente e execução muito disciplinada.

---

## 20. Cenário ruim

### Premissas

- Receita por 1.000 visitas: R$ 4,86.
- SEO demora.
- Conversão pós-clique baixa.
- Comissão líquida baixa.
- Scraping consome mais tempo/custo que o previsto.

| Visitas/mês | Receita mensal |
|---:|---:|
| 50.000 | R$ 243 |
| 100.000 | R$ 486 |
| 250.000 | R$ 1.215 |
| 500.000 | R$ 2.430 |

### Conclusão do cenário ruim

Se os números reais ficarem próximos disso, o modelo 100% afiliado **não sustenta o produto**. Nesse caso, seria necessário:

- manter como side-project com custos mínimos;
- buscar patrocínios;
- vender inteligência de dados B2B;
- criar parcerias diretas;
- rever a restrição de monetização exclusivamente afiliada.

---

## 21. Cenário bom

### Premissas

- Receita por 1.000 visitas: R$ 283,50.
- Alta intenção de compra.
- Bom SEO.
- Usuários confiam no ranking.
- Mercado Livre/Amazon convertem bem.
- Estoque inteligente aumenta recorrência.

| Visitas/mês | Receita mensal |
|---:|---:|
| 50.000 | R$ 14.175 |
| 100.000 | R$ 28.350 |
| 250.000 | R$ 70.875 |
| 500.000 | R$ 141.750 |

### Conclusão do cenário bom

Nesse cenário, o Ollibaby vira um negócio altamente interessante, com potencial para reinvestir em app, IA, estoque inteligente e equipe.

Mas este cenário não deve ser usado como base de decisão. Ele deve ser tratado como upside.

---

## 22. Recomendação de escopo financeiro para o MVP

### Fazer

- Fraldas e lenços primeiro.
- Preço por unidade como diferencial central.
- Catálogo canônico manual/semi-manual dos produtos mais buscados.
- Amazon + Mercado Livre + Magalu + Shopee.
- Teste com Awin, Lomadee e Admitad.
- SEO programático desde o primeiro mês.
- Tracking completo de cliques, ofertas e receita.
- Ranking por preço unitário com e sem frete.
- Alertas por email/push.
- Estoque simples como segunda etapa.

### Não fazer no início

- App nativo.
- WhatsApp em massa.
- IA complexa de previsão.
- Scraping massivo de centenas de lojas.
- Fórmulas como categoria principal do MVP.
- Compra de mídia paga ampla.
- Cadastro obrigatório antes de buscar.
- Ranking patrocinado.

---

## 23. Roadmap financeiro recomendado

### Fase 0 — 2 a 4 semanas

Objetivo: preparar validação.

Entregas:

- mapear 100 a 300 produtos canônicos;
- mapear 4 programas diretos;
- cadastrar em Awin, Lomadee, Admitad e Kwanko;
- validar regras de cada programa;
- criar planilha de comissões por categoria;
- criar protótipo de página de produto/oferta;
- definir tracking.

### Fase 1 — 1 a 2 meses

Objetivo: validar matching e CTR.

Entregas:

- buscador público de fraldas e lenços;
- páginas SEO;
- links afiliados;
- histórico de preço;
- preço unitário;
- analytics de funil;
- botão de reportar erro.

Critério de continuidade:

- CTR para lojistas acima de 15%;
- erro de matching abaixo de 5%;
- receita por 1.000 sessões acima de R$ 20;
- custo mensal abaixo de R$ 3.000.

### Fase 2 — 3 a 6 meses

Objetivo: validar recorrência.

Entregas:

- favoritos;
- alertas de preço;
- cadastro simples de estoque;
- email/push;
- páginas programáticas por produto;
- expansão controlada de lojas.

Critério de continuidade:

- receita por 1.000 sessões acima de R$ 50;
- 20% dos usuários retornando em 30 dias;
- pelo menos 500 compras comissionadas acumuladas;
- três fontes de afiliado gerando receita.

### Fase 3 — 6 a 12 meses

Objetivo: escalar.

Entregas:

- estoque inteligente;
- modelos simples de consumo;
- expansão para pomadas;
- teste cauteloso com fórmulas;
- negociação direta com varejistas/marcas;
- programa de parceria com marcas, sem comprometer ranking.

Critério de continuidade:

- break-even mensal;
- receita mensal acima de R$ 10.000;
- CAC orgânico próximo de zero;
- infraestrutura sob controle;
- qualidade de dados comprovada.

---

## 24. Perguntas críticas para investidores

Um investidor provavelmente perguntará:

1. Por que pais usariam Ollibaby em vez de buscar direto na Amazon/Mercado Livre?
2. Qual é a barreira defensável do produto?
3. Como vocês evitam ser apenas um site de cupom?
4. Qual é a comissão líquida real?
5. Quanto tráfego vocês precisam para break-even?
6. Qual é o custo de scraping por oferta válida?
7. Como lidarão com frete e disponibilidade regional?
8. O que acontece se Amazon ou Mercado Livre mudarem regras?
9. O produto pode monetizar de outra forma sem cobrar dos pais?
10. Como vocês tratam dados de crianças e produtos regulados?

### Respostas recomendadas

A defesa do Ollibaby deve se apoiar em:

- curadoria especializada;
- preço unitário;
- matching de produto exato;
- estoque inteligente;
- alertas no momento certo;
- base proprietária de histórico de preço;
- confiança editorial;
- experiência desenhada para pais, não para compradores genéricos.

---

## 25. Possíveis extensões de monetização sem cobrar dos pais

Embora a premissa atual seja 100% afiliados, investidores podem gostar de ver opcionalidade futura.

Extensões compatíveis com gratuidade:

1. Parcerias diretas com varejistas.
2. Campanhas patrocinadas claramente identificadas.
3. Retail media com regras rígidas de transparência.
4. Dados agregados e anonimizados de tendência de preço.
5. Relatórios B2B para marcas, sem dados pessoais.
6. Cupons exclusivos.
7. Negociação de cashback ou benefício para famílias.
8. API de inteligência de preço para parceiros.

Atenção: qualquer monetização B2B deve preservar a confiança do usuário. O ranking principal não deve ser vendido.

---

## 26. Recomendação final

### Vale a pena fazer?

**Sim, vale construir o MVP.**

Mas a decisão correta não é “construir o produto completo”. A decisão correta é:

> Construir um MVP extremamente focado para testar se o Ollibaby consegue gerar tráfego qualificado, cliques, compras afiliadas e retenção com custo baixo.

### Vale a pena buscar investimento agora?

Para investimento tradicional, ainda é cedo. O ideal é primeiro ter:

- demo funcional;
- dados reais de CTR;
- dados reais de comissão;
- dados reais de receita por sessão;
- evidência de retenção;
- prova de que o matching é melhor que comparadores genéricos.

Para programas de incentivo, créditos de cloud e parcerias, **sim**, já faz sentido preparar material.

### Critérios objetivos de “go/no-go”

Após 90 dias de MVP público:

| Critério | Sinal verde | Sinal amarelo | Sinal vermelho |
|---|---:|---:|---:|
| Receita por 1.000 sessões | > R$ 50 | R$ 20–50 | < R$ 20 |
| CTR para lojistas | > 20% | 10–20% | < 10% |
| Match incorreto | < 3% | 3–8% | > 8% |
| Custo mensal | < R$ 3.000 | R$ 3.000–6.000 | > R$ 6.000 sem receita |
| Retenção 30 dias | > 20% | 10–20% | < 10% |
| Fontes afiliadas ativas | 3+ | 2 | 1 ou nenhuma |
| Receita mensal | > R$ 2.000 | R$ 500–2.000 | < R$ 500 |

### Decisão recomendada

Construir por etapas:

1. **MVP buscador de fraldas e lenços.**
2. **Validação financeira com afiliados.**
3. **Estoque simples para aumentar recorrência.**
4. **Expansão de categorias apenas depois de provar unit economics.**

O Ollibaby tem chance real se for tratado como um produto de confiança e recorrência, não como um agregador genérico de ofertas.

---

## 27. Anexos

### 27.1 Fórmulas usadas

```text
Receita por 1.000 visitas =
1000 × CTR × conversão pós-clique × ticket médio × comissão efetiva
```

```text
Receita por pedido =
ticket médio × comissão efetiva
```

```text
Pedidos necessários para break-even =
custo mensal / receita por pedido
```

```text
Visitas necessárias para break-even =
custo mensal / receita por visita
```

### 27.2 Premissas que precisam ser substituídas por dados reais

- CTR por marketplace.
- Conversão pós-clique.
- Comissão líquida real.
- Ticket médio real.
- Taxa de cancelamento.
- Receita por categoria.
- Custo por scrape.
- Custo por oferta válida.
- Taxa de erro de matching.
- Retenção do usuário.
- Impacto de alertas na conversão.

---

## 28. Conclusão executiva para pitch

O Ollibaby atua em uma dor recorrente de milhões de famílias brasileiras: economizar e se organizar na compra de produtos essenciais para bebês e crianças. O modelo gratuito com monetização por afiliados é financeiramente possível, mas depende de alta eficiência em tráfego orgânico, curadoria de ofertas e conversão.

O MVP deve provar que pais confiam mais em um buscador especializado, com preço unitário real e matching preciso, do que em buscas genéricas de marketplace. Se essa hipótese for validada, o estoque inteligente pode transformar o Ollibaby de comparador pontual em assistente recorrente de compra, aumentando retenção e receita por usuário.

A recomendação é avançar com MVP enxuto, metas financeiras claras e disciplina rigorosa de custos.
