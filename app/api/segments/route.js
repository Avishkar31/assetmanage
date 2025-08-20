// app/api/segments/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Segment from "../../../models/Segments";

// GET request to fetch all Segments
export async function GET(req) {
  try {
    await dbConnect();
    const segments = await Segment.find({}); // Fixed typo: segment → Segment
    return NextResponse.json({ success: true, data: segments });
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch segments." },
      { status: 500 }
    );
  }
}

// POST request to create a new segment
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

    const existingSegment = await Segment.findOne({ name });
    if (existingSegment) {
      return NextResponse.json(
        { success: false, error: "Segment with this name already exists." }, // Fixed typo: Segments → Segment
        { status: 400 }
      );
    }

    const segment = await Segment.create({ name, description, department });
    return NextResponse.json({ success: true, data: segment }, { status: 201 });
  } catch (error) {
    console.error("Error creating segment:", error); // Fixed typo: segment → segment
    return NextResponse.json(
      { success: false, error: "Failed to create segment." }, // Fixed typo: segment → segment
      { status: 500 }
    );
  }
}

// PUT request to update an existing segment
export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Segment ID is required." }, // Fixed typo: Segment → Segment
        { status: 400 }
      );
    }

    const updatedSegment = await Segment.findByIdAndUpdate(id, body, { // Fixed typo: segment → Segment
      new: true,
      runValidators: true
    });

    if (!updatedSegment) {
      return NextResponse.json(
        { success: false, error: "Segment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSegment });
  } catch (error) {
    console.error("Error updating segment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update segment." }, // Fixed capitalization: Segment → segment
      { status: 500 }
    );
  }
}

// DELETE request to delete a segment
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Segment ID is required." },
        { status: 400 }
      );
    }

    const deletedSegment = await Segment.findByIdAndDelete(id);

    if (!deletedSegment) {
      return NextResponse.json(
        { success: false, error: "Segment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Segment deleted." });
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete segment." },
      { status: 500 }
    );
  }
}