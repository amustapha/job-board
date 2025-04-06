import { NextResponse } from "next/server";
import { mockJobs } from "../mock/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const currentTags =
    searchParams.get("currentTags")?.split(",").filter(Boolean) || [];

  // Get all unique tags from jobs
  const allTags = Array.from(new Set(mockJobs.flatMap((job) => job.tags)));

  // Filter out tags that are already selected
  const availableTags = allTags.filter((tag) => !currentTags.includes(tag));

  // Filter tags based on search query
  const suggestions = availableTags
    .filter((tag) => tag.toLowerCase().includes(query))
    .sort((a, b) => a.localeCompare(b));

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(suggestions);
}
