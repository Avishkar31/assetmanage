"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [outlook, setOutlook] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("regular");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!outlook || !password || !department || !role) {
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
        body: JSON.stringify({ outlook, password, department, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={outlook}
          onChange={(e) => setOutlook(e.target.value)}
          placeholder="Outlook Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
