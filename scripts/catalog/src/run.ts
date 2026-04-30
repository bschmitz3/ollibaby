import { getRunConfigFromEnv } from "./config/env";
import { runMockPipeline } from "./pipeline";
import { exportReviewCsv } from "./exporters/export-review";
import { importReviewCsv } from "./importers/import-review";

async function main() {
  const modeArg = process.argv[2];
  const config = getRunConfigFromEnv({
    mode:
      modeArg === "mock" ||
      modeArg === "discover" ||
      modeArg === "crawl" ||
      modeArg === "export_review" ||
      modeArg === "import_review"
        ? modeArg
        : undefined,
  });

  if (config.mode === "mock") {
    const summary = await runMockPipeline();
    console.log(JSON.stringify({ mode: "mock", ...summary }, null, 2));
    return;
  }

  if (config.mode === "export_review") {
    const res = await exportReviewCsv();
    console.log(JSON.stringify({ mode: "export_review", ...res }, null, 2));
    return;
  }

  if (config.mode === "import_review") {
    const res = await importReviewCsv();
    console.log(JSON.stringify({ mode: "import_review", ...res }, null, 2));
    return;
  }

  if (config.mode === "discover") {
    throw new Error("Discover mode is not implemented in this stage (no external APIs allowed).");
  }

  if (config.mode === "crawl") {
    throw new Error("Crawl mode is not implemented in this stage (no external APIs allowed).");
  }

  const exhaustive: never = config.mode;
  throw new Error(`Unhandled mode: ${exhaustive}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

