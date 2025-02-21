import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Manufacturer from "@/models/Manufacturers";

export async function GET() {
  try {
    await connectDB();
    const manufacturers = await Manufacturer.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: manufacturers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, description = "", website = "" } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const manufacturer = await Manufacturer.create({
      name,
      description,
      website
    });
    return NextResponse.json({ success: true, data: manufacturer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { name, description = "", website = "" } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const manufacturer = await Manufacturer.findByIdAndUpdate(
      id,
      { name, description, website },
      { new: true, runValidators: true }
    );

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: "Manufacturer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: manufacturer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const manufacturer = await Manufacturer.findByIdAndDelete(id);
    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: "Manufacturer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
