import { NextResponse } from "next/server";
import User from "models/User";

// Get all Users (Admin only)

export async function GET(req) {
  try {
    await dbConnect();
    const admin = await verifyToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await User.find({}, "-password");
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
