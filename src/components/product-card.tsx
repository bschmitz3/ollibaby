import type { CanonicalProduct } from "@/types/product";
import type { Offer } from "@/types/offer";
import {
  formatCurrencyFromCents,
  formatUnitPriceFromCents,
} from "@/lib/formatters";
import { getEffectiveUnitPriceInCents } from "@/lib/offers";
import Link from "next/link";

export type ProductCardProps = {
  product: CanonicalProduct;
  bestOffer?: Offer;
  rankedOffersCount?: number;
};

export function ProductCard({
  product,
  bestOffer,
  rankedOffersCount,
}: ProductCardProps) {
  const hasBestOffer = bestOffer !== undefined;

  const sizeLabel = product.size ? String(product.size) : undefined;
  const unitLabel = product.unitType === "diaper" ? "fraldas" : "lenços";
  const quantityLabel = `${product.quantity} ${unitLabel}`;

  const effectiveUnitPriceInCents = hasBestOffer
    ? getEffectiveUnitPriceInCents(bestOffer)
    : undefined;

  const unitPriceLabel =
    hasBestOffer && effectiveUnitPriceInCents !== undefined
      ? formatUnitPriceFromCents(effectiveUnitPriceInCents, product.unitType)
      : undefined;

  const totalPriceInCents = hasBestOffer
    ? bestOffer.totalPriceInCents ?? bestOffer.priceInCents
    : undefined;

  const totalPriceLabel =
    hasBestOffer && totalPriceInCents !== undefined
      ? formatCurrencyFromCents(totalPriceInCents)
      : undefined;

  const affiliateLabel = hasBestOffer
    ? bestOffer.isAffiliate
      ? "Afiliado"
      : "Não afiliado"
    : undefined;

  const matchPercent = hasBestOffer
    ? Math.round(bestOffer.matchConfidence * 100)
    : undefined;
  const quantityPercent = hasBestOffer
    ? Math.round(bestOffer.quantityConfidence * 100)
    : undefined;

  return (
    <div className="rounded-2xl border border-[#E8D7C5] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#7A5C3E]">
          {product.brand} · {product.line}
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-[#2F261F]">
          {product.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#6B5E54]">
          {sizeLabel ? (
            <span className="rounded-full bg-[#FFF8F1] px-2.5 py-1">
              Tamanho {sizeLabel}
            </span>
          ) : null}
          <span className="rounded-full bg-[#FFF8F1] px-2.5 py-1">
            {quantityLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#FFFDF9] p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {hasBestOffer ? (
            <>
              <span className="rounded-full bg-[#2F261F] px-3 py-1 text-xs font-semibold text-white">
                Melhor oferta
              </span>
              {rankedOffersCount !== undefined ? (
                <span className="rounded-full border border-[#E8D7C5] bg-white px-3 py-1 text-xs font-medium text-[#6B5E54]">
                  {rankedOffersCount === 1
                    ? "1 oferta ranqueável"
                    : `${rankedOffersCount} ofertas ranqueáveis`}
                </span>
              ) : null}
            </>
          ) : (
            <span className="rounded-full border border-[#D4C4B4] bg-[#FFF8F1] px-3 py-1 text-xs font-medium text-[#6B5E54]">
              Sem oferta no mock
            </span>
          )}
        </div>

        {hasBestOffer ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#2F261F]">
                Melhor oferta encontrada
              </p>

              {affiliateLabel ? (
                <span className="rounded-full border border-[#E8D7C5] bg-white px-3 py-1 text-xs font-medium text-[#6B5E54]">
                  {affiliateLabel}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[#2F261F]">
                {unitPriceLabel}
              </p>
              <p className="text-sm text-[#6B5E54]">
                Total: {totalPriceLabel}
              </p>
            </div>

            <p className="text-sm text-[#6B5E54]">
              Match: {matchPercent}% · Quantidade: {quantityPercent}%
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#6B5E54]">
            Nenhuma oferta confiável encontrada ainda.
          </p>
        )}
      </div>

      <div className="mt-4">
        <Link
          href={`/produtos/${product.id}`}
          className="text-sm font-medium text-[#7A5C3E] underline"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
