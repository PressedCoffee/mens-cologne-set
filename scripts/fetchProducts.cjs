const { fetchCologneSets } = require("../api/ebayBrowse.cjs");
const fs = require("fs").promises;
const path = require("path");

async function fetchAllProducts() {
  console.log("Starting product fetch process...");
  const allProducts = [];
  const searchTerms = [
    "mens cologne gift set",
    "luxury cologne set",
    "designer fragrance set men",
    "cologne sample set",
    "men perfume collection",
    "cologne travel set men",
    "designer cologne gift set",
    "cologne miniature set",
    "cologne discovery set",
    "fragrance sampler men",
  ];

  for (const term of searchTerms) {
    console.log(`\nFetching products for: ${term}`);
    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages && pageNumber <= 10) {
      try {
        console.log(`  Page ${pageNumber}...`);
        const response = await fetchCologneSets(term, pageNumber);

        if (
          !response ||
          !response.itemSummaries ||
          response.itemSummaries.length === 0
        ) {
          console.log(`  No more items found for "${term}"`);
          hasMorePages = false;
        } else {
          const formattedItems = response.itemSummaries
            .filter((item) => item && item.price && item.image) // Ensure required fields exist
            .map((item) => ({
              id: item.itemId,
              title: item.title,
              price: item.price.value,
              url: item.itemWebUrl,
              image_url:
                item.image?.imageUrl ||
                item.thumbnailImages?.[0]?.imageUrl ||
                "",
              condition: item.condition || "New",
            }));

          console.log(`  Found ${formattedItems.length} items`);
          allProducts.push(...formattedItems);
          hasMorePages = response.total > pageNumber * response.limit;
          pageNumber++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
        }
      } catch (error) {
        console.error(`  Error on page ${pageNumber} for "${term}":`, error);
        hasMorePages = false;
      }
    }
  }

  const uniqueProducts = Array.from(
    new Map(allProducts.map((item) => [item.id, item])).values()
  );
  console.log(`\nTotal unique products found: ${uniqueProducts.length}`);

  try {
    // Write products.json
    const filePath = path.join(process.cwd(), "data", "products.json");
    await fs.writeFile(filePath, JSON.stringify(uniqueProducts, null, 2));
    console.log("✓ Products file generated successfully");

    // Write staticPaths.json
    const staticPaths = uniqueProducts.map((product) => ({
      params: {
        id: product.id,
      },
    }));
    const staticPathsFile = path.join(
      process.cwd(),
      "data",
      "staticPaths.json"
    );
    await fs.writeFile(staticPathsFile, JSON.stringify(staticPaths, null, 2));
    console.log("✓ Static paths file generated successfully");
  } catch (error) {
    console.error("Error writing files:", error);
    process.exit(1);
  }
}

console.log("Starting the fetch process...");
fetchAllProducts()
  .then(() => {
    console.log("\nAll done! Ready for next build step.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
