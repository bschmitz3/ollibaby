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
  const totalPriceInCents = offer.totalPriceInCents ?? offer.priceInCents;
  const effectiveUnitPriceInCents = getEffectiveUnitPriceInCents(offer);

  const totalPriceLabel = formatCurrencyFromCents(totalPriceInCents);
  const unitPriceLabel = formatUnitPriceFromCents(
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
        <p className="text-base font-semibold text-[#2F261F]">{unitPriceLabel}</p>
        <p className="mt-1 text-sm text-[#6B5E54]">Total: {totalPriceLabel}</p>

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

