export function formatPrice(price) {
  try {
    // Convert to number if it's a string
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
      console.error("Invalid price value:", price);
      return "$0.00";
    }

    // Format with USD currency and always show 2 decimal places
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  } catch (error) {
    console.error("Error formatting price:", error);
    return "$0.00";
  }
}

export function formatProductData(item) {
  if (!item) {
    console.error("Received null or undefined item");
    return null;
  }

  try {
    // Check if this is Browse API data
    if (item.itemId && !Array.isArray(item.itemId)) {
      // Get high resolution image URL by replacing /thumbs/ with /images/
      const mainImage =
        item.image?.imageUrl?.replace("/thumbs/", "/images/") ||
        item.thumbnailImages?.[0]?.imageUrl?.replace("/thumbs/", "/images/");

      // Convert additional images to high resolution
      const highResAdditionalImages =
        item.additionalImages?.map((img) =>
          img.imageUrl?.replace("/thumbs/", "/images/")
        ) || [];

      return {
        id: item.itemId.replace(/^v1\|/, ""), // Remove v1| prefix
        title: item.title,
        price: item.price.value,
        image_url: mainImage,
        url: item.itemWebUrl.replace(/\%7C/g, "|"), // Fix URL encoding
        condition: item.condition,
        brand: item.brand,
        seller: {
          username: item.seller?.username,
          feedbackPercentage: item.seller?.feedbackPercentage,
          feedbackScore: item.seller?.feedbackScore,
        },
        shippingOptions: item.shippingOptions,
        additionalImages: highResAdditionalImages,
      };
    }

    // Legacy Finding API format
    const formattedData = {
      id: item.itemId?.[0]?.replace(/^v1\|/, "") || "",
      title: item.title?.[0] || "",
      price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "0.00",
      image_url: item.galleryURL?.[0] || "",
      url: item.viewItemURL?.[0]?.replace(/\%7C/g, "|") || "",
      condition: item.condition?.[0]?.conditionDisplayName?.[0] || "New",
    };

    // Validate required fields
    if (!formattedData.id || !formattedData.title || !formattedData.image_url) {
      console.error("Missing required fields");
      return null;
    }

    return formattedData;
  } catch (error) {
    console.error("Error formatting product data:", error);
    return null;
  }
}

// Default export for Next.js page handling
export default function Default() {
  return null;
}
