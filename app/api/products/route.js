import { promises as fs } from "fs";
import path from "path";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

export async function GET(request) {
  try {
    // Get product ID from URL if present
    const { searchParams } = new URL(request.url);
    const requestedId = searchParams.get("id");

    const productsPath = path.join(process.cwd(), "data", "products.json");
    console.log("Looking for products file at:", productsPath);

    // Check if file exists
    try {
      await fs.access(productsPath);
      console.log("Products file exists");
    } catch {
      console.error("Products file not found at:", productsPath);
      return new Response(
        JSON.stringify({
          error: "Products file not found",
          path: productsPath,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Read the file
    const productsData = await fs.readFile(productsPath, "utf8");

    // Validate JSON before parsing
    try {
      JSON.parse(productsData);
      console.log("Products JSON is valid");
    } catch (e) {
      console.error("Invalid JSON in products file:", e);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in products file",
          details: e.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse the JSON data
    const products = JSON.parse(productsData);

    // Log for debugging
    console.log(`Found ${products.length} products in database`);

    // Validate products structure
    if (!Array.isArray(products)) {
      console.error("Products data is not an array");
      return new Response(
        JSON.stringify({
          error: "Invalid products data structure",
          details: "Expected an array of products",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If specific product requested, return that product
    if (requestedId) {
      const cleanId = cleanProductId(requestedId);
      console.log(
        `Looking for product with ID: ${cleanId} (original: ${requestedId})`
      );

      const product = products.find((p) => cleanProductId(p.id) === cleanId);

      if (!product) {
        return new Response(
          JSON.stringify({
            error: "Product not found",
            requestedId,
            cleanId,
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify(product), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return all products
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error loading products:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to load products",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
