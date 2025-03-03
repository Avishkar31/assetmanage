"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CounterPage() {
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const router = useRouter();

  // Fetch initial counts from database
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/keyboardMouse');
        const data = await response.json();
        setKeyboardCount(data.keyboardCount);
        setMouseCount(data.mouseCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const updateCounts = async (type, newCount) => {
    try {
      const response = await fetch('/api/keyboardMouse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, count: newCount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update counts');
      }
    } catch (error) {
      console.error("Error updating counts:", error);
    }
  };

  const handleKeyboardChange = async (newCount) => {
    setKeyboardCount(newCount);
    await updateCounts('keyboard', newCount);
  };

  const handleMouseChange = async (newCount) => {
    setMouseCount(newCount);
    await updateCounts('mouse', newCount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-6">Keyboard & Mouse Counter</h1>

      <div className="grid grid-cols-2 gap-6 bg-gray-700 p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Keyboards</h2>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold my-2">{keyboardCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg"
              onClick={() => handleKeyboardChange(keyboardCount + 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleKeyboardChange(Math.max(0, keyboardCount - 1))}
            >
              -
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Mice</h2>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold my-2">{mouseCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg"
              onClick={() => handleMouseChange(mouseCount + 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleMouseChange(Math.max(0, mouseCount - 1))}
            >
              -
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/stocks")}
        className="mt-6 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
      >
        Go to Stocks
      </button>
    </div>
  );
}
