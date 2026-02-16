import { NextResponse } from "next/server";
import User from "models/User";
import jwt from "jsonwebtoken";
import dbConnect from "lib/dbConnect";

export async function POST(req) {
  try {
    console.log("=== LOGIN ATTEMPT ===");
    await dbConnect();

    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("JSON Parse Error:", error);
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    const siemensId = body.siemensId?.trim();
    const password = body.password?.trim();

    console.log("Siemens ID:", siemensId);
    console.log("Password:", password);

    if (!siemensId || !password) {
      console.log("Missing credentials");
      return NextResponse.json(
        { error: "Siemens ID and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ siemensId });
    
    if (!user) {
      console.log("User not found:", siemensId);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found:", user.siemensId);
    console.log("Password in DB:", user.password);
    console.log("Password entered:", password);

    const isValid = user.comparePassword(password);
    console.log("Password match:", isValid);

    if (!isValid) {
      console.log("Password mismatch!");
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
      { expiresIn: '7d' }
    );

    console.log("✅ Login successful for:", user.siemensId);

    return NextResponse.json({
      token,
      user: { id: user._id, siemensId: user.siemensId, role: user.role }
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}