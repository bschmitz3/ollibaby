import type { MetadataRoute } from "next";

import { getCanonicalProducts } from "@/lib/catalog/search";
import { getSiteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const products = getCanonicalProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produtos/${encodeURIComponent(product.id)}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
  }));

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productEntries,
  ];
}
