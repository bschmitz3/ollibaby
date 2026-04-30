import { mockPriceHistoryByProductId } from "@/data/mock-price-history";
import { getCanonicalProducts } from "@/lib/catalog/search";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function main() {
  const errors: string[] = [];

  const products = getCanonicalProducts();
  const productsById = new Map(products.map((p) => [p.id, p]));

  const productIds = Object.keys(mockPriceHistoryByProductId);
  if (productIds.length < 1) {
    errors.push("Expected at least 1 product with price history, but found 0.");
  }

  for (const productId of productIds) {
    const product = productsById.get(productId);
    if (!product) {
      errors.push(`Price history references missing canonical product id: "${productId}".`);
      continue;
    }

    const points = mockPriceHistoryByProductId[productId];
    if (!Array.isArray(points) || points.length < 2) {
      errors.push(
        `Product "${productId}" must have at least 2 history points (got ${Array.isArray(points) ? points.length : "non-array"}).`,
      );
      continue;
    }

    for (const [idx, point] of points.entries()) {
      if (!isNonEmptyString(point.date)) {
        errors.push(
          `Product "${productId}" point[${idx}].date must be a non-empty string (got ${String(
            point.date,
          )}).`,
        );
      }

      if (!isFiniteNumber(point.unitPriceInCents) || point.unitPriceInCents <= 0) {
        errors.push(
          `Product "${productId}" point[${idx}].unitPriceInCents must be a finite number > 0 (got ${String(
            point.unitPriceInCents,
          )}).`,
        );
      }
    }
  }

  console.log("Mock price history validation summary");
  console.log(`- totalProducts: ${products.length}`);
  console.log(`- productsWithPriceHistory: ${productIds.length}`);

  if (errors.length > 0) {
    console.error("\nMock price history validation failed.\n");
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log("\nMock price history validation passed.");
}

main();

