"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { Job } from "@/types/job";
import { useRouter, useSearchParams } from "next/navigation";

export function JobView({
  companyLogo,
  companyName,
  jobTitle,
  tags,
  location = "Remote",
  jobType,
  salary,
  url,
}: Job) {
  const [imageError, setImageError] = useState(false);
  const [domain, setDomain] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the domain on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setDomain(
        hostname === "localhost" ? "job-board.amustapha.com" : hostname
      );
    }
  }, []);

  const handleTagClick = (tag: string) => {
    const currentTags =
      searchParams.get("tags")?.split(",").filter(Boolean) || [];

    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];

      const params = new URLSearchParams(searchParams.toString());
      params.set("tags", newTags.join(","));

      router.push(`/?${params.toString()}`);
    }
  };

  // Add UTM parameters to the URL
  const getUrlWithUtmParams = (originalUrl: string) => {
    try {
      const urlObj = new URL(originalUrl);
      urlObj.searchParams.append(
        "utm_source",
        domain || "job-board.amustapha.com"
      );
      urlObj.searchParams.append("utm_medium", "referral");
      urlObj.searchParams.append("utm_campaign", "job_listing");
      return urlObj.toString();
    } catch (error) {
      console.error("Error adding UTM parameters:", error);
      return originalUrl; // Return original URL if there's an error
    }
  };

  return (
    <div
      className="p-6 rounded-lg border shadow-sm transition-colors"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: "var(--tag-bg)" }}
        >
          {!imageError ? (
            <Image
              src={companyLogo}
              alt={`${companyName} logo`}
              width={48}
              height={48}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <BuildingOfficeIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div>
          <h3
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {jobTitle}
          </h3>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
            {companyName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className="text-xs px-2 py-1 rounded transition-colors hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--tag-text)",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div
        className="flex flex-wrap gap-4 mb-4 text-sm"
        style={{ color: "var(--text-tertiary)" }}
      >
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {location}
        </div>
        {jobType && (
          <div className="flex items-center gap-1">
            <BriefcaseIcon className="h-4 w-4" />
            {jobType}
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            {salary}
          </div>
        )}
      </div>

      <a
        href={getUrlWithUtmParams(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2 rounded button-primary text-center"
      >
        Apply Now
      </a>
    </div>
  );
}
