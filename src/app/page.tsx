import { ComparisonExplainer } from "@/components/comparison-explainer";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form";
import { TrackedLink } from "@/components/tracked-link";
import { mockOffers } from "@/data/mock-offers";
import { searchCanonicalProducts } from "@/lib/catalog/search";
import { getRankedOffersForProduct } from "@/lib/offers";
import Link from "next/link";

type CategoryFilter = "all" | "diaper" | "wet_wipe";
type OfferAvailabilityFilter = "all" | "with_offer" | "without_offer";

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "diaper", label: "Fraldas" },
  { value: "wet_wipe", label: "Lenços" },
];

const OFFER_AVAILABILITY_FILTERS: Array<{
  value: OfferAvailabilityFilter;
  label: string;
}> = [
  { value: "all", label: "Todos" },
  { value: "with_offer", label: "Com oferta" },
  { value: "without_offer", label: "Sem oferta" },
];

function getCategoryFilterClassName(isActive: boolean): string {
  return isActive
    ? "rounded-full bg-[#2F261F] px-3 py-1 font-medium text-white"
    : "rounded-full border border-[#E8D7C5] bg-white px-3 py-1 font-medium text-[#7A5C3E]";
}

function getSecondaryFilterClassName(isActive: boolean): string {
  return isActive
    ? "rounded-full bg-[#2F261F] px-3 py-1 text-xs font-semibold text-white"
    : "rounded-full border border-[#E8D7C5] bg-white px-3 py-1 text-xs font-semibold text-[#6B5E54]";
}

function normalizeCategoryFilter(value: string | undefined): CategoryFilter {
  if (value === "diaper") return "diaper";
  if (value === "wet_wipe") return "wet_wipe";
  return "all";
}

function normalizeOfferAvailabilityFilter(
  value: string | undefined,
): OfferAvailabilityFilter {
  if (value === "with_offer") return "with_offer";
  if (value === "without_offer") return "without_offer";
  return "all";
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildHomeHref(params: {
  q?: string;
  category?: CategoryFilter;
  offerAvailability?: OfferAvailabilityFilter;
  brand?: string;
  size?: string;
}): string {
  const searchParams = new URLSearchParams();

  if (params.q && params.q.trim().length > 0) {
    searchParams.set("q", params.q.trim());
  }

  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }

  if (params.offerAvailability && params.offerAvailability !== "all") {
    searchParams.set("offerAvailability", params.offerAvailability);
  }

  if (params.brand && params.brand.trim().length > 0) {
    searchParams.set("brand", params.brand.trim());
  }

  if (params.size && params.size.trim().length > 0) {
    searchParams.set("size", params.size.trim());
  }

  const qs = searchParams.toString();
  return qs.length > 0 ? `/?${qs}` : "/";
}

