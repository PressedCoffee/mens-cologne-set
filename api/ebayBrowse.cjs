require("dotenv").config();
console.log("Environment variables loaded:", {
  clientId: process.env.EBAY_CLIENT_ID ? "Present" : "Missing",
  clientSecret: process.env.EBAY_CLIENT_SECRET ? "Present" : "Missing",
});
const TOKEN_ENDPOINT = "https://api.ebay.com/identity/v1/oauth2/token";
const API_ENDPOINT = "https://api.ebay.com/buy/browse/v1";

// Function to get a new access token
async function getAccessToken() {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    });

    if (!response.ok) {
      throw new Error(
        `Token fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Main function to fetch cologne sets
async function fetchCologneSets(
  searchTerm = "mens cologne gift set",
  page = 1
) {
  try {
    const token = await getAccessToken();
    const limit = 50; // Items per page
    const offset = (page - 1) * limit;

    const searchParams = new URLSearchParams({
      q: searchTerm,
      limit: limit.toString(),
      offset: offset.toString(),
      filter: "conditions:{NEW}",
      sort: "price",
      aspect_filter: "categoryId:Men's Fragrances",
    });

    const response = await fetch(
      `${API_ENDPOINT}/item_summary/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
          "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=US",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("eBay API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return {
        itemSummaries: [],
        total: 0,
        limit,
        offset,
        currentPage: page,
      };
    }

    const data = await response.json();

    if (!data.itemSummaries) {
      console.warn("No items found in eBay response");
      return {
        itemSummaries: [],
        total: 0,
        limit,
        offset,
        currentPage: page,
      };
    }

    const validItems = data.itemSummaries.filter(
      (item) =>
        item.image?.imageUrl &&
        item.price?.value &&
        !item.title.toLowerCase().includes("sample") &&
        parseFloat(item.price.value) > 20
    );

    return {
      itemSummaries: validItems,
      total: data.total || validItems.length,
      limit,
      offset,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in fetchCologneSets:", error);
    return {
      itemSummaries: [],
      total: 0,
      limit,
      offset,
      currentPage: page,
    };
  }
}

// Function to fetch specific categories
async function fetchCategoryProducts(category) {
  const categorySearchTerms = {
    premium: "luxury mens cologne gift set premium",
    travel: "travel cologne set men miniature",
    gift: "mens cologne gift set luxury brand",
    christmas: "mens cologne Christmas gift set",
    anniversary: "mens cologne gift set luxury",
    fathersDay: "mens cologne gift set father",
  };

  const searchTerm = categorySearchTerms[category] || "mens cologne gift set";
  return fetchCologneSets(searchTerm);
}

// Export using CommonJS syntax
module.exports = {
  fetchCologneSets,
  fetchCategoryProducts,
};
