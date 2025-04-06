import React from "react";

export function Hero() {
  return (
    <div className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--gradient-start), var(--gradient-end))",
            }}
          >
            Find Your Next Remote Job
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Discover curated remote job opportunities from around the world.
            Connect with companies that value talent regardless of location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--button-primary-bg)] transition-colors"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              className="px-6 py-3 font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--button-primary-bg)",
                color: "var(--button-primary-text)",
              }}
            >
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
