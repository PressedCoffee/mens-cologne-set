import { Suspense } from "react";
import QuizComponent from "../../components/QuizComponent";

export const metadata = {
  title: "Find Your Perfect Cologne | Fragrance Quiz",
  description:
    "Take our interactive quiz to discover your ideal cologne. Get personalized fragrance recommendations based on your preferences and style.",
  keywords:
    "cologne quiz, fragrance finder, men's cologne recommendation, scent quiz",
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <p className="text-gray-400">Loading quiz...</p>
            </div>
          }
        >
          <QuizComponent />
        </Suspense>
      </div>
    </main>
  );
}
