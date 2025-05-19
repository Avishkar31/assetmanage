// app/api/peripherals/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Peripheral from "@/models/Peripheral";
import PeripheralHistory from "@/models/PeripheralHistory";
import { HiOutlineKeyboard } from 'react-icons/hi2';

// GET all peripherals
export async function GET() {
  try {
    await dbConnect();
    const peripherals = await Peripheral.find({}).sort({ type: 1, name: 1 });
    return NextResponse.json(peripherals);
  } catch (error) {
    console.error("Error fetching peripherals:", error);
    return NextResponse.json(
      { error: "Failed to fetch peripherals", details: error.message },
      { status: 500 }
    );
  }
}

// POST new peripheral
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate required fields
    if (!body.type || !body.name) {
      return NextResponse.json(
        { error: "Type and name are required" },
        { status: 400 }
      );
    }
    
    // Check if peripheral already exists
    const existingPeripheral = await Peripheral.findOne({
      type: body.type,
      name: body.name
    });
    
    if (existingPeripheral) {
      return NextResponse.json(
        { error: "Peripheral with this type and name already exists" },
        { status: 409 }
      );
    }
    
    // Create new peripheral
    const peripheral = await Peripheral.create({
      type: body.type,
      name: body.name,
      count: body.count || 0
    });
    
    // Create history entry
    if (body.count > 0) {
      await PeripheralHistory.create({
        peripheralId: peripheral._id,
        type: peripheral.type,
        name: peripheral.name,
        action: "add",
        quantity: body.count,
        previousCount: 0,
        newCount: body.count,
        performedBy: body.performedBy || "System",
        notes: body.notes || "Initial inventory"
      });
    }
    
    return NextResponse.json(peripheral, { status: 201 });
  } catch (error) {
    console.error("Error creating peripheral:", error);
    return NextResponse.json(
      { error: "Failed to create peripheral", details: error.message },
      { status: 500 }
    );
  }
}

// PUT update peripheral count
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate required fields
    if (!body.id || body.count === undefined) {
      return NextResponse.json(
        { error: "Peripheral ID and count are required" },
        { status: 400 }
      );
    }
    
    // Find peripheral
    const peripheral = await Peripheral.findById(body.id);
    if (!peripheral) {
      return NextResponse.json(
        { error: "Peripheral not found" },
        { status: 404 }
      );
    }
    
    // Calculate change
    const previousCount = peripheral.count;
    const newCount = Math.max(0, body.count); // Ensure count is not negative
    const difference = newCount - previousCount;
    
    // Update peripheral
    peripheral.count = newCount;
    await peripheral.save();
    
    // Create history entry
    if (difference !== 0) {
      await PeripheralHistory.create({
        peripheralId: peripheral._id,
        type: peripheral.type,
        name: peripheral.name,
        action: difference > 0 ? "add" : "remove",
        quantity: Math.abs(difference),
        previousCount,
        newCount,
        performedBy: body.performedBy || "System",
        notes: body.notes || ""
      });
    }
    
    return NextResponse.json(peripheral);
  } catch (error) {
    console.error("Error updating peripheral:", error);
    return NextResponse.json(
      { error: "Failed to update peripheral", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE peripheral
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Peripheral ID is required" },
        { status: 400 }
      );
    }
    
    const peripheral = await Peripheral.findByIdAndDelete(id);
    if (!peripheral) {
      return NextResponse.json(
        { error: "Peripheral not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting peripheral:", error);
    return NextResponse.json(
      { error: "Failed to delete peripheral", details: error.message },
      { status: 500 }
    );
  }
}