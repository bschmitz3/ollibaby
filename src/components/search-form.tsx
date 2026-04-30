"use client";

import { trackEvent } from "@/lib/analytics";

export type SearchFormProps = {
  defaultQuery: string;
};

export function SearchForm({ defaultQuery }: SearchFormProps) {
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
        });
      }}
    >
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

