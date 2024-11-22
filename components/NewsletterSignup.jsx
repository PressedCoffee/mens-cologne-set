"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // TODO: Add your newsletter API integration here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      console.error("Newsletter signup error:", error);
    }
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-serif text-white mb-4">
        Join the Gentleman's Circle
      </h2>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto px-4">
        Subscribe for exclusive access to new collections, limited editions, and
        expert fragrance insights.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition-colors"
            required
            autoComplete="off"
            data-form-type="other"
            suppressHydrationWarning
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`
              px-6 
              py-3 
              bg-gradient-to-r 
              from-gold-400 
              to-gold-500 
              text-gray-900 
              font-semibold 
              transition-all 
              duration-300
              hover:from-gold-500 
              hover:to-gold-400
              disabled:opacity-50 
              disabled:cursor-not-allowed
              sm:w-auto 
              w-full
            `}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Subscribing...
              </span>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

        {status === "success" && (
          <div className="mt-4 text-green-400 bg-green-400/10 p-3 rounded">
            Thank you for subscribing to our newsletter!
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 text-red-400 bg-red-400/10 p-3 rounded">
            Something went wrong. Please try again later.
          </div>
        )}
      </form>

      <p className="text-gray-500 text-sm mt-6 px-4">
        By subscribing, you agree to receive marketing communications from us.
        <br />
        You can unsubscribe at any time.
      </p>
    </div>
  );
}
