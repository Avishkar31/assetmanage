// app/api/segment-stats/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Segment from "../../../models/Segments";

export async function GET() {
  try {
    await dbConnect();

    // Aggregate department counts directly in MongoDB
    const departmentCounts = await Segment.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $project: { department: "$_id", count: 1, _id: 0 } }
    ]);

    return NextResponse.json({ success: true, data: departmentCounts });
  } catch (error) {
    console.error("Error fetching segment stats:", error); // Fixed typo: segment → segment
    return NextResponse.json(
      { success: false, error: "Failed to fetch segment statistics." }, // Fixed typo: segment → segment
      { status: 500 }
    );
  }
}