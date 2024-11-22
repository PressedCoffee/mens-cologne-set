import { formatProductData } from "../../utils/formatProductData";
import { getPaginationData } from "../../utils/pagination";
import ProductCard from "../../components/ProductCard";
import SchemaManager from "@/components/schema/SchemaManager";
import Link from "next/link";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

export const metadata = {
  title: "Travel Size Men's Cologne Sets | YSL, Tom Ford & More",
  description:
    "Shop TSA-approved travel size cologne sets and samplers. Featuring YSL, Tom Ford, and other luxury brands in convenient portable sizes.",
  keywords:
    "travel size cologne, men's cologne sampler set, YSL travel size, cologne discovery set, miniature cologne set",
  openGraph: {
    title: "Travel Size Men's Cologne Sets | YSL, Tom Ford & More",
    description:
      "Shop TSA-approved travel size cologne sets and samplers. Featuring YSL, Tom Ford, and other luxury brands in convenient portable sizes.",
    type: "website",
    url: "https://menscologneset.com/travel",
  },
};

const travelKeywords = [
  "travel",
  "mini",
  "sample",
  "portable",
  "10ml",
  "15ml",
  "travel size",
  "miniature",
  "discovery set",
  "sampler set",
  "trial size",
  "deluxe sample",
];

const travelBrands = [
  "YSL",
  "Yves Saint Laurent",
  "Tom Ford",
  "Giorgio Armani",
  "Versace",
  "Dior",
];

export default async function TravelPage({ searchParams }) {
  try {
    const currentPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 24;

    // Use absolute URL for server component
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allProducts = await response.json();

    // Filter for travel products using existing criteria
    const travelProducts = allProducts.filter((product) => {
      if (!product || !product.title) return false;
      const title = product.title.toLowerCase();
      return (
        travelKeywords.some((keyword) =>
          title.includes(keyword.toLowerCase())
        ) ||
        (travelBrands.some((brand) => title.includes(brand.toLowerCase())) &&
          travelKeywords.some((keyword) =>
            title.includes(keyword.toLowerCase())
          ))
      );
    });

    if (travelProducts.length === 0) {
      return (
        <main className="min-h-screen bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-serif text-white mb-8">
              Travel Collections
              <span className="block text-xl text-gold-400 mt-4 font-sans">
                Luxury on the Move
              </span>
            </h1>
            <p className="text-gray-300">
              No travel sets found matching your criteria.
            </p>
          </div>
        </main>
      );
    }

    // Get pagination data
    const { startIndex, endIndex, hasNextPage, hasPrevPage, totalPages } =
      getPaginationData(travelProducts.length, currentPage, itemsPerPage);

    // Get products for current page
    const paginatedProducts = travelProducts.slice(startIndex, endIndex);

    return (
      <main className="min-h-screen bg-gray-900 py-16">
        <SchemaManager type="collection" data={paginatedProducts} />
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-white mb-8">
            Travel Collections
            <span className="block text-xl text-gold-400 mt-4 font-sans">
              Luxury on the Move
            </span>
          </h1>

          {/* Travel Tips Section */}
          <div className="bg-gray-800 p-8 rounded-lg mb-12">
            <h2 className="text-2xl text-gold-400 mb-4">Travel Smart</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-gold-400">✓</span>
                TSA-Approved Sizes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-400">✓</span>
                Leak-Proof Packaging
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-400">✓</span>
                Multiple Scents for Any Occasion
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-400">✓</span>
                Compact & Portable
              </li>
            </ul>
          </div>

          {/* Products Grid with Count */}
          <div className="mb-8 text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, travelProducts.length)}{" "}
            of {travelProducts.length} travel sets
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                href={`/travel?page=${currentPage - 1}`}
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
                href={`/travel?page=${currentPage + 1}`}
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
    console.error("Error in TravelPage:", error);
    return (
      <main className="min-h-screen bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif text-white mb-8">
            Travel Collections
          </h1>
          <p className="text-gray-300">
            An error occurred. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}

// Add revalidation time
export const revalidate = 86400; // Revalidate once per day
