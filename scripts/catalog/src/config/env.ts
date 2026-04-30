import { PipelineRunConfig } from "../types/catalog";

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function parseIntSafe(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

export function getRunConfigFromEnv(
  overrides: Partial<PipelineRunConfig> = {},
): PipelineRunConfig {
  const firecrawlEnabled = parseBool(process.env.FIRECRAWL_ENABLED, false);

  return {
    mode: overrides.mode ?? (process.env.CATALOG_MODE as PipelineRunConfig["mode"]) ?? "mock",
    dryRun: overrides.dryRun ?? parseBool(process.env.DRY_RUN, true),
    maxQueriesPerRun:
      overrides.maxQueriesPerRun ?? parseIntSafe(process.env.CATALOG_MAX_QUERIES_PER_RUN, 10),
    maxResultsPerQuery:
      overrides.maxResultsPerQuery ?? parseIntSafe(process.env.CATALOG_MAX_RESULTS_PER_QUERY, 10),
    firecrawlEnabled: overrides.firecrawlEnabled ?? firecrawlEnabled,
    firecrawlMaxPagesPerRun:
      overrides.firecrawlMaxPagesPerRun ??
      parseIntSafe(process.env.FIRECRAWL_MAX_PAGES_PER_RUN, 10),
    cacheTtlDays: overrides.cacheTtlDays ?? parseIntSafe(process.env.CATALOG_CACHE_TTL_DAYS, 30),
  };
}

export function assertFirecrawlAllowed(config: PipelineRunConfig) {
  // Guard rail: never allow Firecrawl unless explicit env opt-in is true.
  if (!config.firecrawlEnabled) {
    throw new Error(
      "Firecrawl is disabled. Set FIRECRAWL_ENABLED=true explicitly to allow any crawl-related behavior.",
    );
  }
}

