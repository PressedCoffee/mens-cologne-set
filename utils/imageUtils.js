"use client";

export function getHighResImage(url) {
  if (!url || typeof url !== "string") {
    return "/placeholder-image.jpg"; // Return a fallback image
  }

  try {
    // Check if it's already a high-res URL
    if (url.includes("l1600")) {
      return url;
    }

    // Replace the size portion of the URL
    return url.replace(/\/s-l\d+\./, "/s-l1600.");
  } catch (error) {
    console.error("Error processing image URL:", error);
    return "/placeholder-image.jpg"; // Return fallback image on error
  }
}

// Or as a default export if you prefer
// export default function getHighResImage(url) {
//   if (!url) return '';
//   return url.replace("s-l140", "s-l500");
// }
