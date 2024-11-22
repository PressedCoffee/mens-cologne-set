// utils/generateContent.js

import { openai } from "../api/openai";

export const generateProductDescription = async (product) => {
  const prompt = `Write a detailed and persuasive product description for the following men's cologne set:

Title: ${product.title}
Price: ${product.price} ${product.currency}

Include the key features, ideal occasions, and what makes it a great choice. Use a friendly and engaging tone.`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Description is currently unavailable.";
  }
};
