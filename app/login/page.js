"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { connectDb } from "lib/dbConnect";

export default function Login() {
  const [error, setError] = useState("");
  const [siemensId, setSiemensId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic client-side validation
    if (!siemensId || !password) {
      setError("Both Siemens ID and password are required.");
      return;
    }

    setError(""); // Reset error state before API call

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          siemensId,
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
    <section className="w-full h-screen flex items-center justify-center bg-neutral-900">
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

        <label className="w-full text-sm text-gray-600">Siemens ID</label>
        <input
          type="text"
          placeholder="Siemens ID"
          className="w-full h-10 border border-gray-300 rounded px-3 bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={siemensId}
          onChange={(e) => setSiemensId(e.target.value)}
          name="siemensId"
        />

        <label className="w-full text-sm text-gray-600">Password</label>
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-10 border border-gray-300 rounded px-3 bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

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
          Please contact your administrator for access
        </Link>
      </form>
    </section>
  );
}
