import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Monitor from "@/models/Monitor";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const team = searchParams.get("team");

    if (!team) {
      return NextResponse.json(
        { error: "Team is required." },
        { status: 400 }
      );
    }

    const monitors = await Monitor.find({ prRequester: team });
    return NextResponse.json(monitors);
  } catch (error) {
    console.error("Error fetching monitors:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitors." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { 
      prRequester,
      manufacturer,
      model,
      prNumber,
      poNumber,
      serialNumber,
      status,
      username
    } = body;

    if (!serialNumber || !prRequester) {
      return NextResponse.json(
        { error: "Serial number and PR Requester are required." },
        { status: 400 }
      );
    }

    const existingMonitor = await Monitor.findOne({ serialNumber });
    if (existingMonitor) {
      return NextResponse.json(
        { error: "Monitor with this serial number already exists." },
        { status: 400 }
      );
    }

    const monitor = await Monitor.create({
      prRequester,
      manufacturer,
      model,
      prNumber,
      poNumber,
      serialNumber,
      status,
      username,
      assetHistory: []
    });

    return NextResponse.json(monitor, { status: 201 });
  } catch (error) {
    console.error("Error creating monitor:", error);
    return NextResponse.json(
      { error: "Failed to create monitor." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Monitor ID is required." },
        { status: 400 }
      );
    }

    await Monitor.findByIdAndDelete(id);
    return NextResponse.json({ message: "Monitor deleted." });
  } catch (error) {
    console.error("Error deleting monitor:", error);
    return NextResponse.json(
      { error: "Failed to delete monitor." },
      { status: 500 }
    );
  }
}
