import { TECHNICAL_ROLES } from "@/scripts/get-jobs/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = Object.keys(TECHNICAL_ROLES);
    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
