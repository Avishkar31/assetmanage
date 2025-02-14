"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [siemensId, setSiemensId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("regular");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!siemensId || !password || !department || !role) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siemensId, password, department, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

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
          Sign Up
        </h1>

        <label className="w-full text-sm text-gray-600">Siemens ID</label>
        <input
          type="text"
          placeholder="Siemens ID"
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={siemensId}
          onChange={(e) => setSiemensId(e.target.value)}
          name="siemensId"
          required
        />

        <label className="w-full text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          required
        />

        <label className="w-full text-sm text-gray-600">Department</label>
        <input
          type="text"
          placeholder="Department"
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          name="department"
          required
        />

        <label className="w-full text-sm text-gray-600">Role</label>
        <select
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          name="role"
        >
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full h-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </section>
  );
}
