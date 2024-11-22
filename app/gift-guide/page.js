import { formatProductData } from "../../utils/formatProductData";
import ProductCard from "../../components/ProductCard";
import { getPaginationData } from "../../utils/pagination";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

export const metadata = {
  title: "Luxury Men's Cologne Gift Sets | Perfect for Every Occasion",
  description:
    "Find the perfect men's cologne gift set for any occasion. From Christmas collections to anniversary gifts, discover premium fragrances that make memorable presents.",
  keywords:
    "men's cologne Christmas set, men's cologne gift set with bag, grooming gift set for men, luxury cologne gifts",
};

const giftCategories = [
  {
    id: "christmas",
    title: "Christmas Collections",
    description: "Luxurious gift sets perfect for holiday giving",
    searchTerms: ["gift", "set", "collection"],
    minPrice: 75,
    maxPrice: 300,
    preferredBrands: ["versace", "armani", "hugo boss", "calvin klein"],
  },
  {
    id: "anniversary",
    title: "Anniversary Selections",
    description: "Romantic fragrances for celebrating special moments",
    searchTerms: ["luxury", "premium", "exclusive"],
    minPrice: 100,
    maxPrice: 500,
    preferredBrands: ["tom ford", "creed", "dior", "chanel"],
  },
  {
    id: "fathersday",
    title: "Father's Day Favorites",
    description: "Distinguished scents to honor dad",
    searchTerms: ["classic", "traditional", "gentleman"],
    minPrice: 50,
    maxPrice: 150,
    preferredBrands: ["ralph lauren", "polo", "davidoff", "burberry"],
  },
];

const giftGuide = [
  {
    title: "Consider His Style",
    content:
      "Is he classic or contemporary? Traditional gentlemen might prefer woody or leather scents, while modern men often enjoy fresh or aquatic fragrances.",
  },
  {
    title: "Think About Occasion",
    content:
      "Choose lighter scents for office wear and stronger fragrances for evening events. Gift sets often include both options for versatility.",
  },
  {
    title: "Assess Experience Level",
    content:
      "For cologne newcomers, start with a variety set to help them discover their signature scent. Enthusiasts might appreciate niche or luxury brands.",
  },
  {
    title: "Check the Season",
    content:
      "Fresh, light scents work well in spring/summer, while warm, spicy fragrances are perfect for fall/winter.",
  },
];

export default async function GiftGuidePage({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 24;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allProducts = await response.json();

    // Filter for gift-appropriate products
    const giftProducts = allProducts.filter((product) => {
      if (!product || !product.title) return false;
      const title = product.title.toLowerCase();
      return (
        title.includes("gift") ||
        title.includes("set") ||
        title.includes("collection") ||
        title.includes("travel") ||
        parseFloat(product.price) > 50
      );
    });

    // Get pagination data
    const { totalPages, startIndex, endIndex, hasNextPage, hasPrevPage } =
      getPaginationData(giftProducts.length, currentPage, itemsPerPage);

    // Get products for current page
    const paginatedProducts = giftProducts.slice(startIndex, endIndex);

    // Enhanced category filtering
    const categoryProducts = giftCategories.map((category) => {
      const categoryItems = allProducts
        .filter((product) => {
          if (!product || !product.title) return false;
          const title = product.title.toLowerCase();
          const price = parseFloat(product.price);

          // Check price range
          const priceInRange =
            price >= category.minPrice && price <= category.maxPrice;

          // Check if matches any search terms
          const hasSearchTerm = category.searchTerms.some((term) =>
            title.includes(term.toLowerCase())
          );

          // Check if matches preferred brands
          const hasBrand = category.preferredBrands.some((brand) =>
            title.includes(brand.toLowerCase())
          );

          // Product must match price range AND (search terms OR brand)
          return priceInRange && (hasSearchTerm || hasBrand);
        })
        .sort((a, b) => {
          // Prioritize products that match both brand and search terms
          const aScore = category.preferredBrands.some((brand) =>
            a.title.toLowerCase().includes(brand.toLowerCase())
          )
            ? 2
            : 1;
          const bScore = category.preferredBrands.some((brand) =>
            b.title.toLowerCase().includes(brand.toLowerCase())
          )
            ? 2
            : 1;
          return bScore - aScore;
        })
        .slice(0, 3);

      return {
        ...category,
        products:
          categoryItems.length > 0
            ? categoryItems
            : giftProducts
                .filter((p) => parseFloat(p.price) >= category.minPrice)
                .slice(0, 3),
      };
    });

    return (
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="relative px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Find the Perfect Gift
              <span className="block text-xl md:text-2xl text-gold-400 mt-4">
                Curated Cologne Sets for Every Occasion
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover premium fragrance collections that make unforgettable
              presents
            </p>
          </div>
        </section>

        {/* Gift Guide Section */}
        <section className="px-6 py-16 bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-white mb-12 text-center">
              How to Choose the Right Cologne Gift Set
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {giftGuide.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg border border-gold-400/20 hover:border-gold-400/40 transition-colors"
                >
                  <h3 className="text-gold-400 text-lg font-semibold mb-4">
                    {tip.title}
                  </h3>
                  <p className="text-gray-300">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categoryProducts.map((category) => (
          <section key={category.id} className="px-6 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif text-white mb-4">
                  {category.title}
                </h2>
                <p className="text-gray-300">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.products.map((product) => (
                  <ProductCard
                    key={cleanProductId(product.id)}
                    product={{ ...product, id: cleanProductId(product.id) }}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* All Products Section with Pagination */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-white mb-12 text-center">
              All Gift Sets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={cleanProductId(product.id)}
                  product={{ ...product, id: cleanProductId(product.id) }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center gap-4">
              {hasPrevPage && (
                <a
                  href={`/gift-guide?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2 text-white">
                Page {currentPage} of {totalPages}
              </span>
              {hasNextPage && (
                <a
                  href={`/gift-guide?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-16 bg-gray-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-white mb-6">
              Need More Guidance?
            </h2>
            <p className="text-gray-300 mb-8">
              Try our fragrance finder quiz to discover the perfect cologne set
              for your recipient.
            </p>
            <a
              href="/quiz"
              className="inline-block px-8 py-3 bg-gold-400 text-gray-900 hover:bg-gold-500 transition-colors rounded-md"
            >
              Take the Quiz
            </a>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error in gift guide page:", error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-3xl font-serif mb-4">We'll Be Right Back</h1>
          <p className="text-gray-400">
            Our gift guide is temporarily unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export const revalidate = 86400; // Revalidate once per day
