import { PipelineRunConfig } from "../types/catalog";
import { assertFirecrawlAllowed } from "../config/env";

export interface CrawlPlan {
  urls: string[];
  plannedCount: number;
  limited: boolean;
}

export function planCrawl(urls: string[], config: PipelineRunConfig): CrawlPlan {
  assertFirecrawlAllowed(config);
  const limit = Math.max(0, config.firecrawlMaxPagesPerRun);
  if (urls.length > limit) {
    return { urls: urls.slice(0, limit), plannedCount: limit, limited: true };
  }
  return { urls, plannedCount: urls.length, limited: false };
}

export async function executeCrawlPlan(_plan: CrawlPlan, config: PipelineRunConfig) {
  assertFirecrawlAllowed(config);
  if (config.dryRun) return [];
  // Structure only (future): no external API calls in this stage.
  throw new Error("Crawl mode is not implemented in this stage (no external calls allowed).");
}

