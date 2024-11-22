"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-8">
          {error.message || "Failed to load gift guide"}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-gold-400 text-gray-900 rounded-md hover:bg-gold-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
