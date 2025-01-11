import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import authorize from "@/middleware/authorize";

export async function POST(req) {
  await connectDB();
  const { username, password, role } = await req.json();

  // Authorization check
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!authorize(token, ["admin"])) {
    return new Response(JSON.stringify({ message: "Access Denied" }), {
      status: 403
    });
  }

  if (!username || !password || !role) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role
    });

    return new Response(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500
    });
  }
}
