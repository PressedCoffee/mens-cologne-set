const { fetchCologneSets } = require("../api/ebayBrowse.cjs");
const fs = require("fs").promises;
const path = require("path");

async function updateProductData() {
  const allProducts = [];
  const searchTerms = [
    "mens cologne gift set",
    "luxury cologne set",
    "designer fragrance collection",
    // Add more search terms
  ];

  for (const term of searchTerms) {
    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const items = await fetchCologneSets(term, pageNumber, 100);
        if (items.length === 0) {
          hasMorePages = false;
        } else {
          allProducts.push(...items);
          pageNumber++;
        }
      } catch (error) {
        console.error(
          `Error fetching page ${pageNumber} for "${term}":`,
          error
        );
        hasMorePages = false;
      }
    }
  }

  const filePath = path.join(process.cwd(), "data", "products.json");
  await fs.writeFile(filePath, JSON.stringify(allProducts, null, 2));

  const staticPaths = allProducts.map((product) => ({
    id: product.id,
  }));

  const staticPathsFile = path.join(process.cwd(), "data", "staticPaths.json");
  await fs.writeFile(staticPathsFile, JSON.stringify(staticPaths, null, 2));
}

updateProductData().catch(console.error);
