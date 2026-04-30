import type { UnitType } from "@/types/product";
import { formatUnitPriceFromCents } from "@/lib/formatters";
import {
  classifyCurrentUnitPrice,
  getPriceHistoryForProduct,
} from "@/lib/price-history";

export type PriceHistorySummaryProps = {
  productId: string;
  currentUnitPriceInCents?: number;
  unitType: UnitType;
};

function getSignalCopy(signal: ReturnType<typeof classifyCurrentUnitPrice>["signal"]) {
  if (signal === "good") return "Preço atual parece bom";
  if (signal === "average") return "Preço atual está na média";
  if (signal === "high") return "Preço atual parece alto";
  if (signal === "unknown") return "Histórico insuficiente";
  return "Histórico insuficiente";
}

function getSignalBadgeClasses(
  signal: ReturnType<typeof classifyCurrentUnitPrice>["signal"],
): string {
  if (signal === "good") return "bg-[#2F261F] text-white";
  if (signal === "average")
    return "border border-[#E8D7C5] bg-white text-[#6B5E54]";
  if (signal === "high") return "border border-[#E8D7C5] bg-[#FFF8F1] text-[#6B5E54]";
  return "border border-[#E8D7C5] bg-white text-[#6B5E54]";
}

export function PriceHistorySummary({
  productId,
  currentUnitPriceInCents,
  unitType,
}: PriceHistorySummaryProps) {
  const points = getPriceHistoryForProduct(productId);

  const classification = classifyCurrentUnitPrice({
    currentUnitPriceInCents,
    historicalPoints: points,
  });

  const hasHistory = points.length >= 2;
  const hasCurrentPrice =
    currentUnitPriceInCents !== undefined && Number.isFinite(currentUnitPriceInCents);

  if (!hasHistory || !hasCurrentPrice) {
    return (
      <div className="mt-6 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-5">
        <h2 className="text-sm font-semibold text-[#2F261F]">Histórico de preço</h2>
        <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
          Histórico de preço ainda indisponível para este produto.
        </p>
      </div>
    );
  }

  const currentLabel = formatUnitPriceFromCents(currentUnitPriceInCents!, unitType);
  const averageLabel =
    classification.averageUnitPriceInCents === undefined
      ? undefined
      : formatUnitPriceFromCents(classification.averageUnitPriceInCents, unitType);

  const diffLabel =
    classification.differencePercent === undefined
      ? undefined
      : `${classification.differencePercent > 0 ? "+" : ""}${classification.differencePercent}%`;

  const latestPoints = points.slice(-3).reverse();

  return (
    <div className="mt-6 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#2F261F]">Histórico de preço</h2>
          <p className="mt-1 text-sm text-[#6B5E54]">{getSignalCopy(classification.signal)}</p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSignalBadgeClasses(
            classification.signal,
          )}`}
        >
          {classification.signal.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#6B5E54] sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8D7C5] bg-white p-4">
          <p className="text-xs font-medium">Preço atual</p>
          <p className="mt-1 font-semibold text-[#2F261F]">{currentLabel}</p>
        </div>

        <div className="rounded-2xl border border-[#E8D7C5] bg-white p-4">
          <p className="text-xs font-medium">Média histórica</p>
          <p className="mt-1 font-semibold text-[#2F261F]">{averageLabel ?? "—"}</p>
        </div>

        <div className="rounded-2xl border border-[#E8D7C5] bg-white p-4">
          <p className="text-xs font-medium">Diferença</p>
          <p className="mt-1 font-semibold text-[#2F261F]">{diffLabel ?? "—"}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[#6B5E54]">Últimos pontos</p>
        <ul className="mt-2 grid gap-1 text-sm text-[#6B5E54]">
          {latestPoints.map((p) => (
            <li key={p.date} className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#2F261F]">{p.date}</span>
              <span>·</span>
              <span>{formatUnitPriceFromCents(p.unitPriceInCents, unitType)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

