// app/api/Manufacturer/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manufacturer from "@/models/Manufacturer";

// GET all manufacturers
export async function GET() {
  try {
    console.log("GET request to /api/Manufacturer");
    await dbConnect();
    
    const manufacturers = await Manufacturer.find().sort({ name: 1 });
    console.log(`Found ${manufacturers.length} manufacturers`);
    
    return NextResponse.json({ data: manufacturers });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch manufacturers", 
      details: error.message 
    }, { status: 500 });
  }
}

// POST a new manufacturer
export async function POST(req) {
  try {
    console.log("POST request to /api/Manufacturer");
    await dbConnect();
    
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ error: "Manufacturer name is required" }, { status: 400 });
    }
    
    const newManufacturer = await Manufacturer.create({
      name: body.name,
      address: body.address || "",
      contact: body.contact || ""
    });
    
    return NextResponse.json({ data: newManufacturer }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ 
      error: "Failed to create manufacturer", 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT (Update a manufacturer)
export async function PUT(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    
    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        address: body.address,
        contact: body.contact
      }, 
      { new: true, runValidators: true }
    );

    if (!updatedManufacturer) 
      return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });
    
    return NextResponse.json({ data: updatedManufacturer });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ 
      error: "Failed to update manufacturer", 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE a manufacturer
export async function DELETE(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    
    const deletedManufacturer = await Manufacturer.findByIdAndDelete(id);

    if (!deletedManufacturer) 
      return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });
    
    return NextResponse.json({ 
      message: "Manufacturer deleted successfully",
      data: { id: deletedManufacturer._id }
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ 
      error: "Failed to delete manufacturer", 
      details: error.message 
    }, { status: 500 });
  }
}