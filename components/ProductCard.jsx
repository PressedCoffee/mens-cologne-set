"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../utils/formatProductData";
import { cleanProductId } from "@/app/utils/productUtils.cjs";
import { getHighResImage } from "../utils/imageUtils";
import { useMemo } from "react";

export default function ProductCard({ product, enhanced = false }) {
  const getImageUrl = useMemo(() => {
    if (!product?.image_url) return null;

    try {
      const highResUrl = getHighResImage(product.image_url);
      console.log("Original URL:", product.image_url);
      console.log("High Res URL:", highResUrl);
      return highResUrl;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return product.image_url;
    }
  }, [product?.image_url]);

  if (!product) return null;

  return (
    <Link href={`/product/${cleanProductId(product.id)}`} className="group">
      <div
        className={`bg-gray-800 border border-gray-700 p-6 transition-all duration-300 hover:border-gold-400 ${
          enhanced ? "ring-2 ring-gold-400" : ""
        }`}
      >
        <div className="aspect-square relative mb-4 overflow-hidden bg-gray-700">
          {getImageUrl ? (
            <Image
              src={getImageUrl}
              alt={product.title || "Product Image"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
              loading="eager"
              quality={75}
              onError={(e) => {
                console.error("Image load error:", e);
                e.currentTarget.src = product.image_url; // Fallback to original URL
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        <h2 className="text-xl text-white font-serif mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
          {product.title}
        </h2>

        <p className="text-2xl text-gold-400">{formatPrice(product.price)}</p>

        {enhanced && product.condition && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Condition: <span className="text-white">{product.condition}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
