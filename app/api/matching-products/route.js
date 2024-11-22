import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    if (!body.recommendation) {
      throw new Error("No recommendation provided");
    }

    // Extract the first cologne name from the recommendation
    // Updated regex to handle both formats
    const recommendedCologne = body.recommendation
      .match(
        /(?:Recommended Cologne:|Recommended Cologne)\s*\*?\*?([^*\n]+)\*?\*?/i
      )?.[1]
      ?.trim();

    console.log("Extracted cologne name:", recommendedCologne);

    if (!recommendedCologne) {
      throw new Error("Could not extract cologne name from recommendation");
    }

    // Load products from our local database
    const productsPath = path.join(process.cwd(), "data", "products.json");
    const productsData = await fs.readFile(productsPath, "utf8");
    const products = JSON.parse(productsData);

    // Extract all search terms from the recommendation
    const searchTermsMatches =
      body.recommendation.match(/Search Terms:([^]*?)(?=\n\n|$)/g) || [];
    const searchTerms = searchTermsMatches
      .flatMap((match) =>
        match
          .replace(/Search Terms:/, "")
          .replace(/"/g, "")
          .split(",")
          .map((term) => term.trim().toLowerCase())
      )
      .filter((term) => term); // Remove empty terms

    console.log("Extracted search terms:", searchTerms);

    // Score products based on matches
    const scoredProducts = products.map((product) => {
      let score = 0;
      const title = product.title.toLowerCase();

      // Check for matches with the recommended cologne name
      const cologneWords = recommendedCologne.toLowerCase().split(" ");
      cologneWords.forEach((word) => {
        if (word.length > 2 && title.includes(word)) {
          // Only match words longer than 2 characters
          score += 5;
        }
      });

      // Check for matches with search terms
      searchTerms.forEach((term) => {
        if (title.includes(term)) {
          score += 2;
        }
      });

      // Bonus points for gift sets and collections
      if (
        title.includes("set") ||
        title.includes("collection") ||
        title.includes("gift")
      ) {
        score += 3;
      }

      return { ...product, score };
    });

    // Sort and filter products
    const sortedProducts = scoredProducts
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log("Found matching products:", sortedProducts.length);

    // If no exact matches found, fall back to generic cologne sets
    if (sortedProducts.length === 0) {
      const genericProducts = products
        .filter((p) => {
          const title = p.title.toLowerCase();
          return (
            title.includes("set") ||
            title.includes("collection") ||
            title.includes("gift") ||
            title.includes("sample")
          );
        })
        .slice(0, 4);

      console.log("Using generic products:", genericProducts.length);

      if (genericProducts.length === 0) {
        // If still no products found, return the first few products from the database
        return new Response(
          JSON.stringify({
            mainProduct: products[0],
            similarProducts: products.slice(1, 4),
            isGenericRecommendation: true,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          mainProduct: genericProducts[0],
          similarProducts: genericProducts.slice(1),
          isGenericRecommendation: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the best matches
    return new Response(
      JSON.stringify({
        mainProduct: sortedProducts[0],
        similarProducts: sortedProducts.slice(1, 4),
        isGenericRecommendation: false,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in matching-products route:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to fetch matching products",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
