import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Segment from "../../../models/Segments";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all unique segment names
    const segments = await Segment.distinct("name"); // Fixed typo: Segment → Segment

    return NextResponse.json({ success: true, data: segments });
  } catch (error) {
    console.error("Error fetching segments:", error); // Fixed typo: segemnts → segments
    return NextResponse.json(
      { success: false, error: "Failed to fetch segment names." },
      { status: 500 }
    );
  }
}