import dbConnect from "lib/dbConnect";
import { NextResponse } from "next/server";
import { verifyToken } from "utils/auth";

// Get all Users (Admin only)

export async function GET(req) {
  try {
    console.log("before dbConnect");
    await dbConnect();
    console.log("after dbConnect");
    const user = await verifyToken(req);
    console.log("user", user);
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
