"use client";

import { trackEvent } from "@/lib/analytics";

export type SearchFormProps = {
  defaultQuery: string;
  category?: string;
  offerAvailability?: string;
  brand?: string;
  size?: string;
};

export function SearchForm({
  defaultQuery,
  category,
  offerAvailability,
  brand,
  size,
}: SearchFormProps) {
  return (
    <form
      method="GET"
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const formData = new FormData(form);
        const q = String(formData.get("q") ?? "");
        const trimmed = q.trim();

        trackEvent("search_submitted", {
          q: trimmed,
          hasSearch: trimmed.length > 0,
          category,
          offerAvailability,
          brand,
          size,
        });
      }}
    >
      {category && category !== "all" ? (
        <input type="hidden" name="category" value={category} />
      ) : null}
      {offerAvailability && offerAvailability !== "all" ? (
        <input
          type="hidden"
          name="offerAvailability"
          value={offerAvailability}
        />
      ) : null}
      {brand ? <input type="hidden" name="brand" value={brand} /> : null}
      {size ? <input type="hidden" name="size" value={size} /> : null}

      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Busque por Pampers G, Huggies Supreme Care, lenço 384 unidades..."
        className="min-h-12 flex-1 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] px-4 text-base outline-none transition focus:border-[#C98F5A]"
      />
      <button
        type="submit"
        className="min-h-12 rounded-2xl bg-[#2F261F] px-6 font-semibold text-white transition hover:bg-[#4A382B]"
      >
        Buscar
      </button>
    </form>
  );
}

