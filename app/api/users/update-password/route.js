import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import authorize from "@/middleware/authorize";

export async function PATCH(req) {
  await connectDB();
  const { userId, newPassword } = await req.json();

  // Authorization check
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!authorize(token, ["admin"])) {
    return new Response(JSON.stringify({ message: "Access Denied" }), {
      status: 403
    });
  }

  if (!userId || !newPassword) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500
    });
  }
}
