import { NextResponse } from "next/server";
import { dbOperations } from "@/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags =
      searchParams.get("tags")?.toLowerCase()?.split(",").filter(Boolean) || [];

    // Get all jobs from the database
    let jobs = dbOperations.getAllJobs();

    // Apply tag filtering if tags are provided
    if (tags.length > 0) {
      // Filter jobs that match ALL the provided tags (AND logic)
      jobs = jobs.filter((job) =>
        tags.every((tag) =>
          job.tags.some((jobTag: string) => jobTag.toLowerCase().includes(tag))
        )
      );
    }

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
