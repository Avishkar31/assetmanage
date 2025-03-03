import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
// import dbConnect from "../../../../lib/dbConnect";
import Monitor from "../../../../models/Monitor";
// import Monitor from "../../../../models/Monitor";

// GET request to fetch monitors by team
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team");

    const query = team ? { team } : {};
    const monitors = await Monitor.find(query);

    return NextResponse.json({ success: true, data: monitors });
  } catch (error) {
    console.error("Error fetching monitors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch monitors." },
      { status: 500 }
    );
  }
}

// POST request to create a new monitor
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const monitor = await Monitor.create(data);
    return NextResponse.json({ success: true, data: monitor }, { status: 201 });
  } catch (error) {
    console.error("Error adding monitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add monitor." },
      { status: 500 }
    );
  }
}

// PUT request to update an existing monitor
export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Monitor ID is required." },
        { status: 400 }
      );
    }

    const updatedMonitor = await Monitor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!updatedMonitor) {
      return NextResponse.json(
        { success: false, error: "Monitor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedMonitor });
  } catch (error) {
    console.error("Error updating monitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update monitor." },
      { status: 500 }
    );
  }
}

// DELETE request to delete a monitor
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Monitor ID is required." },
        { status: 400 }
      );
    }

    const deletedMonitor = await Monitor.findByIdAndDelete(id);

    if (!deletedMonitor) {
      return NextResponse.json(
        { success: false, error: "Monitor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Monitor deleted." });
  } catch (error) {
    console.error("Error deleting monitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete monitor." },
      { status: 500 }
    );
  }
}
