"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";

const questions = [
  {
    id: 1,
    question: "What's your budget for a quality cologne?",
    options: [
      { label: "Under $50", value: "budget" },
      { label: "$50-$100", value: "moderate" },
      { label: "$100-$200", value: "premium" },
      { label: "Over $200", value: "luxury" },
    ],
    tooltip: "We'll find the best value within your range",
  },
  {
    id: 2,
    question: "When do you plan to wear this fragrance?",
    options: [
      { label: "Daily at Work", value: "work" },
      { label: "Special Occasions", value: "special" },
      { label: "Date Nights", value: "date" },
      { label: "All the Time", value: "versatile" },
    ],
    tooltip: "This helps us match the right scent strength",
  },
  {
    id: 3,
    question: "Which scent family appeals to you most?",
    options: [
      { label: "Fresh & Clean (Citrus/Aquatic)", value: "fresh" },
      { label: "Warm & Spicy (Oriental/Woody)", value: "warm" },
      { label: "Classic & Sophisticated (Leather/Tobacco)", value: "classic" },
      { label: "Modern & Unique (Niche Blends)", value: "modern" },
    ],
    tooltip: "Your signature scent should match your style",
  },
  {
    id: 4,
    question: "What's your preferred size?",
    options: [
      { label: "Travel Size (Perfect for Testing)", value: "travel" },
      { label: "Standard Bottle (Best Value)", value: "standard" },
      { label: "Luxury Gift Set (Full Experience)", value: "giftset" },
      { label: "Sample Set (Try Multiple)", value: "samples" },
    ],
    tooltip:
      "Consider starting with a smaller size to ensure it's perfect for you",
  },
];

// Enhanced matching logic with sophisticated scoring
// ... previous imports and code ...

async function getMatchingProducts(recommendation, answers) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    if (!products || !Array.isArray(products)) {
      throw new Error("Invalid products data received");
    }

    // Score products using answers only (removing recommendation parsing for now)
    const scoredProducts = products
      .map((product) => {
        let score = 0;
        const title = product.title?.toLowerCase() || "";
        const price = parseFloat(product.price);

        // Budget matching
        const budgetValue = answers[0]?.value;
        if (budgetValue === "budget" && price <= 50) score += 10;
        if (budgetValue === "moderate" && price > 50 && price <= 100)
          score += 10;
        if (budgetValue === "premium" && price > 100 && price <= 200)
          score += 10;
        if (budgetValue === "luxury" && price > 200) score += 10;

        // Scent preference matching
        const scentValue = answers[2]?.value;
        if (scentValue && title.includes(scentValue)) score += 5;

        // Size preference matching
        const sizeValue = answers[3]?.value;
        if (sizeValue === "travel" && title.includes("travel")) score += 5;
        if (sizeValue === "giftset" && title.includes("set")) score += 5;
        if (sizeValue === "samples" && title.includes("sample")) score += 5;

        return { ...product, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    // Ensure we have at least one product
    if (scoredProducts.length === 0) {
      console.log("No scored products found, using fallback");
      return {
        mainProduct: products[0],
        similarProducts: products.slice(1, 4),
      };
    }

    console.log("Found matching products:", scoredProducts.length);
    return {
      mainProduct: scoredProducts[0],
      similarProducts: scoredProducts.slice(1, 4),
    };
  } catch (error) {
    console.error("Error matching products:", error);
    throw error; // Let the calling function handle the error
  }
}

// Update the handleAnswer function
const handleAnswer = async (answer) => {
  const newAnswers = [...answers, answer];
  setAnswers(newAnswers);

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    setLoading(true);
    setError(null);

    try {
      // Simplified answer formatting
      const formattedAnswers = newAnswers.map((ans) => ({
        value: ans.value,
        label: ans.label,
      }));

      const matchedProducts = await getMatchingProducts(null, formattedAnswers);

      if (matchedProducts.mainProduct) {
        setProducts(matchedProducts);
        setCurrentQuestion(questions.length); // Move past the questions
      } else {
        throw new Error("No matching products found");
      }
    } catch (err) {
      console.error("Quiz error:", err);
      setError("Sorry, we couldn't find matching products. Please try again.");
    } finally {
      setLoading(false);
    }
  }
};

// Helper functions for scoring
function getBudgetScore(price, budgetPreference) {
  switch (budgetPreference) {
    case "budget":
      return price <= 50 ? 10 : 0;
    case "moderate":
      return price > 50 && price <= 100 ? 10 : 0;
    case "premium":
      return price > 100 && price <= 200 ? 10 : 0;
    case "luxury":
      return price > 200 ? 10 : 0;
    default:
      return 0;
  }
}

