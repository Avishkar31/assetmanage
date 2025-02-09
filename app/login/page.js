"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { connectDb } from "lib/dbConnect";

export default function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setError(""); // Reset error state before API call

    try {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in.");
      }
      localStorage.setItem("token", data.token);
      // Redirect to home or another page after successful login
      router.push("/stocks");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const isConnected = await connectDb();
      if (!isConnected) {
        return <p>Oops, we are sorry!!</p>;
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-4 
        border border-gray-300 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="w-full text-red-600 text-sm mb-2">{error}</div>
        )}
        <h1 className="mb-4 w-full text-2xl font-bold text-gray-700">
          Sign In
        </h1>

        <label className="w-full text-sm text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />

        <label className="w-full text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />

        <button
          type="submit"
          className="w-full h-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>

        <Link
          href="/signup"
          className="text-sm text-gray-500 mt-2 hover:text-blue-600 transition duration-150"
        >
          Don't have an account? Sign up
        </Link>
      </form>
    </section>
  );
}
