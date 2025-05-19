// app/api/team-stats/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Team from "../../../models/Teams";

export async function GET() {
  try {
    await dbConnect();

    // Aggregate department counts directly in MongoDB
    const departmentCounts = await Team.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $project: { department: "$_id", count: 1, _id: 0 } }
    ]);

    return NextResponse.json({ success: true, data: departmentCounts });
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team statistics." },
      { status: 500 }
    );
  }
}
