import { PostHog } from "posthog-node";

export type ServerAnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export async function trackServerEvent(
  name: string,
  payload?: ServerAnalyticsPayload,
): Promise<void> {
  const event = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.info("[server-analytics]", event);
  }

  const apiKey = process.env.POSTHOG_PROJECT_API_KEY;
  if (!apiKey) return;

  const host = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";

  // Per-request client with flushAt/flushInterval=0 ensures delivery in
  // serverless/edge environments before the function instance is reclaimed.
  const client = new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  client.capture({
    distinctId: "server",
    event: name,
    properties: {
      $process_person_profile: false,
      ...payload,
    },
  });

  await client.shutdown();
}
