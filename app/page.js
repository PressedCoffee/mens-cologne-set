import { getPaginationData } from "../utils/pagination";
import NewsletterSignup from "../components/NewsletterSignup";
import ProductCard from "../components/ProductCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import Link from "next/link";
import SchemaManager from "@/components/schema/SchemaManager";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

export const metadata = {
  title: "Luxury Men's Cologne Sets | Distinguished Gentleman's Collection",
  description:
    "Discover curated luxury men's cologne sets perfect for gifting, sampling, or finding your signature scent. Premium fragrances for the distinguished gentleman.",
};

export default async function Home({ searchParams }) {
  try {
    const currentPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 24;

    // Use absolute URL for server component
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    // Get featured products (keep these separate from pagination)
    const featuredProducts = products
      .filter((product) => {
        if (!product || !product.title) return false;
        const title = product.title.toLowerCase();
        const price = parseFloat(product.price);
        return (
          (price > 75 &&
            (title.includes("luxury") ||
              title.includes("premium") ||
              title.includes("designer"))) ||
          title.includes("versace") ||
          title.includes("gucci") ||
          title.includes("armani") ||
          title.includes("dior")
        );
      })
      .slice(0, 3);

    // Get pagination data for main product grid
    const { startIndex, endIndex, hasNextPage, hasPrevPage, totalPages } =
      getPaginationData(products.length, currentPage, itemsPerPage);

    // Get products for current page
    const paginatedProducts = products.slice(startIndex, endIndex);

    return (
      <main className="min-h-screen bg-gray-900">
        <SchemaManager type="collection" data={paginatedProducts} />

        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Distinguished Gentleman's Collection
            <span className="block text-xl md:text-2xl text-gold-400 mt-4">
              Curated Luxury Cologne Sets
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Discover premium fragrance collections perfect for gifting,
            sampling, or finding your signature scent.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/premium"
              className="px-8 py-3 bg-gold-400 text-gray-900 rounded-md hover:bg-gold-500 transition-colors"
            >
              Shop Premium
            </Link>
            <Link
              href="/gift-guide"
              className="px-8 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Gift Guide
            </Link>
          </div>
        </section>

        {/* Featured Carousel Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-white">
              Featured Collections
            </h2>
            <p className="text-gold-400">
              Handpicked for the Distinguished Gentleman
            </p>
          </div>
          <FeaturedCarousel products={featuredProducts} />
        </section>

        {/* All Products Grid - Now Paginated */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-white">All Collections</h2>
            <p className="text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
              {products.length}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={cleanProductId(product.id)}
                product={{ ...product, id: cleanProductId(product.id) }}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-12 flex justify-center items-center gap-4">
            {hasPrevPage && (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            )}

            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>

            {hasNextPage && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-6 py-16 bg-gray-800">
          <div className="max-w-3xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching cologne sets:", error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-3xl font-serif mb-4">We'll Be Right Back</h1>
          <p className="text-gray-400">
            Our collection is temporarily unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

// Add revalidation time
export const revalidate = 86400; // Revalidate once per day
