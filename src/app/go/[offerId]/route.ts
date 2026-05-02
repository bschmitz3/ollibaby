import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { mockOffers } from "@/data/mock-offers";
import { trackServerEvent } from "@/lib/analytics/track-server";
import { getOfferById } from "@/lib/offers";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/go/[offerId]">,
) {
  const { offerId } = await ctx.params;

  const offer = getOfferById(mockOffers, decodeURIComponent(offerId));

  if (!offer) {
    return new Response(null, { status: 404 });
  }

  const destinationUrl = offer.affiliateUrl ?? offer.url;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(destinationUrl);
  } catch {
    await trackServerEvent("outbound_redirect_invalid_url", {
      offerId: offer.id,
      canonicalProductId: offer.canonicalProductId,
      retailerId: offer.retailerId,
      isAffiliate: offer.isAffiliate,
    });
    return new Response(null, { status: 502 });
  }

  const destinationHost = parsedUrl.hostname;

  await trackServerEvent("outbound_redirect_started", {
    offerId: offer.id,
    canonicalProductId: offer.canonicalProductId,
    retailerId: offer.retailerId,
    isAffiliate: offer.isAffiliate,
    hasAffiliateUrl: Boolean(offer.affiliateUrl),
    destinationHost,
  });

  return NextResponse.redirect(destinationUrl, { status: 302 });
}
