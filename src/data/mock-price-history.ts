export type MockPriceHistoryPoint = {
  date: string; // YYYY-MM-DD
  unitPriceInCents: number;
};

export const mockPriceHistoryByProductId: Record<
  string,
  MockPriceHistoryPoint[]
> = {
  "diaper-pampers-confort-sec-g-fita-regular-52-fralda": [
    { date: "2026-04-01", unitPriceInCents: 165 },
    { date: "2026-04-10", unitPriceInCents: 158 },
    { date: "2026-04-20", unitPriceInCents: 153 },
    { date: "2026-04-28", unitPriceInCents: 156 },
  ],
  "diaper-huggies-supreme-care-p-fita-regular-44-fralda": [
    { date: "2026-04-01", unitPriceInCents: 139 },
    { date: "2026-04-10", unitPriceInCents: 131 },
    { date: "2026-04-20", unitPriceInCents: 127 },
    { date: "2026-04-28", unitPriceInCents: 129 },
  ],
  "diaper-pampers-pants-g-pants-regular-64-fralda": [
    { date: "2026-04-01", unitPriceInCents: 149 },
    { date: "2026-04-10", unitPriceInCents: 142 },
    { date: "2026-04-20", unitPriceInCents: 137 },
    { date: "2026-04-28", unitPriceInCents: 141 },
  ],
  "wipe-huggies-supreme-care-no-size-regular-pacote-48-lenco": [
    { date: "2026-04-01", unitPriceInCents: 36 },
    { date: "2026-04-10", unitPriceInCents: 33 },
    { date: "2026-04-20", unitPriceInCents: 31 },
    { date: "2026-04-28", unitPriceInCents: 32 },
  ],
  "wipe-cottonbaby-baby-no-size-regular-kit-384-lenco": [
    { date: "2026-04-01", unitPriceInCents: 20 },
    { date: "2026-04-10", unitPriceInCents: 19 },
    { date: "2026-04-20", unitPriceInCents: 17 },
    { date: "2026-04-28", unitPriceInCents: 18 },
  ],
};

