import { NextResponse } from "next/server";
import {
  EXCLUDED_KEYWORDS,
  REQUIRED_KEYWORDS,
  TECHNICAL_ROLES,
} from "./constants";
import { getJob } from "./utils";
import { Job } from "@/types/job";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX; // Custom Search Engine ID

export async function GET() {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    return NextResponse.json(
      { error: "Google API configuration is missing" },
      { status: 500 }
    );
  }

  // Construct the search query
  const exactTerms = REQUIRED_KEYWORDS.map((k) => `"${k}"`).join(" OR ");
  const searchQuery = TECHNICAL_ROLES[0]
    .map((role) => `"${role}"`)
    .join(" OR ");
  const excludedTerms = EXCLUDED_KEYWORDS.map((term) => `"${term}"`).join(
    " OR "
  );
  const dateRestrict = "d7"; // Last week

  try {
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.append("key", GOOGLE_API_KEY);
    url.searchParams.append("cx", GOOGLE_CX);
    url.searchParams.append("exactTerms", exactTerms);
    url.searchParams.append("excludeTerms", excludedTerms);
    url.searchParams.append("q", searchQuery);
    url.searchParams.append("sort", "date");
    url.searchParams.append("dateRestrict", dateRestrict);
    url.searchParams.append("num", "10"); // Number of results

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch search results");
    }

    // Process each job item using getJob
    const processedJobs: Job[] = [];
    for (let i = 0; i < data.items.length; i++) {
      try {
        const job = await getJob(i);
        processedJobs.push(job);
      } catch (error) {
        console.error(`Error processing job at index ${i}:`, error);
      }
    }

    return NextResponse.json({ jobs: processedJobs });
  } catch (error) {
    console.error("Error fetching remote jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch remote jobs" },
      { status: 500 }
    );
  }
}
