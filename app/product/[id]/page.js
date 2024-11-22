import SchemaManager from "../../../components/schema/SchemaManager";
import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";
import Image from "next/image";
import { notFound } from "next/navigation";
import BuyButton from "../../../components/BuyButton";
import ProductImage from "../../../components/ProductImage";
import { getCachedDescription, setCachedDescription } from "../../lib/cache";
import { formatPrice } from "../../../utils/formatProductData";
import { cleanProductId } from "@/app/utils/productUtils.cjs";
import { getHighResImage } from "@/utils/imageUtils";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get static paths from our generated file
export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "data", "staticPaths.json");
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading static paths:", error);
    return [];
  }
}

// Get product data from our generated file
async function getProduct(id) {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    console.log("Reading from:", filePath);

    const data = await fs.readFile(filePath, "utf8");
    console.log("File content length:", data.length);

    const products = JSON.parse(data);
    console.log("Total products:", products.length);

    // Format the ID to match our stored format
    const formattedId = `v1|${cleanProductId(id)}|0`;
    console.log("Looking for formatted ID:", formattedId);

    const product = products.find((p) => p.id === formattedId);

    if (!product) {
      console.error("Product not found:", formattedId);
      console.log(
        "Sample of available IDs:",
        products.slice(0, 5).map((p) => p.id)
      );
      return notFound();
    }

    try {
      // check cache first
      const cachedDescription = getCachedDescription(product.id);
      if (cachedDescription) {
        return { product, description: cachedDescription };
      }

      // Generate OpenAI content if not cached
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Write a detailed description for this cologne set: ${product.title}. Include:
          1. What's included in the set
          2. The value proposition
          3. Why someone might want this set
          4. Best use cases (e.g., travel, sampling before full purchase)
          
          Return the response as clean HTML without any markdown backticks or code formatting.`,
          },
        ],
        model: "gpt-4o-mini",
      });

      const description = completion.choices[0].message.content
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();

      // Cache the description
      setCachedDescription(product.id, description);

      return { product, description };
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError);
      // Return product with a fallback description if OpenAI API fails
      return {
        product,
        description: `<p>Experience this amazing cologne set featuring ${product.title}. 
          Perfect for trying new scents or travel.</p>`,
      };
    }
  } catch (error) {
    console.error("Error loading product data:", error);
    throw error; // This will trigger the error.js boundary
  }
}

// The main component
export default async function ProductPage({ params }) {
  const { product, description } = await getProduct(params.id);

  return (
    <>
      <SchemaManager type="product" data={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <ProductImage
            src={product.image_url} // ProductImage component will handle the high-res conversion
            alt={product.title}
          />

          {/* Product Details */}
          <div className="text-gray-200">
            <h1 className="text-3xl font-bold text-white mb-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-2xl text-gold-400">
                {formatPrice(product.price)}
              </p>
              <span className="text-gray-300">{product.condition}</span>
            </div>

            {/* AI Generated Description */}
            <div
              className="prose prose-invert max-w-none mb-8 text-gray-200 
                prose-headings:text-white 
                prose-strong:text-white 
                prose-li:text-gray-200"
              dangerouslySetInnerHTML={{ __html: description }}
              suppressHydrationWarning
            />

            {/* Purchase Button */}
            <BuyButton url={product.url} />
          </div>
        </div>
      </div>
    </>
  );
}

// Add revalidation time
export const revalidate = 86400; // Revalidate once per day
