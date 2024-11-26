export default function ProductCollectionSchema({ products, pageType }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      pageType === "premium"
        ? "Premium Men's Cologne Sets"
        : "Travel Size Men's Cologne Sets",
    description:
      pageType === "premium"
        ? "Luxury designer cologne sets featuring Tom Ford, YSL, Giorgio Armani, and more."
        : "TSA-approved travel size cologne sets and samplers from luxury brands.",
    url: `https://menscologneset.com/${pageType}`,
    hasPart: products.map((product) => ({
      "@type": "Product",
      name: product.title,
      description: `Experience this premium cologne set featuring ${product.title}`,
      image: [getHighResImage(product.image_url)], // Now an array with high-res image
      url: `https://menscologneset.com/product/${product.id.replace("v1|", "").replace("|0", "")}`,
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "eBay Seller",
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory: "https://schema.org/MerchantReturnUnspecified",
          merchantReturnLink:
            "https://www.ebay.com/help/policies/member-behaviour-policies/ebay-money-back-guarantee-policy?id=4210",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "US",
          },
        },
      },
      brand: {
        "@type": "Brand",
        name:
          product.title.match(/^([\w\s&]+)/)?.[1].trim() ||
          "Designer Fragrance",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Add this utility function if not already present elsewhere
function getHighResImage(url) {
  try {
    return url.replace("s-l225", "s-l1600");
  } catch (error) {
    console.error("Error converting image URL:", error);
    return url;
  }
}
