import { NextResponse } from "next/server";
import { dbOperations } from "@/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags =
      searchParams.get("tags")?.toLowerCase()?.split(",").filter(Boolean) || [];

    // Get jobs with tag filtering at the database level
    const jobs = dbOperations.getJobsByTags(tags);

    // Return the filtered jobs
    return NextResponse.json({
      jobs,
      total: jobs.length,
      lastUpdated: dbOperations.getLastUpdated(),
    });
  } catch (error) {
    console.error("Error fetching jobs from database:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
