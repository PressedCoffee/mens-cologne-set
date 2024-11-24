import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton.jsx";
import { generateProductDescription } from "@/utils/openai";

// Utility functions
function getHighResImage(url) {
  try {
    return url.replace("s-l225", "s-l1600");
  } catch (error) {
    console.error("Error converting image URL:", error);
    return url;
  }
}

function formatPrice(price) {
  return `$${parseFloat(price).toFixed(2)}`;
}

async function getProductData(id) {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    const data = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(data);
    return products.find((p) => p.id === `v1|${id}|0`);
  } catch (error) {
    console.error("Error in getProductData:", error);
    return null;
  }
}

async function getProductWithDescription(id) {
  const product = await getProductData(id);
  if (!product) return null;

  try {
    const description = await generateProductDescription(product);
    return { ...product, description };
  } catch (error) {
    console.error("Error generating description:", error);
    return {
      ...product,
      description: `Experience this amazing cologne set featuring ${product.title}. Perfect for trying new scents or travel.`,
    };
  }
}

export async function generateMetadata({ params }) {
  const product = await getProductData(params.id);
  if (!product) return { title: "Product Not Found" };

  const brandMatch = product.title.match(/^([\w\s&]+)/);
  const brand = brandMatch ? brandMatch[1].trim() : "";
  const imageUrl = getHighResImage(product.image_url);

  return {
    title: product.title,
    description: `Shop ${product.title}. Experience luxury fragrance from ${brand}. This authentic designer cologne set includes premium scents perfect for gifting or personal collection.`,
    openGraph: {
      title: `${product.title} | Luxury Cologne Set`,
      description: `Experience luxury fragrance from ${brand}. Premium cologne set perfect for gifting or personal collection.`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Designer Cologne Set`,
      description: `Experience luxury fragrance from ${brand}. Premium cologne set perfect for gifting or personal collection.`,
      images: [imageUrl],
    },
  };
}

// Schema markup component
function ProductJsonLd({ product }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: getHighResImage(product.image_url),
          description:
            product.description ||
            `Experience this premium cologne set featuring ${product.title}. Perfect for trying new scents or travel.`,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: product.url,
          },
          brand: {
            "@type": "Brand",
            name:
              product.title.match(/^([\w\s&]+)/)?.[1].trim() ||
              "Designer Fragrance",
          },
        }),
      }}
    />
  );
}

// Main component
// ... previous imports and utility functions remain the same ...

export default async function ProductPage({ params }) {
  const productData = await getProductWithDescription(params.id);

  if (!productData) {
    notFound();
  }

  return (
    <>
      <ProductJsonLd product={productData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Column */}
          <div className="relative aspect-square w-full bg-gray-900/50 rounded-lg overflow-hidden">
            <Image
              src={getHighResImage(productData.image_url)}
              alt={productData.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain hover:scale-105 transition-transform duration-300"
              priority
              quality={85}
            />
          </div>

          {/* Content Column */}
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {productData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <p className="text-xl md:text-2xl text-gold-400 font-semibold">
                  {formatPrice(productData.price)}
                </p>
                {productData.condition && (
                  <span className="text-gray-300 text-sm uppercase tracking-wide px-3 py-1 bg-gray-800/50 rounded-full">
                    {productData.condition}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Section */}
            <div className="prose prose-invert max-w-none mb-8 space-y-8">
              {/* Dynamic Description */}
              <div
                className="text-gray-300 space-y-6"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-gold-400 text-sm font-semibold mb-3">
                    AUTHENTICITY GUARANTEED
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Every fragrance in this set is 100% authentic, sourced
                    directly from authorized distributors.
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-gold-400 text-sm font-semibold mb-3">
                    SATISFACTION PROMISE
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Love your fragrances or return them with our hassle-free
                    return policy.
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400 border-t border-gray-700 pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-gold-400">✈️</span>
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold-400">🛡️</span>
                  <span>Buyer Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  <span>Authentic Products</span>
                </div>
              </div>
            </div>

            {/* Call to Action Section */}
            <div className="mt-auto space-y-4">
              <BuyButton url={productData.url} />
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-sm">
                  Secure Purchase through eBay
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>🔒 SSL Encrypted</span>
                  <span>•</span>
                  <span>Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
