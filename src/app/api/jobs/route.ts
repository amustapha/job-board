import { NextResponse } from "next/server";
import { dbOperations } from "@/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags =
      searchParams.get("tags")?.toLowerCase()?.split(",").filter(Boolean) || [];

    // Get pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Get jobs with tag filtering and pagination at the database level
    const result = dbOperations.getJobsByTagsPaginated(tags, page, limit);

    // Return the filtered and paginated jobs
    return NextResponse.json({
      jobs: result.jobs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
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
