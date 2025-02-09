import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
  await connectDB();
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in an HTTP-only cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/"
    });

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: { "Set-Cookie": cookie }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500
    });
  }
}
