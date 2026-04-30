import Link from "next/link";
import { notFound } from "next/navigation";

import { OfferCard } from "@/components/offer-card";
import { mockOffers } from "@/data/mock-offers";
import { getCanonicalProducts } from "@/lib/catalog/search";
import { getRankedOffersForProduct } from "@/lib/offers";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const products = getCanonicalProducts();
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const rankedOffers = getRankedOffersForProduct(mockOffers, product.id);

  const hasLine = product.line.trim().length > 0;
  const sizeLabel = product.size ? String(product.size) : undefined;
  const unitLabel = product.unitType === "diaper" ? "fraldas" : "lenços";

  return (
    <main className="min-h-screen bg-[#FFF8F1] text-[#2F261F]">
      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm font-medium text-[#7A5C3E] underline">
          Voltar
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg shadow-[#E8D7C5]/60 sm:p-10">
          <p className="text-sm font-semibold text-[#7A5C3E]">
            {product.brand}
            {hasLine ? ` · ${product.line}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6B5E54]">
            {sizeLabel ? (
              <span className="rounded-full bg-[#FFF8F1] px-2.5 py-1">
                Tamanho {sizeLabel}
              </span>
            ) : null}
            <span className="rounded-full bg-[#FFF8F1] px-2.5 py-1">
              {product.quantity} {unitLabel}
            </span>
          </div>

          <p className="mt-6 text-sm leading-6 text-[#6B5E54]">
            As ofertas abaixo ainda são mockadas e existem apenas para validar o
            ranking por preço unitário antes de conectar scraping, banco e
            afiliados reais.
          </p>

          <div className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Ofertas ranqueadas
            </h2>

            <p className="mt-2 text-sm text-[#6B5E54]">
              {rankedOffers.length > 0
                ? rankedOffers.length === 1
                  ? "1 oferta ranqueável encontrada para este produto."
                  : `${rankedOffers.length} ofertas ranqueáveis encontradas para este produto.`
                : "Ainda não há ofertas mockadas para este produto."}
            </p>

            {rankedOffers.length > 0 ? (
              <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
                A primeira oferta é a melhor pelo menor preço unitário efetivo entre
                as ofertas elegíveis.
              </p>
            ) : null}

            {rankedOffers.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-6">
                <p className="text-sm text-[#6B5E54]">
                  Nenhuma oferta ranqueável encontrada para este produto ainda.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {rankedOffers.map((offer, idx) => (
                  <OfferCard key={offer.id} offer={offer} rank={idx + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

