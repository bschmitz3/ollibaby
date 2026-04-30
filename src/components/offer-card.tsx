import type { Offer } from "@/types/offer";
import {
  formatCurrencyFromCents,
  formatUnitPriceFromCents,
} from "@/lib/formatters";
import { getEffectiveUnitPriceInCents } from "@/lib/offers";

export type OfferCardProps = {
  offer: Offer;
  rank: number;
};

export function OfferCard({ offer, rank }: OfferCardProps) {
  const effectiveUnitPriceInCents = getEffectiveUnitPriceInCents(offer);

  const productPriceLabel = formatCurrencyFromCents(offer.priceInCents);

  const shippingLabel =
    offer.shippingPriceInCents === undefined
      ? "Frete: não informado"
      : offer.shippingPriceInCents === 0
        ? "Frete: grátis"
        : `Frete: ${formatCurrencyFromCents(offer.shippingPriceInCents)}`;

  const totalConsideredInCents = offer.totalPriceInCents ?? offer.priceInCents;
  const totalConsideredLabel = formatCurrencyFromCents(totalConsideredInCents);

  const unitPriceWithoutShippingLabel = formatUnitPriceFromCents(
    offer.unitPriceWithoutShippingInCents,
    offer.unitType,
  );

  const unitPriceWithShippingLabel =
    offer.unitPriceWithShippingInCents === undefined
      ? "não informado"
      : formatUnitPriceFromCents(offer.unitPriceWithShippingInCents, offer.unitType);

  const effectiveUnitPriceLabel = formatUnitPriceFromCents(
    effectiveUnitPriceInCents,
    offer.unitType,
  );

  const affiliateLabel = offer.isAffiliate ? "Afiliado" : "Não afiliado";
  const matchPercent = Math.round(offer.matchConfidence * 100);
  const quantityPercent = Math.round(offer.quantityConfidence * 100);

  const offerUrl = offer.affiliateUrl ?? offer.url;

  return (
    <div className="rounded-2xl border border-[#E8D7C5] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#7A5C3E]">
            #{rank} · {affiliateLabel}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-6 text-[#2F261F]">
            {offer.titleRaw}
          </h3>
        </div>

        <a
          href={offerUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-xl bg-[#2F261F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4A382B]"
        >
          Ver oferta
        </a>
      </div>

      <div className="mt-4 rounded-2xl bg-[#FFFDF9] p-4">
        <p className="text-xs font-medium text-[#6B5E54]">Preço usado no ranking</p>
        <p className="mt-1 text-base font-semibold text-[#2F261F]">
          {effectiveUnitPriceLabel}
        </p>
        <p className="mt-1 text-sm text-[#6B5E54]">
          {offer.unitPriceWithShippingInCents === undefined
            ? "Ranking considera apenas o preço do produto, pois o frete não foi informado."
            : "Ranking considera produto + frete."}
        </p>

        <div className="mt-4 grid gap-1 text-sm text-[#6B5E54]">
          <p>Preço do produto: {productPriceLabel}</p>
          <p>{shippingLabel}</p>
          <p>Total considerado: {totalConsideredLabel}</p>
          <p>Preço por unidade (sem frete): {unitPriceWithoutShippingLabel}</p>
          <p>Preço por unidade (com frete): {unitPriceWithShippingLabel}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6B5E54]">
          <span className="rounded-full border border-[#E8D7C5] bg-white px-3 py-1">
            Match: {matchPercent}%
          </span>
          <span className="rounded-full border border-[#E8D7C5] bg-white px-3 py-1">
            Quantidade: {quantityPercent}%
          </span>
          <span className="rounded-full border border-[#E8D7C5] bg-white px-3 py-1">
            Disponibilidade: {offer.availabilityStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

