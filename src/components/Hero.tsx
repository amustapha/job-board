"use client";

import React from "react";
import { SearchInput } from "./SearchInput";

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
          <SearchInput />
        </div>
      </div>
    </div>
  );
}
