import posthog from "posthog-js";

// Runs after HTML load and before React hydration.
// See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

try {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (key) {
    posthog.init(key, {
      api_host: host,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      // TODO: implement consent banner and posthog.opt_out_capturing() by default
      //       before enabling for public traffic under LGPD/GDPR obligations.
    });
  }
} catch (err) {
  console.error("[posthog] init failed", err);
}
