import "./globals.css";
import { Playfair_Display, Open_Sans } from "next/font/google";
import Navigation from "@/components/Navigation"; // We'll create this
import SchemaManager from "@/components/schema/SchemaManager";
import EPNScript from "@/components/EPNScript";

const playfair = Playfair_Display({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Men's Cologne Set",
  description:
    "Luxury Men's Cologne Sets Curated for the Distinguished Gentleman",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${openSans.className} bg-gray-900`}>
        <EPNScript />
        <SchemaManager type="website" />
        <Navigation playfairClass={playfair.className} />{" "}
        {/* Move navigation to client component */}
        <main className="min-h-screen bg-gray-900">{children}</main>
        <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} menscologneset.com. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
