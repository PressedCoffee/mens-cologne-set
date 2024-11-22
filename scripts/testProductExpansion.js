const { fetchCologneSets } = require("../api/ebayBrowse.cjs");
const fs = require("fs").promises;
const path = require("path");

async function testExpansion() {
  console.log("Starting test expansion...");

  try {
    // Test with increased page size
    const items = await fetchCologneSets("mens cologne gift set", 1, 100);
    console.log(`Found ${items.length} items on first page`);

    // Save to test file
    const dataDir = path.join(process.cwd(), "data");
    const testFile = path.join(dataDir, "test-products.json");

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(testFile, JSON.stringify(items, null, 2));

    console.log("Test data saved to data/test-products.json");
    console.log("Sample of first item:", JSON.stringify(items[0], null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testExpansion().catch(console.error);
