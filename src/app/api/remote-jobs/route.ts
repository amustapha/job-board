import { NextResponse } from "next/server";
import {
  EXCLUDED_KEYWORDS,
  REQUIRED_KEYWORDS,
  TECHNICAL_ROLES,
} from "./constants";
import { getJob, fetchGoogleSearchResults } from "./utils";
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
    );

    return NextResponse.json({ data });

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
