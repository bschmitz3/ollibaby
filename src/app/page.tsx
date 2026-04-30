import { ProductCard } from "@/components/product-card";
import { mockOffers } from "@/data/mock-offers";
import { searchCanonicalProducts } from "@/lib/catalog/search";
import { getRankedOffersForProduct } from "@/lib/offers";
import Link from "next/link";

type HomeProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Home({ searchParams }: HomeProps) {
  const qRaw = searchParams?.q;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw ?? "").trim();
  const hasSearch = q.length > 0;

  const products = searchCanonicalProducts(q);

  const productsWithBestOffer = products.map((product) => {
    const rankedOffers = getRankedOffersForProduct(mockOffers, product.id);
    const bestOffer = rankedOffers[0];
    return { product, bestOffer };
  });

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
          <form method="GET" className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              name="q"
              defaultValue={q}
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

          <div className="mt-6 flex flex-col gap-2 text-sm text-[#6B5E54] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              {hasSearch ? (
                <p>
                  Busca por:{" "}
                  <span className="font-medium">{`"${q}"`}</span>
                </p>
              ) : null}
              <p>
                {productsWithBestOffer.length}{" "}
                {productsWithBestOffer.length === 1 ? "produto" : "produtos"}{" "}
                encontrado{productsWithBestOffer.length === 1 ? "" : "s"}
              </p>
            </div>

            {hasSearch ? (
              <Link href="/" className="text-[#7A5C3E] underline">
                Limpar busca
              </Link>
            ) : null}
          </div>

          {productsWithBestOffer.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-6 text-left">
              <h3 className="text-base font-semibold text-[#2F261F]">
                Nenhum produto encontrado
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5E54]">
                Tente buscar por marca, linha, tamanho ou quantidade.
              </p>
              <Link href="/" className="mt-4 inline-block text-[#7A5C3E] underline">
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productsWithBestOffer.map(({ product, bestOffer }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  bestOffer={bestOffer}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
