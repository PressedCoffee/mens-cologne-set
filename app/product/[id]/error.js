"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong!
        </h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-gold-400 text-gray-900 rounded-md hover:bg-gold-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
