import type { MockPriceHistoryPoint } from "@/data/mock-price-history";
import { mockPriceHistoryByProductId } from "@/data/mock-price-history";

export type PriceSignal = "good" | "average" | "high" | "unknown";

export function getPriceHistoryForProduct(
  productId: string,
): MockPriceHistoryPoint[] {
  return mockPriceHistoryByProductId[productId] ?? [];
}

export function getAverageHistoricalUnitPriceInCents(
  points: MockPriceHistoryPoint[],
): number | undefined {
  const validPoints = points.filter((p) => Number.isFinite(p.unitPriceInCents));
  if (validPoints.length < 2) return undefined;

  const sum = validPoints.reduce((acc, p) => acc + p.unitPriceInCents, 0);
  const avg = sum / validPoints.length;
  if (!Number.isFinite(avg) || avg <= 0) return undefined;

  return Math.round(avg);
}

export function classifyCurrentUnitPrice(params: {
  currentUnitPriceInCents?: number;
  historicalPoints: MockPriceHistoryPoint[];
}): {
  signal: PriceSignal;
  averageUnitPriceInCents?: number;
  differencePercent?: number;
} {
  const current = params.currentUnitPriceInCents;
  if (!Number.isFinite(current) || current === undefined || current <= 0) {
    return { signal: "unknown" };
  }

  const average = getAverageHistoricalUnitPriceInCents(params.historicalPoints);
  if (average === undefined) return { signal: "unknown" };

  const diff = (current - average) / average;
  const differencePercent = Math.round(diff * 1000) / 10;

  if (current <= average * 0.95) {
    return { signal: "good", averageUnitPriceInCents: average, differencePercent };
  }

  if (current >= average * 1.05) {
    return { signal: "high", averageUnitPriceInCents: average, differencePercent };
  }

  return { signal: "average", averageUnitPriceInCents: average, differencePercent };
}

