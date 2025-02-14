import { NextResponse } from "next/server";
import User from "models/User";
import dbConnect from "lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON input." },
        { status: 400 }
      );
    }
       
    let { siemensId, password, department, role = "regular" } = body;

    siemensId = siemensId?.trim().toLowerCase();
    department = department?.trim();
    role = role?.trim();

    if (!siemensId || !password || !department || !role) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!["regular", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ siemensId });
    if (existingUser) {
      return NextResponse.json(
        { error: "Siemens ID already exists." },
        { status: 400 }
      );
    }

    const newUser = new User({
      siemensId,
      password,
      department,
      role,
    });

    console.log("newUser", newUser);

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
