"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const currentFilters = useMemo(
    () => searchParams.get("tags")?.split(",").filter(Boolean) || [],
    [searchParams]
  );

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      if (availableRoles.length > 0) {
        setIsLoadingRoles(false);
        return;
      }
      try {
        const response = await fetch("/api/roles");
        if (response.ok) {
          const data = await response.json();
          setAvailableRoles(data.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [currentFilters, availableRoles]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const currentTagsParam =
          currentFilters.length > 0
            ? `&currentTags=${encodeURIComponent(currentFilters.join(","))}`
            : "";

        const response = await fetch(
          `/api/tags?q=${encodeURIComponent(
            debouncedSearch
          )}${currentTagsParam}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, currentFilters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      const newFilters = [...currentFilters, search.trim()];
      router.push(`/?tags=${encodeURIComponent(newFilters.join(","))}`);
      setSearch("");
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newFilters = [...currentFilters, suggestion];
    router.push(`/?tags=${encodeURIComponent(newFilters.join(","))}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const removeFilter = (filterToRemove: string) => {
    const newFilters = currentFilters.filter(
      (filter) => filter.toLowerCase() !== filterToRemove.toLowerCase()
    );
    if (newFilters.length > 0) {
      router.push(`/?tags=${encodeURIComponent(newFilters.join(","))}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative w-full max-w-3xl">
      {currentFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {currentFilters.map((filter) => (
            <div
              key={filter}
              className="flex items-center gap-1 px-2 py-1 "
              style={{
                backgroundColor: "var(--tag-bg)",
                color: "var(--tag-text)",
              }}
            >
              <span>{filter}</span>
              <button
                type="button"
                onClick={() => removeFilter(filter)}
                className="ml-1 cursor-pointer"
              >
                <XMarkIcon className=" size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Filter by skills, role, or company (e.g., React, Python, Ecosia, Web3 Engineer, etc)..."
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--button-primary-bg)] transition-colors"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--input-border)",
              color: "var(--text-primary)",
            }}
          />
          {showSuggestions && (search || isLoading) && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              {isLoading ? (
                <div className="flex flex-wrap gap-2 p-1">
                  {["w-32", "w-40", "w-20", "w-24"].map((index) => (
                    <div
                      key={index}
                      className={`h-8 rounded animate-pulse ${index}`}
                      style={{
                        backgroundColor: "var(--tag-bg)",
                      }}
                    />
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 py-1 rounded transition-colors cursor-pointer"
                      style={{
                        backgroundColor: "var(--tag-bg)",
                        color: "var(--tag-text)",
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No suggestions found
                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--button-primary-bg)",
            color: "var(--button-primary-text)",
          }}
        >
          Search
        </button>
      </form>

      {currentFilters.length === 0 && (
        <div className="mt-4">
          <p
            className=" mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Get started by filtering by role:
          </p>
          {isLoadingRoles ? (
            <div className="flex flex-wrap gap-2">
              {["w-48", "w-32", "w-56", "w-24", "w-64", "w-40"].map((width) => (
                <div
                  key={width}
                  className={`h-8 ${width} rounded animate-pulse`}
                  style={{
                    backgroundColor: "var(--tag-bg)",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSuggestionClick(role)}
                  className="px-3 py-1 rounded transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--tag-bg)",
                    color: "var(--tag-text)",
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
