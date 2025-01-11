"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // To manage errors
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      router.push("/"); // Redirect to the home page (or dashboard) after login
    } else {
      const error = await res.json();
      setError(error.message); // Display the error message
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="heading">Login</h2>
        {error && <p className="errorMessage">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="inputField"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="inputField"
        />
        <button type="submit" className="submitButton">
          Login
        </button>
      </form>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }

        .form {
          width: 100%;
          max-width: 400px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .heading {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
        }

        .inputField {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        .inputField:focus {
          border-color: #0070f3;
          outline: none;
        }

        .submitButton {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .submitButton:hover {
          background-color: #005bb5;
        }

        .submitButton:focus {
          outline: none;
        }

        .errorMessage {
          color: red;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
