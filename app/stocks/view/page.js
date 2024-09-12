"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

// Example asset data (this would typically come from an API or database)
const assetData = {
  status: "In Pool",
  assetName: "pl2inpuno389nb",
  serial: "J65LIT2",
  category: "Hardware",
  model: "EX1234",
  expires: "2024-12-31",
  location: "IT",
  assetOwner: "John Doe",
  costCenter: "Finance",
  receivedDate: "2023-08-01",
  condition: "Good",
  note: "Requires inspection next month",
  misStoreLocation: "Store 5",
  poNumber: "PO12345",
  order: "Order123"
};

const ViewAsset = () => {
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
      <Sidebar />
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
              {/* Dynamically render asset details */}
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span>{assetData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Name:</span>
                <span>{assetData.assetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Serial:</span>
                <span>{assetData.serial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span>{assetData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span>{assetData.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires:</span>
                <span>{assetData.expires}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Default Location:</span>
                <span>{assetData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Owner:</span>
                <span>{assetData.assetOwner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost Center:</span>
                <span>{assetData.costCenter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Received Date:</span>
                <span>{assetData.receivedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset Condition:</span>
                <span>{assetData.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Note:</span>
                <span>{assetData.note}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MIS Store Location:</span>
                <span>{assetData.misStoreLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PO Number:</span>
                <span>{assetData.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order:</span>
                <span>{assetData.order}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-2 ">
            {/* Action buttons */}
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
              Request to allocate
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

export default ViewAsset;
