import { NextResponse } from "next/server";
import User from "models/User";
import { verifyToken } from "utils/auth";

// Update User (Admin only)

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const admin = await verifyToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true
    }).select("-password");
    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
