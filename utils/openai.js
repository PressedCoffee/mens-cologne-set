import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";

// Add caching
async function getCachedDescription(productId) {
  try {
    const cacheDir = path.join(process.cwd(), ".cache");
    const cacheFile = path.join(cacheDir, `${productId}.json`);
    const data = await fs.readFile(cacheFile, "utf8");
    return JSON.parse(data).description;
  } catch {
    return null;
  }
}

async function cacheDescription(productId, description) {
  try {
    const cacheDir = path.join(process.cwd(), ".cache");
    await fs.mkdir(cacheDir, { recursive: true });
    const cacheFile = path.join(cacheDir, `${productId}.json`);
    await fs.writeFile(cacheFile, JSON.stringify({ description }));
  } catch (error) {
    console.error("Error caching description:", error);
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProductDescription(product) {
  try {
    // Check cache first
    const cached = await getCachedDescription(product.id);
    if (cached) return cached;

    // Extract meaningful information from the product title
    const brandMatch = product.title.match(/^([\w\s&]+)/);
    const brand = brandMatch ? brandMatch[1].trim() : "";

    // Look for specific fragrance names or collection details
    const fragranceDetails = product.title
      .replace(brand, "")
      .replace(/set|collection|gift|pack|mini|travel/gi, "")
      .trim();

    const prompt = `Create a detailed, product-specific description for this cologne set:

PRODUCT INFO:
Title: ${product.title}
Brand: ${brand}
Price: ${product.price}
Specific Fragrances: ${fragranceDetails}

REQUIREMENTS:
1. Start with a brand-specific opening that highlights ${brand}'s heritage or reputation in fragrance
2. Describe the specific fragrances included, their characteristics, or the collection theme
3. Format the content in this structure (do not include the \`\`\`html tags):

<div class="product-description">
  <p>[Brand context and set overview]</p>
  
  <div class="fragrance-details">
    <h4>Collection Details</h4>
    [Specific details about the fragrances or set components]
  </div>

  <div class="ideal-for">
    <h4>Perfect For</h4>
    [2-3 specific use cases based on the actual fragrances/brand]
  </div>

  <div class="value-proposition">
    <h4>Why This Set</h4>
    [Value proposition specific to this collection]
  </div>
</div>

STYLE GUIDELINES:
- Be specific to ${brand} and these exact fragrances
- Mention actual notes or characteristics if identifiable from the title
- Reference specific occasions or settings where these fragrances excel
- Highlight unique aspects of this particular set
- Keep the tone knowledgeable but accessible
- Include relevant keywords naturally

Make every description unique to this exact product. Avoid generic cologne descriptions.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 600,
    });

    // Clean up the response
    let description = completion.choices[0].message.content;

    // Remove any ```html and ``` tags
    description = description.replace(/```html/g, "").replace(/```/g, "");

    // Trim any whitespace
    description = description.trim();

    // Cache the result
    await cacheDescription(product.id, description);

    return description;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Fallback description still includes product name
    return `<div class="product-description">
      <p>Experience this premium ${product.title}. Each fragrance in this set has been carefully selected to provide a range of sophisticated scents.</p>
    </div>`;
  }
}
