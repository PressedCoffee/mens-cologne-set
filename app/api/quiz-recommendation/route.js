import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { answers } = await request.json();

    console.log("Raw answers received:", answers); // Debug log

    // Basic validation
    if (!Array.isArray(answers) || answers.length !== 4) {
      return new Response(
        JSON.stringify({
          error: "Invalid answers format. Expected array of 4 answers.",
          receivedAnswers: answers,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simplified answer formatting - handle both string and object formats
    const formatAnswer = (answer) => {
      if (typeof answer === "string") {
        return { value: answer, label: answer };
      }
      if (typeof answer === "object" && answer !== null) {
        return {
          value: answer.value || answer.toString(),
          label: answer.label || answer.toString(),
        };
      }
      return { value: "unknown", label: "unknown" };
    };

    const formattedAnswers = answers.map(formatAnswer);

    const prompt = `As a luxury cologne expert, recommend a cologne gift set or sampler based on these preferences:
      - Budget: ${formattedAnswers[0].value} (${formattedAnswers[0].label})
      - Occasion: ${formattedAnswers[1].value} (${formattedAnswers[1].label})
      - Scent Preference: ${formattedAnswers[2].value} (${formattedAnswers[2].label})
      - Size Preference: ${formattedAnswers[3].value} (${formattedAnswers[3].label})
      
      Please provide a recommendation in the following format:
      Recommended Cologne: [Name - must be a gift set, sampler, or collection]
      Price Range: [Expected price range based on budget]
      Key Notes: [Main fragrance notes]
      Why It's Perfect: [2-3 sentences explaining why this matches their preferences]
      Search Terms: [3-4 keywords that will help find this product on eBay, must include "set", "collection", or "sampler"]`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 300,
    });

    // Enhanced error handling for OpenAI response
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const recommendation = completion.choices[0].message.content;

    if (!recommendation) {
      throw new Error("No recommendation generated");
    }

    // Validate recommendation format
    const hasRequiredSections = [
      "Recommended Cologne:",
      "Key Notes:",
      "Why It's Perfect:",
      "Search Terms:",
    ].every((section) => recommendation.includes(section));

    if (!hasRequiredSections) {
      throw new Error("Recommendation format is incomplete");
    }

    // Log the recommendation for debugging
    console.log("Generated recommendation:", recommendation);

    // Parse the recommendation to extract product info
    const recommendedCologne =
      recommendation.match(/Recommended Cologne:(.*?)(?=\n)/s)?.[1]?.trim() ||
      "";
    const searchTerms =
      recommendation.match(/Search Terms:(.*?)(?=$|\n)/s)?.[1]?.trim() || "";

    // Format the recommendation data
    const formattedRecommendation = {
      recommendation,
      productInfo: {
        title: recommendedCologne,
        searchTerms: searchTerms.split(",").map((term) => term.trim()),
      },
    };

    return new Response(
      JSON.stringify({
        recommendation: formattedRecommendation,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Quiz recommendation error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate recommendation",
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