function getSizeScore(title, sizePreference) {
  const lower = title.toLowerCase();
  switch (sizePreference) {
    case "travel":
      return /travel|mini|10ml|15ml/.test(lower) ? 10 : 0;
    case "standard":
      return /100ml|3.3|3.4|oz/.test(lower) ? 10 : 0;
    case "giftset":
      return /set|collection|gift/.test(lower) ? 10 : 0;
    case "samples":
      return /sample|discovery|variety/.test(lower) ? 10 : 0;
    default:
      return 0;
  }
}

function isPrestigeBrand(brand) {
  const prestigeBrands = [
    "tom ford",
    "creed",
    "dior",
    "chanel",
    "ysl",
    "giorgio armani",
    "versace",
    "jo malone",
  ];
  return prestigeBrands.includes(brand?.toLowerCase());
}

function isWithinBudget(price, budgetPreference) {
  switch (budgetPreference) {
    case "budget":
      return price <= 50;
    case "moderate":
      return price > 50 && price <= 100;
    case "premium":
      return price > 100 && price <= 200;
    case "luxury":
      return price > 200;
    default:
      return true;
  }
}

export default function QuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [products, setProducts] = useState({
    mainProduct: null,
    similarProducts: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format answers before sending
      const formattedAnswers = newAnswers.map((ans) => ({
        value: ans.value,
        label: ans.label,
      }));

      // Get recommendation
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const recommendationResponse = await fetch(
        `${apiUrl}/api/quiz-recommendation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers }),
        }
      );

      if (!recommendationResponse.ok) {
        throw new Error("Failed to get recommendation");
      }

      const { recommendation } = await recommendationResponse.json();
      setRecommendation(recommendation);

      // Get matching products
      const productsResponse = await fetch(`${apiUrl}/api/products`);
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      const allProducts = await productsResponse.json();

      // Simple scoring based on answers
      const scoredProducts = allProducts
        .filter((product) => product && product.title && product.price)
        .map((product) => {
          let score = 0;
          const price = parseFloat(product.price);
          const title = product.title.toLowerCase();

          // Budget match
          const budgetValue = newAnswers[0].value;
          if (budgetValue === "moderate" && price >= 50 && price <= 100)
            score += 5;
          if (budgetValue === "premium" && price > 100 && price <= 200)
            score += 5;
          if (budgetValue === "luxury" && price > 200) score += 5;

          // Size match
          if (title.includes("set") && newAnswers[3].value === "giftset")
            score += 3;

          return { ...product, score };
        })
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score);

      const matchedProducts = {
        mainProduct: scoredProducts[0],
        similarProducts: scoredProducts.slice(1, 4),
      };

      if (!matchedProducts.mainProduct) {
        throw new Error("No matching products found");
      }

      setProducts(matchedProducts);
      setCurrentQuestion(questions.length); // Move to results view
    } catch (err) {
      console.error("Quiz error:", err);
      setError("Sorry, we couldn't find matching products. Please try again.");
      setCurrentQuestion(0); // Reset to start
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setRecommendation(null);
    setProducts({ mainProduct: null, similarProducts: [] });
    setError(null);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={resetQuiz}
          className="px-6 py-2 bg-gold-400 text-gray-900 rounded hover:bg-gold-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-gray-400 mt-4">Finding your perfect fragrance...</p>
      </div>
    );
  }

  if (recommendation && products.mainProduct) {
    return (
      <div className="space-y-8">
        {/* Recommendation Display */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-serif text-gold-400 mb-4">
            Your Perfect Match
          </h3>
          <div className="prose prose-invert max-w-none">
            {typeof recommendation === "string" ? (
              recommendation.split("\n").map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))
            ) : (
              <p className="mb-2">
                Based on your preferences, we've found some great matches for
                you.
              </p>
            )}
          </div>
        </div>

        {/* Main Product Recommendation */}
        <div className="space-y-4">
          <h4 className="text-xl text-white">Recommended Product</h4>
          <div className="bg-gray-800 p-4 rounded-lg">
            <ProductCard product={products.mainProduct} enhanced={true} />
            {/* Additional Product Details */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
              {products.mainProduct.condition && (
                <div className="flex items-center gap-2">
                  <span className="text-gold-400">Condition:</span>
                  <span>{products.mainProduct.condition}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {products.similarProducts?.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xl text-white">Similar Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.similarProducts.map((product) => (
                <div key={product.id} className="bg-gray-800 p-4 rounded-lg">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center pt-8">
          <button
            onClick={resetQuiz}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-2 bg-gold-400 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-2">
            {questions[currentQuestion].question}
          </h2>
          {questions[currentQuestion].tooltip && (
            <p className="text-gray-400 text-sm">
              {questions[currentQuestion].tooltip}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option)}
              className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors"
            >
              <span className="block text-white font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
