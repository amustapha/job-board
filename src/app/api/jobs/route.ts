import { NextResponse } from "next/server";
import { mockJobs } from "../mock/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tags =
    searchParams.get("tags")?.toLowerCase()?.split(",").filter(Boolean) || [];

  let filteredJobs = [...mockJobs];

  if (tags.length > 0) {
    // Filter jobs that match ALL the provided tags (AND logic)
    filteredJobs = mockJobs.filter((job) =>
      tags.every((tag) =>
        job.tags.some((jobTag: string) => jobTag.toLowerCase().includes(tag))
      )
    );
  }

  return NextResponse.json(filteredJobs);
}
