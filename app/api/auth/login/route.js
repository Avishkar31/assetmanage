import { NextResponse } from "next/server";
import User from "models/User";
import jwt from "jsonwebtoken";
import dbConnect from "lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    const { outlook, password } = body;
    if (!outlook || !password) {
      return NextResponse.json(
        { error: "Outlook email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ outlook });
    console.log("user", user);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("password", password);
    // const isMatch = user.password=password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT secret is missing in environment variables" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      user: { id: user._id, outlook: user.outlook, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
