
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import User from "models/User";


export  async function POST(req, res) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  console.log("req.body",req.body)

  const { email, password } = await req.json(); 

  console.log(
    "Received request to sign in user with email:",
    email,
    "and password:",
    password
  );

  if (!email || !password) {
    return NextResponse.json(
        { error: "Please fill out all fields." },
        { status: 401 }
      );
  }

  try {
   const user = await User.findOne({ email });
   console.log("user",user)
    if (!user) {
        return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
        );
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password); // Assume passwords are hashed in the DB
    if (!isPasswordValid) {
      return NextResponse.json(
        {  error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Replace with your JWT secret
      { expiresIn: "1h" }
    );
    return NextResponse.json(
          { message: "User logged in successfully.",token },
          { status: 201 }
        );
  } catch (err) {
    console.log("Signin error:", err);
    return NextResponse.json(
          { error: "Something went wrong. Please try again."  },
          { status: 500 }
        );
  }
}
