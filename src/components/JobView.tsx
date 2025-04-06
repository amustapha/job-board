import React from "react";
import Image from "next/image";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface JobViewProps {
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  tags: string[];
  location?: string;
  jobType?: string;
  salary?: string;
}

export function JobView({
  companyLogo,
  companyName,
  jobTitle,
  tags,
  location = "Remote",
  jobType,
  salary,
}: JobViewProps) {
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
          className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0"
          style={{ backgroundColor: "var(--tag-bg)" }}
        >
          <Image
            src={companyLogo}
            alt={`${companyName} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
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
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--tag-text)",
            }}
          >
            {tag}
          </span>
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
      <button className="w-full py-2 rounded button-primary">Apply Now</button>
    </div>
  );
}
