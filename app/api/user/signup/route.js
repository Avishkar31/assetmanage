import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "lib/dbConnect";
import User from "models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log(
      "Received request to create user with email:",
      email,
      "and password:",
      password
    )

    await dbConnect();

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
