"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CounterPage() {
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [displayKeyboardCount, setDisplayKeyboardCount] = useState(0);
  const [displayMouseCount, setDisplayMouseCount] = useState(0);
  const router = useRouter();

  // Load counts from local storage on component mount
  useEffect(() => {
    const storedDisplayKeyboardCount = localStorage.getItem("displayKeyboardCount") || "0";
    const storedDisplayMouseCount = localStorage.getItem("displayMouseCount") || "0";

    setKeyboardCount(parseInt(storedDisplayKeyboardCount));
    setMouseCount(parseInt(storedDisplayMouseCount));
    setDisplayKeyboardCount(parseInt(storedDisplayKeyboardCount));
    setDisplayMouseCount(parseInt(storedDisplayMouseCount));
  }, []);

  const handleSubmit = () => {
    // Only update display counts and localStorage when submitting
    localStorage.setItem("displayKeyboardCount", keyboardCount.toString());
    localStorage.setItem("displayMouseCount", mouseCount.toString());
    setDisplayKeyboardCount(keyboardCount);
    setDisplayMouseCount(mouseCount);
    // router.push("/stocks");
  };

  const handleCancel = () => {
    // Reset working counts to display counts without saving
    setKeyboardCount(displayKeyboardCount);
    setMouseCount(displayMouseCount);
    router.push("/stocks");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Keyboard & Mouse Counter</h1>

      <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Keyboards</h2>
          <div className="flex flex-col items-center">
            <p className="text-lg">Current Count: {displayKeyboardCount}</p>
            <p className="text-3xl font-bold my-2">{keyboardCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setKeyboardCount(keyboardCount + 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setKeyboardCount(Math.max(0, keyboardCount - 1))}
            >
              -
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Mice</h2>
          <div className="flex flex-col items-center">
            <p className="text-lg">Current Count: {displayMouseCount}</p>
            <p className="text-3xl font-bold my-2">{mouseCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setMouseCount(mouseCount + 1)}
            >
              +
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setMouseCount(Math.max(0, mouseCount - 1))}
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="flex mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mr-4"
        >
          Submit
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Go to Stocks
        </button>
      </div>
    </div>
  );
}
