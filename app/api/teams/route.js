import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Team from "../../../models/Teams";

// GET request to fetch all teams
export async function GET(req) {
  try {
    await dbConnect();
    const teams = await Team.find({});
    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams." },
      { status: 500 }
    );
  }
}

// POST request to create a new team
export async function POST(req) {
  try {
    await dbConnect();
    const { name, description, department } = await req.json();

    if (!name || !department) {
      return NextResponse.json(
        { success: false, error: "Name and department are required." },
        { status: 400 }
      );
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: "Team with this name already exists." },
        { status: 400 }
      );
    }

    const team = await Team.create({ name, description, department });
    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team." },
      { status: 500 }
    );
  }
}

// PUT request to update an existing team
export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Team ID is required." },
        { status: 400 }
      );
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!updatedTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTeam });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team." },
      { status: 500 }
    );
  }
}

// DELETE request to delete a team
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Team ID is required." },
        { status: 400 }
      );
    }

    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json(
        { success: false, error: "Team not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Team deleted." });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team." },
      { status: 500 }
    );
  }
}
