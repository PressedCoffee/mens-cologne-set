/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ebayimg.com"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        pathname: "/thumbs/**",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig; // Changed to ES Module export
