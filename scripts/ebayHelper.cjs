const fetchCologneSets = async (keywords = "men cologne set") => {
  const endpoint = "https://svcs.ebay.com/services/search/FindingService/v1";
  const params = new URLSearchParams({
    "OPERATION-NAME": "findItemsByKeywords",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": process.env.EBAY_APP_ID,
    "RESPONSE-DATA-FORMAT": "JSON",
    "REST-PAYLOAD": true,
    keywords: keywords,
    categoryId: "11848",
    "paginationInput.entriesPerPage": "20",
    sortOrder: "BestMatch",
  });

  try {
    console.log(
      "eBay API Key:",
      process.env.EBAY_APP_ID ? "Present" : "Missing"
    );

    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    if (data.errorMessage) {
      console.error(
        "eBay API Error:",
        JSON.stringify(data.errorMessage, null, 2)
      );
      throw new Error(`eBay API Error: ${JSON.stringify(data.errorMessage)}`);
    }

    const items =
      data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    console.log(`Found ${items.length} items from eBay`);

    return items;
  } catch (error) {
    console.error("Error fetching from eBay:", error);
    throw error;
  }
};

const formatProductData = (items) => {
  return items.map((item) => ({
    id: item.itemId[0],
    title: item.title[0],
    price: item.sellingStatus[0].currentPrice[0].__value__,
    url: item.viewItemURL[0],
    image_url: item.galleryURL[0],
    condition: item.condition?.[0].conditionDisplayName?.[0] || "Not specified",
  }));
};

module.exports = {
  fetchCologneSets,
  formatProductData,
};
