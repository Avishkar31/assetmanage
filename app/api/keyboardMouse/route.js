import { NextResponse } from "next/server";

// Mock database (you should replace this with a real database)
let counts = {
  keyboardCount: 0,
  mouseCount: 0
};

// GET endpoint to fetch counts
export async function GET() {
  return NextResponse.json(counts);
}

// PUT endpoint to update counts
export async function PUT(request) {
  const { type, count } = await request.json();

  if (type === "keyboard") {
    counts.keyboardCount = count;
  } else if (type === "mouse") {
    counts.mouseCount = count;
  }

  return NextResponse.json({ success: true });
}
