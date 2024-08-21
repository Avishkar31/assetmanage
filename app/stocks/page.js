"use client";
import Link from "next/link";
import Sidebar from "@/components/Sidebar"
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

function Page() {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const reportsRef = useRef(null);

  const toggleDropdown = (setter) => {
    setter((prev) => !prev);
  };

  const handleClickOutside = (ref, setter) => (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setter(false);
    }
  };


  useEffect(() => {
    if (isReportsOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    };
  }, [isReportsOpen]);



  return (
    <main>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar/>
        <div className="flex-1 p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl">OVERVIEW</h1>
              <p className="text-gray-400">Welcome to store</p>
            </div>
            <div className="flex items-center">
              <div className={`relative flex items-center mr-5`}>
                <button className="text-white">
                  {/* Placeholder for search icon */}
                </button>
                {false && (
                  <>
                    <input
                      type="text"
                      className="border border-teal-500 p-1 rounded bg-gray-800 text-white ml-2"
                      placeholder="Search..."
                    />
                    <button className="text-white ml-2">✖</button>
                  </>
                )}
              </div>
              <div className="relative">
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => toggleDropdown(setIsReportsOpen)}
                >
                  Reports
                  <span className="ml-2">
                    {isReportsOpen ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                </button>
                {isReportsOpen && (
                  <ul className="absolute bg-gray-900 rounded-lg p-2 mt-2  left-0 w-56 top-full flex flex-col">
                    <li className="my-2">
                      <a href="#" className="text-gray-400 hover:text-white">
                        Extract All Asset
                      </a>
                    </li>
                    <li className="my-2">
                      <a href="#" className="text-gray-400 hover:text-white">
                        Extract Inpool
                      </a>
                    </li>
                    <li className="my-2">
                      <a href="#" className="text-gray-400 hover:text-white">
                        Extract Inactive
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gray-800 p-5 rounded-lg text-center">
              <h3 className="text-lg">All assets</h3>
              <p className="text-2xl">2,361</p>
              <span className="text-teal-500">+12%</span>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg text-center">
              <h3 className="text-lg text-green-500">Inpool</h3>
              <p className="text-2xl">1,741</p>
              <span className="text-teal-500">-53%</span>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg text-center">
              <h3 className="text-lg text-yellow-500">New purchase</h3>
              <p className="text-2xl">5</p>
              <span className="text-teal-500">+2%</span>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg text-center">
              <h3 className="text-lg text-red-500">Inactive</h3>
              <p className="text-2xl">5</p>
              <span className="text-teal-500">+2%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <h3 className="text-lg text-white-500">Recent Killdisk</h3>
              <p className="text-2xl">5</p>
              <span className="text-teal-500">Since last month</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <h3 className="text-lg text-purple-500">Assigned</h3>
              <p className="text-2xl">5</p>
              <span className="text-teal-500">+2%</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <h3 className="text-lg text-white-500">
                Today's Hardware Allocation
              </h3>
              <p className="text-2xl">5</p>
              <span className="text-teal-500">Last 24 hours</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Assets Timeline</h2>
              <canvas id="lineChart" height="150"></canvas>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Category wise Assets</h2>
              <canvas id="pieChart" height="150"></canvas>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Assets Department Wise</h2>
              <canvas id="barChart" height="150"></canvas>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Manufacturer Wise</h2>
              <canvas id="pieChart2" height="150"></canvas>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
