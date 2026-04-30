import { canonicalProducts as catalogProducts } from "@/data/catalog/canonical-products";
import type { CanonicalProduct as AppCanonicalProduct, ProductCategory } from "@/types/product";

function normalizeSearchText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function toAppProduct(product: (typeof catalogProducts)[number]): AppCanonicalProduct {
  return {
    id: product.id,
    category: product.category === "wipe" ? "wet_wipe" : "diaper",
    brand: product.brand,
    line: product.line ?? "",
    name: product.name,
    size: product.size ?? undefined,
    type:
      product.category === "diaper"
        ? `${product.diaperType ?? ""}/${product.usageType ?? ""}`.replace(/\/$/, "")
        : `${product.wipeType ?? ""}` || undefined,
    weightRange: product.weightRange ?? undefined,
    quantity: product.quantity,
    unitType: product.unitType === "fralda" ? "diaper" : "wipe",
    eanGtin: product.eanGtin ?? undefined,
    imageUrl: product.imageReferenceUrl ?? undefined,
    synonyms: product.synonyms ?? [],
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function getCanonicalProducts(): AppCanonicalProduct[] {
  return catalogProducts.map(toAppProduct);
}

export function getCanonicalProductsByCategory(category: ProductCategory): AppCanonicalProduct[] {
  return getCanonicalProducts().filter((p) => p.category === category);
}

export function searchCanonicalProducts(query: string): AppCanonicalProduct[] {
  const q = normalizeSearchText(query);
  if (q.length === 0) return getCanonicalProducts();

  const products = getCanonicalProducts();
  return products.filter((p) => {
    const haystacks = [
      p.brand,
      p.line,
      p.name,
      p.size ? String(p.size) : "",
      ...(p.synonyms ?? []),
    ].map((x) => normalizeSearchText(String(x)));

    return haystacks.some((h) => h.includes(q));
  });
}

