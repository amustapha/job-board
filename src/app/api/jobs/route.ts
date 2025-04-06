import { NextResponse } from "next/server";
import { mockJobs } from "../mock/jobs";

export async function GET() {
  return NextResponse.json(mockJobs);
}
