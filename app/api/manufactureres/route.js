import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Manufacturer from "@/models/Manufacturers";

export async function GET() {
  try {
    await dbconnect();
    const manufacturers = await Manufacturer.find({});
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
    await dbconnect();
    const data = await request.json();
    const manufacturer = await Manufacturer.create(data);
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
    await dbconnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();

    const manufacturer = await Manufacturer.findByIdAndUpdate(
      id,
      data,
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
        await dbconnect();
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
