import { NextResponse } from "next/server";
import {
  EXCLUDED_KEYWORDS,
  REQUIRED_KEYWORDS,
  TECHNICAL_ROLES,
} from "./constants";
import { getJob, fetchGoogleSearchResults } from "./utils";
import { Job } from "@/types/job";
import { GoogleJobItem } from "./types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX; // Custom Search Engine ID

export async function GET() {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    return NextResponse.json(
      { error: "Google API configuration is missing" },
      { status: 500 }
    );
  }

  try {
    // Construct the search query
    const searchQuery = TECHNICAL_ROLES[0]
      .map((role) => `"${role}"`)
      .join(" OR ");

    // Fetch search results using the utility function
    const data = await fetchGoogleSearchResults(
      searchQuery,
      REQUIRED_KEYWORDS,
      EXCLUDED_KEYWORDS,
      21
    );

    // Process each job item using getJob
    const processedJobs: Job[] = [];
    for (const item of data.items) {
      try {
        const job = await getJob(item as GoogleJobItem);
        processedJobs.push(job);
      } catch (error) {
        console.error(`Error processing job:`, error);
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
