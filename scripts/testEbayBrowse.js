require("dotenv").config({ path: ".env.local" });

async function testEbayConfiguration() {
  console.log("\n🔍 Testing eBay API Configuration...\n");

  // 1. Check environment variables
  console.log("1. Checking environment variables:");
  const envVars = {
    EBAY_CLIENT_ID: process.env.EBAY_CLIENT_ID?.slice(0, 4) + "...",
    EBAY_CLIENT_SECRET: process.env.EBAY_CLIENT_SECRET
      ? "✓ Present"
      : "❌ Missing",
    EBAY_APP_ID: process.env.EBAY_APP_ID?.slice(0, 4) + "...",
  };

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${key}: ${value || "❌ Missing"}`);
  });

  // 2. Test OAuth Token
  console.log("\n2. Testing OAuth token generation:");
  try {
    const token = await getEbayToken();
    console.log("   ✓ Successfully generated OAuth token");
    console.log(`   Token preview: ${token.slice(0, 10)}...`);
  } catch (error) {
    console.log("   ❌ Failed to generate OAuth token");
    console.log(`   Error: ${error.message}`);
  }

  // 3. Test Browse API
  console.log("\n3. Testing Browse API search:");
  try {
    const results = await testBrowseSearch();
    console.log("   ✓ Successfully fetched results");
    console.log(`   Found ${results.length} items`);
    console.log("\nSample item:");
    console.log(JSON.stringify(results[0], null, 2));
  } catch (error) {
    console.log("   ❌ Failed to fetch results");
    console.log(`   Error: ${error.message}`);
  }
}

async function getEbayToken() {
  const tokenEndpoint = "https://api.ebay.com/identity/v1/oauth2/token";

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });

  if (!response.ok) {
    throw new Error(`Token fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function testBrowseSearch() {
  const token = await getEbayToken();
  const endpoint = "https://api.ebay.com/buy/browse/v1/item_summary/search";

  const queryParams = {
    q: "men cologne set",
    category_ids: "11848",
    limit: 5, // Just get a few items for testing
  };

  const response = await fetch(
    `${endpoint}?${new URLSearchParams(queryParams)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Browse API search failed: ${response.status}`);
  }

  const data = await response.json();
  return data.itemSummaries || [];
}

// Run the tests
testEbayConfiguration().catch(console.error);
