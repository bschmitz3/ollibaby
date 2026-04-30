const ITEMS = [
  {
    title: "Comparamos por unidade",
    body: "Mostramos o preço por fralda ou por lenço, não apenas o preço total do pacote.",
  },
  {
    title: "Consideramos frete quando disponível",
    body: "Quando o frete está informado, ele entra no preço usado para ranquear as ofertas.",
  },
  {
    title: "Afiliado não vence por padrão",
    body: "Links afiliados podem existir, mas uma oferta não afiliada pode aparecer acima se for melhor.",
  },
  {
    title: "Produto certo primeiro",
    body: "As ofertas precisam bater com o produto canônico, tipo e quantidade antes de serem comparadas.",
  },
] as const;

export function ComparisonExplainer() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-10">
      <div className="rounded-3xl border border-[#E8D7C5] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-[#2F261F] sm:text-2xl">
          Como o Ollibaby compara
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E8D7C5] bg-[#FFFDF9] p-4 text-left"
            >
              <h3 className="font-semibold text-[#2F261F]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B5E54]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
