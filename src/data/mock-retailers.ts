import type { Retailer } from "@/types/offer";

export const mockRetailers: Retailer[] = [
  {
    id: "rt_amazon_br",
    name: "Amazon Brasil",
    type: "marketplace",
    websiteUrl: "https://example.com/retailers/amazon-br",
    isAffiliateEnabled: true,
    reliabilityScore: 0.95,
  },
  {
    id: "rt_mercado_livre",
    name: "Mercado Livre",
    type: "marketplace",
    websiteUrl: "https://example.com/retailers/mercado-livre",
    isAffiliateEnabled: true,
    reliabilityScore: 0.93,
  },
  {
    id: "rt_drogaria_exemplo",
    name: "Drogaria Exemplo",
    type: "pharmacy",
    websiteUrl: "https://example.com/retailers/drogaria-exemplo",
    isAffiliateEnabled: false,
    reliabilityScore: 0.82,
  },
  {
    id: "rt_loja_bebe_exemplo",
    name: "Loja Bebê Exemplo",
    type: "store",
    websiteUrl: "https://example.com/retailers/loja-bebe-exemplo",
    isAffiliateEnabled: false,
    reliabilityScore: 0.8,
  },
];
