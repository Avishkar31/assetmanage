"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "GET" });
    router.push("/login"); // Redirect to login after logout
  };

  return <button onClick={handleLogout}>Logout</button>;
}
