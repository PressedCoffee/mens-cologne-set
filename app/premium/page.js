import { formatProductData } from "../../utils/formatProductData";
import { getPaginationData } from "../../utils/pagination";
import ProductCard from "../../components/ProductCard";
import SchemaManager from "@/components/schema/SchemaManager";
import Link from "next/link";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

export const metadata = {
  title: "Premium Cologne Sets | Luxury Designer Collections",
  description:
    "Explore our curated selection of premium designer cologne sets featuring exclusive fragrances for the distinguished gentleman.",
};

export default async function PremiumPage({ searchParams }) {
  try {
    const currentPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 24;

    // Use absolute URL for server component
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allProducts = await response.json();

    // Filter for premium products (similar to FeaturedCarousel's filter)
    const premiumProducts = allProducts.filter((product) => {
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
    });

    // Get pagination data
    const { startIndex, endIndex, hasNextPage, hasPrevPage, totalPages } =
      getPaginationData(premiumProducts.length, currentPage, itemsPerPage);

    // Get products for current page
    const paginatedProducts = premiumProducts.slice(startIndex, endIndex);

    return (
      <main className="min-h-screen bg-gray-900 py-16">
        <SchemaManager type="collection" data={paginatedProducts} />
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-white mb-8">
            Premium Collections
            <span className="block text-xl text-gold-400 mt-4 font-sans">
              Exclusive Designer Fragrances
            </span>
          </h1>

          <div className="mb-8 text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(endIndex, premiumProducts.length)} of{" "}
            {premiumProducts.length} products
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={cleanProductId(product.id)} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-12 flex justify-center items-center gap-4">
            {hasPrevPage && (
              <Link
                href={`/premium?page=${currentPage - 1}`}
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
                href={`/premium?page=${currentPage + 1}`}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in PremiumPage:", error);
    return (
      <main className="min-h-screen bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-white mb-8">
            Premium Collections
          </h1>
          <p className="text-gray-300">
            An error occurred. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
