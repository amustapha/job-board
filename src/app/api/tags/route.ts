import { NextResponse } from "next/server";
import { mockJobs } from "../mock/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  const allTags = Array.from(new Set(mockJobs.flatMap((job) => job.tags)));

  const suggestions = allTags
    .filter((tag) => tag.toLowerCase().includes(query))
    .sort((a, b) => a.localeCompare(b));

  return NextResponse.json(suggestions);
}
