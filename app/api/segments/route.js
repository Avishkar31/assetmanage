// app/api/segments/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Segment from "../../../models/Segments";

// GET request to fetch all Segments
export async function GET(req) {
  try {
    await dbConnect();
    const segments = await Segment.find({});
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
    const { name, description, segment } = await req.json();

    if (!name || !segment) {
      return NextResponse.json(
        { success: false, error: "Name and segment are required." },
        { status: 400 }
      );
    }

    const existingSegment = await Segment.findOne({ name });
    if (existingSegment) {
      return NextResponse.json(
        { success: false, error: "Segment with this name already exists." },
        { status: 400 }
      );
    }

    const newSegment = await Segment.create({ name, description, segment });
    return NextResponse.json({ success: true, data: newSegment }, { status: 201 });
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
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
        { success: false, error: "Segment ID is required." },
        { status: 400 }
      );
    }

    const updatedSegment = await Segment.findByIdAndUpdate(id, body, {
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
      { success: false, error: "Failed to update segment." },
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