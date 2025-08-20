// app/api/monitors/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Monitor from "@/models/Monitor";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let query = {};
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      query = { _id: id };
    }

    const monitors = await Monitor.find(query)
      .populate("segment") // ✅ fixed typo
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: monitors });
  } catch (error) {
    console.error("Error fetching monitors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Validate required fields
    if (!data.serialNumber || !data.manufacturer || !data.model) {
      return NextResponse.json(
        { error: "Serial number, manufacturer and model are required" },
        { status: 400 }
      );
    }

    // Validate user performing the action
    if (!data.username && !data.updatedBy) {
      return NextResponse.json(
        {
          error:
            "Username or updatedBy field is required to track who created this monitor",
        },
        { status: 400 }
      );
    }

    // Check for duplicate serial numbers
    const existingMonitor = await Monitor.findOne({
      serialNumber: data.serialNumber,
    });
    if (existingMonitor) {
      return NextResponse.json(
        { error: "A monitor with this serial number already exists" },
        { status: 400 }
      );
    }

    // Create history entry with updatedBy field
    const historyEntry = {
      user: data.assetOwner || null,
      updatedBy: data.updatedBy || data.username,
      action: "created",
      date: new Date(),
      status: data.status || "MISStock",
    };

    // Create new monitor
    const monitor = new Monitor({
      serialNumber: data.serialNumber,
      manufacturer: data.manufacturer,
      model: data.model,
      prNumber: data.prNumber,
      poNumber: data.poNumber,
      prRequester: data.prRequester,
      status: data.status || "MISStock",
      segment: data.segment,
      assetOwner: data.assetOwner || "",
      username: data.updatedBy || data.username,
      createdAt: new Date(),
      lastUpdated: new Date(),
      assetHistory: [historyEntry],
    });

    const savedMonitor = await monitor.save();
    return NextResponse.json({ data: savedMonitor }, { status: 201 });
  } catch (error) {
    console.error("Error creating monitor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const data = await req.json();

    // Validate user performing the action
    if (!data.username && !data.updatedBy) {
      return NextResponse.json(
        {
          error:
            "Username or updatedBy field is required to track who updated this monitor",
        },
        { status: 400 }
      );
    }

    const monitor = await Monitor.findById(id);

    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    // Update basic fields
    if (data.serialNumber) monitor.serialNumber = data.serialNumber;
    if (data.manufacturer) monitor.manufacturer = data.manufacturer;
    if (data.model) monitor.model = data.model;
    if (data.prNumber) monitor.prNumber = data.prNumber;
    if (data.poNumber) monitor.poNumber = data.poNumber;
    if (data.prRequester) monitor.prRequester = data.prRequester;
    if (data.status) monitor.status = data.status;
    if (data.segment) monitor.segment = data.segment;
    if (data.hasOwnProperty("assetOwner")) monitor.assetOwner = data.assetOwner;

    monitor.lastUpdated = new Date(); // ✅ added last updated timestamp

    // Handle history entry
    let historyEntry;
    if (
      data.assetHistory &&
      typeof data.assetHistory === "object" &&
      !Array.isArray(data.assetHistory)
    ) {
      historyEntry = {
        ...data.assetHistory,
        user: data.assetHistory.user || data.assetOwner || null,
        updatedBy: data.assetHistory.updatedBy || data.updatedBy || data.username,
        date: data.assetHistory.date
          ? new Date(data.assetHistory.date)
          : new Date(),
        status: data.assetHistory.status || data.status || monitor.status,
      };
    } else {
      historyEntry = {
        user: data.user || data.assetOwner || null,
        updatedBy: data.updatedBy || data.username,
        date: new Date(),
        status: data.status || monitor.status,
      };

      if (data.action) {
        historyEntry.action = data.action;
        if (data.previousStatus)
          historyEntry.previousStatus = data.previousStatus;
        if (data.previousAssetOwner)
          historyEntry.previousAssetOwner = data.previousAssetOwner;
      } else {
        historyEntry.action = "updated";
      }
    }

    if (!monitor.assetHistory) monitor.assetHistory = [];
    monitor.assetHistory.push(historyEntry);

    const updatedMonitor = await monitor.save();
    return NextResponse.json({ data: updatedMonitor });
  } catch (error) {
    console.error("Error updating monitor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const monitor = await Monitor.findById(id);
    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    // Instead of hard delete → mark as disposed & add history
    monitor.status = "Disposed";
    monitor.lastUpdated = new Date();

    monitor.assetHistory.push({
      user: monitor.assetOwner || null,
      updatedBy: "system", // you can replace with req user if available
      action: "disposed",
      date: new Date(),
      status: "Disposed",
      previousStatus: monitor.status,
      previousAssetOwner: monitor.assetOwner,
    });

    const updatedMonitor = await monitor.save();
    return NextResponse.json({
      message: "Monitor marked as disposed successfully",
      data: updatedMonitor,
    });
  } catch (error) {
    console.error("Error deleting monitor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
