export default function ProductSchema({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image_url.replace("s-l140", "s-l500"),
    description:
      product.description || `${product.title} - Luxury Men's Cologne Set`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
      seller: {
        "@type": "Organization",
        name: "Men's Cologne Set",
      },
    },
    brand: {
      "@type": "Brand",
      name: product.title.split(" ")[0], // Extract first word as brand name
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
