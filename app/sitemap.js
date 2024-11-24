import { promises as fs } from "fs";
import path from "path";

export default async function sitemap() {
  try {
    // Get all product data
    const filePath = path.join(process.cwd(), "data", "products.json");
    const data = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(data);

    // Clean and validate product IDs
    const productUrls = products
      .filter((product) => product && product.id) // Ensure product and ID exist
      .map((product) => ({
        url: `https://menscologneset.com/product/${product.id.replace("v1|", "").replace("|0", "")}`,
        lastModified: new Date().toISOString(), // Format date properly
        changeFrequency: "daily",
        priority: 0.9,
      }));

    // Static routes
    const routes = [
      {
        url: "https://menscologneset.com",
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: "https://menscologneset.com/gift-guide",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: "https://menscologneset.com/travel",
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    return [...routes, ...productUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return just the static routes if there's an error
    return [
      {
        url: "https://menscologneset.com",
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
