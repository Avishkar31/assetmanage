import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Team from "../../../models/Teams";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all unique team names
    const teams = await Team.distinct("name"); // Assuming "name" stores the team name

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team names." },
      { status: 500 }
    );
  }
}