function getUniqueBrands(products: Array<{ brand: string }>): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.brand.trim().length > 0) set.add(p.brand.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function getUniqueSizes(products: Array<{ size?: string }>): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.size && p.size.trim().length > 0) set.add(p.size.trim());
  }

  const preferredOrder = ["RN", "P", "M", "G", "XG", "XXG", "XXXG"];

  return Array.from(set).sort((a, b) => {
    const aIdx = preferredOrder.indexOf(a);
    const bIdx = preferredOrder.indexOf(b);
    const aRank = aIdx === -1 ? Number.POSITIVE_INFINITY : aIdx;
    const bRank = bIdx === -1 ? Number.POSITIVE_INFINITY : bIdx;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b, "pt-BR");
  });
}

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const qRaw = resolvedSearchParams?.q;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw ?? "").trim();
  const hasSearch = q.length > 0;

  const categoryRaw = resolvedSearchParams?.category;
  const categoryValue = Array.isArray(categoryRaw)
    ? categoryRaw[0]
    : categoryRaw ?? undefined;
  const category = normalizeCategoryFilter(categoryValue);

  const offerAvailabilityRaw = resolvedSearchParams?.offerAvailability;
  const offerAvailabilityValue = Array.isArray(offerAvailabilityRaw)
    ? offerAvailabilityRaw[0]
    : offerAvailabilityRaw ?? undefined;
  const offerAvailability = normalizeOfferAvailabilityFilter(offerAvailabilityValue);

  const brandRaw = resolvedSearchParams?.brand;
  const brandValue = Array.isArray(brandRaw) ? brandRaw[0] : brandRaw ?? undefined;
  const brand = normalizeOptionalText(brandValue);

  const sizeRaw = resolvedSearchParams?.size;
  const sizeValue = Array.isArray(sizeRaw) ? sizeRaw[0] : sizeRaw ?? undefined;
  const size = normalizeOptionalText(sizeValue);

  const shouldShowSizeFilter = category !== "wet_wipe";
  const effectiveSize = shouldShowSizeFilter ? size : undefined;

  const activeFilterLabels: string[] = [];
  if (hasSearch) {
    activeFilterLabels.push(`Busca: "${q}"`);
  }
  if (category === "diaper") {
    activeFilterLabels.push("Fraldas");
  } else if (category === "wet_wipe") {
    activeFilterLabels.push("Lenços");
  }
  if (offerAvailability === "with_offer") {
    activeFilterLabels.push("Com oferta");
  } else if (offerAvailability === "without_offer") {
    activeFilterLabels.push("Sem oferta");
  }
  if (brand) {
    activeFilterLabels.push(`Marca: ${brand}`);
  }
  if (effectiveSize) {
    activeFilterLabels.push(`Tamanho: ${effectiveSize}`);
  }

  const searchedProducts = searchCanonicalProducts(q);
  const categoryFiltered =
    category === "all"
      ? searchedProducts
      : searchedProducts.filter((p) => p.category === category);

  const brandFiltered = brand
    ? categoryFiltered.filter((p) => p.brand === brand)
    : categoryFiltered;

  const sizeFiltered = effectiveSize
    ? brandFiltered.filter((p) => (p.size ? String(p.size) : "") === effectiveSize)
    : brandFiltered;

  const availableBrands = getUniqueBrands(categoryFiltered);
  const availableSizes = shouldShowSizeFilter
    ? getUniqueSizes(
        categoryFiltered.map((p) => ({
          size: p.size ? String(p.size) : undefined,
        })),
      )
    : [];

  const productsWithBestOffer = sizeFiltered.map((product) => {
    const rankedOffers = getRankedOffersForProduct(mockOffers, product.id);
    const bestOffer = rankedOffers[0];
    return {
      product,
      bestOffer,
      rankedOffersCount: rankedOffers.length,
    };
  });

  const offerAvailabilityFiltered =
    offerAvailability === "with_offer"
      ? productsWithBestOffer.filter((p) => p.rankedOffersCount > 0)
      : offerAvailability === "without_offer"
        ? productsWithBestOffer.filter((p) => p.rankedOffersCount === 0)
        : productsWithBestOffer;

  const hasAnyNonSearchFilterActive =
    category !== "all" ||
    offerAvailability !== "all" ||
    brand !== undefined ||
    effectiveSize !== undefined;

  const hasAnyFilterOrSearchActive = hasSearch || hasAnyNonSearchFilterActive;

  return (
    <main className="min-h-screen bg-[#FFF8F1] text-[#2F261F]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#7A5C3E] shadow-sm">
          MVP em construção
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Ollibaby
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F5147] sm:text-xl">
          Compare fraldas e lenços umedecidos pelo preço real por unidade, sem
          se confundir com kits, pacotes, linhas e tamanhos.
        </p>

        <div className="mt-10 w-full max-w-2xl rounded-3xl bg-white p-3 shadow-lg shadow-[#E8D7C5]/60">
          <SearchForm
            defaultQuery={q}
            category={category}
            offerAvailability={offerAvailability}
            brand={brand}
            size={effectiveSize}
          />
        </div>

        <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 text-left shadow-sm">
            <h2 className="font-semibold">Fraldas</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
              Compare pacotes e kits por R$/fralda, considerando tamanho, linha
              e quantidade.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-left shadow-sm">
            <h2 className="font-semibold">Lenços umedecidos</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
              Compare pacotes, refis e kits por R$/lenço, usando a quantidade
              total correta.
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-6 text-[#7A6B60]">
          Alguns links poderão gerar comissão para o Ollibaby. Isso não altera o
          preço para você e não deve influenciar a curadoria das melhores
          ofertas.
        </p>
      </section>

      <ComparisonExplainer />

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-[#E8D7C5]/60 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Produtos monitorados no MVP
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B5E54] sm:text-base">
            Dados mockados para validar catálogo canônico, preço unitário e
            ranking de ofertas antes de conectar banco, scraping e afiliados
            reais.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {CATEGORY_FILTERS.map((filter) => {
              const nextCategory = filter.value;
              const shouldKeepSizeForNextCategory = nextCategory !== "wet_wipe";

              return (
                <TrackedLink
                  key={filter.value}
                  href={buildHomeHref({
                    q: hasSearch ? q : undefined,
                    category: nextCategory,
                    offerAvailability,
                    brand,
                    size: shouldKeepSizeForNextCategory ? effectiveSize : undefined,
                  })}
                  className={getCategoryFilterClassName(category === filter.value)}
                  eventName="category_filter_clicked"
                  eventPayload={{
                    q,
                    hasSearch,
                    category,
                    brand,
                    size: effectiveSize,
                    offerAvailability,
                    clickedCategory: nextCategory,
                  }}
                >
                  {filter.label}
                </TrackedLink>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6B5E54]">
                Ofertas
              </span>
              {OFFER_AVAILABILITY_FILTERS.map((filter) => (
                <TrackedLink
                  key={filter.value}
                  href={buildHomeHref({
                    q: hasSearch ? q : undefined,
                    category,
                    offerAvailability: filter.value,
                    brand,
                    size: effectiveSize,
                  })}
                  className={getSecondaryFilterClassName(
                    offerAvailability === filter.value,
                  )}
                  eventName="offer_availability_filter_clicked"
                  eventPayload={{
                    q,
                    hasSearch,
                    category,
                    brand,
                    size,
                    offerAvailability,
                    clickedOfferAvailability: filter.value,
                  }}
                >
                  {filter.label}
                </TrackedLink>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6B5E54]">
                Marca
              </span>
              <TrackedLink
                href={buildHomeHref({
                  q: hasSearch ? q : undefined,
                  category,
                  offerAvailability,
                  size: effectiveSize,
                })}
                className={getSecondaryFilterClassName(brand === undefined)}
                eventName="brand_filter_clicked"
                eventPayload={{
                  q,
                  hasSearch,
                  category,
                  brand,
                  size,
                  offerAvailability,
                  clickedBrand: "all",
                }}
              >
                Todas
              </TrackedLink>
              {availableBrands.map((b) => (
                <TrackedLink
                  key={b}
                  href={buildHomeHref({
                    q: hasSearch ? q : undefined,
                    category,
                    offerAvailability,
                    brand: b,
                    size: effectiveSize,
                  })}
                  className={getSecondaryFilterClassName(brand === b)}
                  eventName="brand_filter_clicked"
                  eventPayload={{
                    q,
                    hasSearch,
                    category,
                    brand,
                    size,
                    offerAvailability,
                    clickedBrand: b,
                  }}
                >
                  {b}
                </TrackedLink>
              ))}
            </div>

            {shouldShowSizeFilter ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6B5E54]">
                  Tamanho
                </span>
                <TrackedLink
                  href={buildHomeHref({
                    q: hasSearch ? q : undefined,
                    category,
                    offerAvailability,
                    brand,
                  })}
                  className={getSecondaryFilterClassName(effectiveSize === undefined)}
                  eventName="size_filter_clicked"
                  eventPayload={{
                    q,
                    hasSearch,
                    category,
                    brand,
                    size: effectiveSize,
                    offerAvailability,
                    clickedSize: "all",
                  }}
                >
                  Todos
                </TrackedLink>
                {availableSizes.map((s) => (
                  <TrackedLink
                    key={s}
                    href={buildHomeHref({
                      q: hasSearch ? q : undefined,
                      category,
                      offerAvailability,
                      brand,
                      size: s,
                    })}
                    className={getSecondaryFilterClassName(effectiveSize === s)}
                    eventName="size_filter_clicked"
                    eventPayload={{
                      q,
                      hasSearch,
                      category,
                      brand,
                      size: effectiveSize,
                      offerAvailability,
                      clickedSize: s,
                    }}
                  >
                    {s}
                  </TrackedLink>
                ))}
              </div>
            ) : null}
          </div>

          {activeFilterLabels.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B5E54]">
                Filtros ativos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[#E8D7C5] bg-[#FFFDF9] px-3 py-1 text-xs font-semibold text-[#6B5E54]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 text-sm text-[#6B5E54] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              {hasSearch ? (
                <p>
                  Busca por:{" "}
                  <span className="font-medium">{`"${q}"`}</span>
                </p>
              ) : null}
              <p>
                {offerAvailabilityFiltered.length}{" "}
                {offerAvailabilityFiltered.length === 1 ? "produto" : "produtos"}{" "}
                encontrado{offerAvailabilityFiltered.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {hasSearch ? (
                <Link
                  href={buildHomeHref({
                    category,
                    offerAvailability,
                    brand,
                    size: effectiveSize,
                  })}
                  className="text-[#7A5C3E] underline"
                >
                  Limpar busca
                </Link>
              ) : null}

              {hasAnyNonSearchFilterActive ? (
                <Link
                  href={buildHomeHref({
                    q: hasSearch ? q : undefined,
                  })}
                  className="text-[#7A5C3E] underline"
                >
                  Limpar filtros
                </Link>
              ) : null}
            </div>
          </div>

          {offerAvailabilityFiltered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-6 text-left">
              <h3 className="text-base font-semibold text-[#2F261F]">
                {hasAnyFilterOrSearchActive
                  ? "Nenhum produto encontrado com a busca e filtros atuais."
                  : "Nenhum produto disponível no catálogo mockado."}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
                {hasAnyFilterOrSearchActive
                  ? "Tente remover marca, tamanho, disponibilidade de oferta ou ajustar a busca."
                  : "Tente novamente em alguns instantes."}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <Link href="/" className="text-[#7A5C3E] underline">
                  Ver todos os produtos
                </Link>
                {hasSearch ? (
                  <Link
                    href={buildHomeHref({
                      category,
                      offerAvailability,
                      brand,
                      size: effectiveSize,
                    })}
                    className="text-[#7A5C3E] underline"
                  >
                    Limpar busca
                  </Link>
                ) : null}
                {hasAnyNonSearchFilterActive ? (
                  <Link
                    href={buildHomeHref({
                      q: hasSearch ? q : undefined,
                    })}
                    className="text-[#7A5C3E] underline"
                  >
                    Limpar filtros
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {offerAvailabilityFiltered.map(
                ({ product, bestOffer, rankedOffersCount }) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    bestOffer={bestOffer}
                    rankedOffersCount={rankedOffersCount}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
