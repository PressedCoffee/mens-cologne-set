const { fetchCologneSets, formatProductData } = require("./ebayHelper.cjs");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const searchTerms = [
  "mens cologne gift set",
  "luxury cologne set men",
  "designer fragrance set men",
  "cologne sample set men",
  "cologne travel set men",
];

async function generatePages() {
  try {
    console.log("Starting static page generation...");
    console.log("Checking environment variables...");

    if (!process.env.EBAY_APP_ID) {
      throw new Error("EBAY_APP_ID is not set in environment variables");
    }

    let allProducts = new Map(); // Use Map to prevent duplicates

    for (const query of searchTerms) {
      console.log(`Fetching products for query: ${query}`);

      try {
        const items = await fetchCologneSets(query);
        console.log(
          `Found ${items?.length || 0} items from eBay for "${query}"`
        );

        if (!items || items.length === 0) {
          console.log(`No items found for query: ${query}`);
          continue;
        }

        const products = formatProductData(items);
        console.log(`Formatted ${products.length} products for "${query}"`);

        // Add products to map using ID as key to prevent duplicates
        products.forEach((product) => {
          allProducts.set(product.id, product);
        });

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (ebayError) {
        console.error(`eBay API Error for "${query}":`, ebayError);
        continue; // Continue with next search term if one fails
      }
    }

    // Convert Map to Array
    const finalProducts = Array.from(allProducts.values());

    const staticPaths = finalProducts.map((product) => ({
      params: {
        id: product.id,
      },
    }));

    const dataDir = path.join(__dirname, "..", "data");
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(
      path.join(dataDir, "staticPaths.json"),
      JSON.stringify(staticPaths, null, 2)
    );

    await fs.writeFile(
      path.join(dataDir, "products.json"),
      JSON.stringify(finalProducts, null, 2)
    );

    console.log(`Successfully generated data for ${staticPaths.length} pages`);
    console.log("Data saved to:");
    console.log("- data/staticPaths.json");
    console.log("- data/products.json");
  } catch (error) {
    console.error("Error generating static pages:", error);
    process.exit(1);
  }
}

generatePages();
