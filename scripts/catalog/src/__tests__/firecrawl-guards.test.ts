import { describe, expect, test } from "vitest";
import { planCrawl } from "../extractors/firecrawl";
import { getRunConfigFromEnv } from "../config/env";

describe("firecrawl guards", () => {
  test("blocked when FIRECRAWL_ENABLED=false (default)", () => {
    const config = getRunConfigFromEnv({ mode: "crawl", firecrawlEnabled: false, dryRun: true });
    expect(() => planCrawl(["https://example.com/a"], config)).toThrow(/Firecrawl is disabled/);
  });

  test("max pages per run enforced", () => {
    const config = getRunConfigFromEnv({
      mode: "crawl",
      firecrawlEnabled: true,
      dryRun: true,
      firecrawlMaxPagesPerRun: 2,
    });
    const plan = planCrawl(["u1", "u2", "u3"], config);
    expect(plan.plannedCount).toBe(2);
    expect(plan.urls).toEqual(["u1", "u2"]);
    expect(plan.limited).toBe(true);
  });
});

