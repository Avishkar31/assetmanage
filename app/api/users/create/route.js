// pages/api/auth/signup.js
import { NextResponse } from "next/server";
import User from "models/User";


// Create User (Admin only)

export async function POST(req) {
  try {
    const { username, password, fullName, segment, role } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const newUser = new User({ username, password, fullName, segment, role });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}