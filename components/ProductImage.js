"use client";

import Image from "next/image";
import { getHighResImage } from "@/utils/imageUtils";

export default function ProductImage({ src, alt }) {
  return (
    <div className="relative aspect-square bg-gray-800/50 rounded-lg overflow-hidden">
      <Image
        src={getHighResImage(src)}
        alt={alt}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
        quality={85}
      />
    </div>
  );
}