"use client";
import React, { useState } from "react";

import Sidebar from "@/components/Sidebar";

const checkout = () => {
  const [selectedRam, setSelectedRam] = useState("16 GB");
  const [selectedCondition, setSelectedCondition] = useState("Excellent");

  const ramOptions = [
    { label: "Inpool", available: true },

    { label: "MIS Store", available: true },

    { label: "Deplyed", available: true }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Stocks</h1>
          <div className="flex items-center">
            <div className="flex items-center relative">
              <button className="bg-none border-none cursor-pointer">
                <lord-icon
                  src="https://cdn.lordicon.com/fkdzyfle.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: 30, height: 50 }}
                ></lord-icon>
              </button>
              <input
                type="text"
                id="search-input"
                className="hidden p-1 ml-2"
                placeholder="Search..."
              />
              <button className="hidden ml-2 cursor-pointer">✖</button>
            </div>

            <div className="ml-4 cursor-pointer" title="logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
          </div>
        </header>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <header className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Adding Asset</h2>
            <div className="cursor-pointer">
              <i className="fas fa-times"></i>
            </div>
          </header>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="nodeName" className="w-52 text-gray-500 mr-2">
                Node Name
              </label>
              <input
                type="text"
                id="nodeName"
                placeholder="Enter the unique number"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="issueTo" className="w-52 text-gray-500 mr-2">
                Issue to
              </label>
              <input
                type="text"
                id="issueTo"
                placeholder="Enter the username"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="status" className="w-52 text-gray-500 mr-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {ramOptions.map((option) => (
                    <button
                      key={option.label}
                      className={`px-4 py-2 rounded border ${
                        option.available
                          ? selectedRam === option.label
                            ? "bg-blue-500 text-white border-transparent"
                            : "bg-white text-black border-gray-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        option.available && setSelectedRam(option.label)
                      }
                      disabled={!option.available}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="checkout" className="w-52 text-gray-500 mr-2">
                Checkout Date
              </label>
              <input
                type="date"
                id="checkout"
                placeholder="Enter the unique number"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="message" className="w-52 text-gray-500 mr-2">
                Note
              </label>
              <textarea
                id="message"
                rows="3"
                class="block p-2 w-2/3 text-sm text-gray-900 bg-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Note"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="px-5 py-2 mt-10 bg-blue-500 text-white rounded">
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default checkout;
