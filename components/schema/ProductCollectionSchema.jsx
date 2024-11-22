export default function ProductCollectionSchema({ products, pageType }) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageType === "premium" 
        ? "Premium Men's Cologne Sets" 
        : "Travel Size Men's Cologne Sets",
      "description": pageType === "premium"
        ? "Luxury designer cologne sets featuring Tom Ford, YSL, Giorgio Armani, and more."
        : "TSA-approved travel size cologne sets and samplers from luxury brands.",
      "url": `https://menscologneset.com/${pageType}`,
      "hasPart": products.map(product => ({
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "url": product.url,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD"
        }
      }))
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }