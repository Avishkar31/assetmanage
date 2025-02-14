import { NextResponse } from "next/server";
import User from "models/User";
import jwt from "jsonwebtoken";
import dbConnect from "lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    const { siemensId, password } = body;
    if (!siemensId || !password) {
      return NextResponse.json(
        { error: "Siemens ID and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ siemensId });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Directly compare the password as per the schema
    if (!user.comparePassword(password)) {
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
      user: { id: user._id, siemensId: user.siemensId, role: user.role }
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
