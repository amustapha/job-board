import { NextResponse } from "next/server";
import { TECHNICAL_ROLES, TECHNOLOGY_TAGS } from "@/scripts/get-jobs/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const currentTags =
    searchParams.get("currentTags")?.split(",").filter(Boolean) || [];

  // Get all unique tags from jobs
  const allTags = Array.from(
    new Set(
      [...TECHNOLOGY_TAGS, ...Object.keys(TECHNICAL_ROLES)].map((tag) =>
        tag.toLowerCase()
      )
    )
  );

  // Filter out tags that are already selected
  const availableTags = allTags.filter((tag) => !currentTags.includes(tag));

  // Filter tags based on search query
  const suggestions = availableTags
    .filter((tag) => tag.toLowerCase().includes(query))
    .sort((a, b) => a.localeCompare(b));

  return NextResponse.json(suggestions);
}
