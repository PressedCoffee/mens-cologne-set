"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../utils/formatProductData";
import { getHighResImage } from "@/utils/imageUtils";
import { cleanProductId } from "@/app/utils/productUtils.cjs";

function CarouselContent({
  products,
  currentIndex,
  nextSlide,
  prevSlide,
  setCurrentIndex,
}) {
  if (!products?.length) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[500px] overflow-hidden rounded-xl">
      {/* Carousel content */}
      <div className="relative w-full h-full">
        {products.map((product, index) => (
          <Link
            key={cleanProductId(product.id)}
            href={`/product/${cleanProductId(product.id)}`}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={getHighResImage(product.image_url)}
                alt={product.title || ""}
                fill
                className="object-contain"
                priority={index === 0}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-8">
                <h3 className="text-2xl font-serif text-white mb-2">
                  {product.title}
                </h3>
                <p className="text-xl text-gold-400">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/75 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/75 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allProducts = await response.json();
        console.log("Loaded products:", allProducts.length);

        // Filter for featured products (sets, collections, gifts)
        const featuredProducts = allProducts
          .filter((p) => {
            const title = p.title.toLowerCase();
            return (
              title.includes("set") ||
              title.includes("collection") ||
              title.includes("gift")
            );
          })
          .slice(0, 5);

        console.log("Featured products found:", featuredProducts.length);
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((current) =>
          current === products.length - 1 ? 0 : current + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [products.length]);

  const nextSlide = () => {
    setCurrentIndex((current) =>
      current === products.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((current) =>
      current === 0 ? products.length - 1 : current - 1
    );
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-6xl mx-auto h-[500px] overflow-hidden rounded-xl bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="relative w-full max-w-6xl mx-auto h-[500px] overflow-hidden rounded-xl bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">No featured products available</p>
        </div>
      </div>
    );
  }

  return (
    <CarouselContent
      products={products}
      currentIndex={currentIndex}
      nextSlide={nextSlide}
      prevSlide={prevSlide}
      setCurrentIndex={setCurrentIndex}
    />
  );
}
