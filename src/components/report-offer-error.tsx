import { TrackedLink } from "@/components/tracked-link";

type ReportOfferErrorProps = {
  offerId: string;
  productId: string;
};

function buildReportOfferErrorHref(params: ReportOfferErrorProps): string {
  const to = "contato@ollibaby.com";
  const subject = "Erro na oferta Ollibaby";
  const body = [
    "Oi! Quero reportar um erro em uma oferta do Ollibaby.",
    "",
    `offerId: ${params.offerId}`,
    `productId: ${params.productId}`,
    "",
    "Tipo de problema (marque um):",
    "- [ ] Produto errado",
    "- [ ] Quantidade errada",
    "- [ ] Preço errado",
    "- [ ] Frete errado",
    "- [ ] Link quebrado",
    "- [ ] Outro",
    "",
    "Detalhes:",
    "-",
  ].join("\n");

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function ReportOfferError({ offerId, productId }: ReportOfferErrorProps) {
  const href = buildReportOfferErrorHref({ offerId, productId });

  return (
    <TrackedLink
      href={href}
      className="text-xs font-medium text-[#7A5C3E] underline"
      eventName="offer_error_report_clicked"
      eventPayload={{
        offerId,
        productId,
      }}
    >
      Reportar erro
    </TrackedLink>
  );
}

