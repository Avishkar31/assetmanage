

import User from "@/models/User";
import dbConnect from "lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  try {
    await dbConnect();

    const { userId } = await params;

    // if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    // }

    console.log("Fetching user with ID:", userId);

    const user = await User.findById(userId).select("-password");
    console.log("Fetched user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
