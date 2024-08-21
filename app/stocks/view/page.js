"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar"

const view = () => {
  const [dropdown, setDropdown] = useState(false);
  const [accessoriesMenu, setAccessoriesMenu] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [requestsMenu, setRequestsMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const toggleDropdown = () => setDropdown(!dropdown);
  const toggleAccessoriesMenu = () => setAccessoriesMenu(!accessoriesMenu);
  const toggleSettingsMenu = () => setSettingsMenu(!settingsMenu);
  const toggleRequestsMenu = () => setRequestsMenu(!requestsMenu);
  const toggleSearch = () => setSearchActive(!searchActive);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar/>
      <div className="flex-1 p-6 bg-gray-900">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Stocks</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="bg-transparent border-none cursor-pointer"
                onClick={toggleSearch}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/fkdzyfle.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: "30px", height: "50px" }}
                />
              </button>
              {searchActive && (
                <div className="flex items-center">
                  <input
                    type="text"
                    className="bg-gray-800 text-gray-400 px-2 py-1 rounded-lg ml-2"
                    placeholder="Search..."
                  />
                  <button className="text-white ml-2" onClick={toggleSearch}>
                    ✖
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                Download Reports
              </button>
              <div className="absolute right-0 bg-gray-800 shadow-lg rounded-lg mt-2 w-48">
                <a href="#" className="block py-2 px-4 hover:bg-gray-700">
                  Report 1
                </a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-700">
                  Report 2
                </a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-700">
                  Report 3
                </a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-700">
                  Report 4
                </a>
              </div>
            </div>
            <div className="text-white cursor-pointer" title="logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
          </div>
        </header>
        <div className="flex gap-6">
          <div className="flex-1 bg-gray-800 p-6 rounded-lg">
            <header className="mb-4">
              <h3 className="text-lg sticky">View Asset</h3>
            </header>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>{" "}
                <span>In Pool</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Name:</span>{" "}
                <span>pl2inpuno389nb</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Serial:</span>{" "}
                <span>J65LIT2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>{" "}
                <span>Hardware</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>{" "}
                <span>EX1234</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Expires:</span>{" "}
                <span>Example Corp</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Default Location:</span>{" "}
                <span>IT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Owner:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost Center:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Received Date:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Condition:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Note:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MIS Store Location:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PO Number:</span>{" "}
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order:</span>{" "}
                <span>John Doe</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-2 ">
            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Checkout
            </button>
            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Update
            </button>
            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default view;
