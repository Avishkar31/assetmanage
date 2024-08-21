"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "@/components/Sidebar";

function Page() {
  return (
    <main>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl">Monitor Review</h1>
              <p className="text-gray-400">Welcome to store</p>
            </div>
            <div className="flex items-center">
              <div className="relative flex items-center mr-5">
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
            </div>
          </header>
          <div className="flex gap-5">
            <section className="flex-1 bg-gray-800 p-4">
              <div>
                <h2 className="text-xl mb-2">Stocks Availability</h2>
                <p>Stocks are available for Team Xyz</p>
                <div className="mt-4">
                  <label htmlFor="teams" className="block mb-2">
                    Teams:
                  </label>
                  <div className="flex">
                    <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {["All", "Team 1", "Team 2", "Team 3"].map(
                        (team, index) => (
                          <li
                            key={index}
                            className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                          >
                            <div className="flex items-center ps-3">
                              {/* <input
                                id={`${team
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}-checkbox`}
                                type="checkbox"
                                checked={selectedTeam === team}
                                onChange={() => handleCheckboxChange(team)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                              /> */}
                              {/* <label
                                htmlFor={`${team
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}-checkbox`}
                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                {team}
                              </label> */}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                    <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ms-4">
                      {["Team 4", "Team 5", "Team 6", "Team 7"].map(
                        (team, index) => (
                          <li
                            key={index}
                            className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                          >
                            <div className="flex items-center ps-3">
                              {/* <input
                                id={`${team
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}-checkbox`}
                                type="checkbox"
                                checked={selectedTeam === team}
                                onChange={() => handleCheckboxChange(team)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                              /> */}
                              {/* <label
                                htmlFor={`${team
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}-checkbox`}
                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                {team}
                              </label> */}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <section className="flex-1 bg-gray-800 p-4">
              <form>
                <h3 className="text-xl mb-2">
                  Adding Monitor in <span>xyz</span>
                </h3>
                <div className="mb-4">
                  <label htmlFor="model" className="block mb-1">
                    Model Name:
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    className="border border-gray-600 p-2 bg-gray-800 text-white w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="serial" className="block mb-1">
                    Serial Number:
                  </label>
                  <input
                    type="text"
                    id="serial"
                    name="serial"
                    className="border border-gray-600 p-2 bg-gray-800 text-white w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="po" className="block mb-1">
                    PO Number:
                  </label>
                  <input
                    type="text"
                    id="po"
                    name="po"
                    className="border border-gray-600 p-2 bg-gray-800 text-white w-full"
                  />
                </div>
                <div>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded">
                    Add
                  </button>
                </div>
              </form>
            </section>
          </div>
          <section className="mt-5">
            <h3 className="text-xl mb-2">Monitors in xyz</h3>
            <table className="table-auto w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="border-b p-2">Model Name</th>
                  <th className="border-b p-2">Serial Number</th>
                  <th className="border-b p-2">PO Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b p-2">HP 24</td>
                  <td className="border-b p-2">1234567890</td>
                  <td className="border-b p-2">PO123</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Page;
