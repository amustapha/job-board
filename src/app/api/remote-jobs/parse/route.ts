import { NextResponse } from "next/server";
import { DEFAULT_INDEX } from "../constants";
import { getJob } from "../utils";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const index = searchParams.get("index") || DEFAULT_INDEX;
  const job = await getJob(+index);
  return NextResponse.json({ job });
}
