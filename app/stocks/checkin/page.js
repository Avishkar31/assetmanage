"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

import Sidebar from "@/components/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";

const ramOptions = [
  { label: "Default", description: "" },
  {
    label: "Inpool",
    description: "✓  That status is deployable. This asset can be checked out.",
    color: "text-green-500"
  },
  {
    label: "New Purchase",
    description:
      "✗ That asset status is not deployable. This asset cannot be checked out.",
    color: "text-red-500"
  },
  {
    label: "MIS Store",
    description: "✓  That status is deployable. This asset can be checked out.",
    color: "text-green-500"
  },
  {
    label: "Buyback",
    description:
      "✗  That asset status is not deployable. This asset cannot be checked out.",
    color: "text-red-500"
  },
  {
    label: "Disposed",
    description:
      "✗  That asset status is not deployable. This asset cannot be checked out.",
    color: "text-red-500"
  },
  {
    label: "Inactive",
    description:
      "✗  That asset status is not deployable. This asset cannot be checked out.",
    color: "text-red-500"
  },
  {
    label: "Deployed",
    description: "✓  That status is deployable. This asset can be checked out.",
    color: "text-green-500"
  }
];

const Dashboard = () => {
  const [formData, setFormData] = useState({});
  const searchParams = useSearchParams();
  const serialNumber = searchParams.get("SerialNumber");
  const [openSection, setOpenSection] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenSection("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    const fetchFormData = async () => {
      try {
        const response = await fetch(
          `/api/asset/get?serialNumber=${serialNumber}`
        );
        const data = await response.json();
        const intitialFormData = {
          status: data.status,
          issueTo: data.issueTo,
          nodeName: data.nodeName
        };
        console.log("dfa", data);
        setFormData(intitialFormData); // Set the form data with the API response
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
    // using a serial number
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serialNumber]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCheckIn = async () => {
    const ddata = {
      nodeName: formData.nodeName,
      status: formData.status,
      issueTo: formData.issueTo,
      storeLocation: "Storage Room A",
      note: "Checked in after repair",
      checkType: "checkin",
      serialNumber: serialNumber
    };
    try {
      const response = await fetch("/api/asset/checkAsset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ddata)
      });
      if (response.ok) {
        await response.json();
        alert("Asset CheckIn successfully");
        // Navigate to the allassets page after successful check-in
        router.push("stocks/allassets");
      } else {
        alert("Failed to checkin asset!");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <section className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Stocks</h1>
        </section>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <header className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Checkin Asset</h2>
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
                placeholder="Enter the Node Name"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                value={formData.nodeName}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="status" className="w-52 text-gray-500 mr-2">
                Status
              </label>
              <div className="w-3/5 relative">
                <input
                  type="text"
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  onClick={() => toggleSection("status")}
                  className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer w-full"
                  readOnly
                />
                <span className="absolute right-2 top-2 text-gray-500">
                  {openSection === "status" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>

                {openSection === "status" && (
                  <div
                    ref={dropdownRef}
                    className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full z-10"
                  >
                    {ramOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            status: option.label
                          });
                          toggleSection("status");
                        }}
                        className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                      >
                        <span className={`${option.color} mr-2`}></span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1 ml-56">
              {ramOptions.find((option) => option.label === formData.status)
                ?.description || "Select a status"}
            </div>
          </div>

          {/* Issue To */}
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="issueTo" className="w-52 text-gray-500 mr-2">
                Issue To
              </label>
              <input
                type="text"
                id="issueTo"
                value={formData.issueTo}
                onChange={handleInputChange}
                placeholder="Enter the name"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="Default" className="w-52 text-gray-500 mr-2">
                Default Location
              </label>
              <select
                id="defaultLocation"
                value={formData.defaultLocation}
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              >
                <option value="default">Default</option>
                <option value="default">Home</option>
                <option value="default">MIS Store-2nd Compactor Floor</option>
                <option value="default">MIS Store-4th Floor</option>
                <option value="default">MIS Store-Basement</option>
                <option value="default">Buyback</option>
              </select>
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="checkinDate" className="w-52 text-gray-500 mr-2">
                Checkin Date
              </label>
              <input
                type="date"
                id="checkinDate"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="note" className="w-52 text-gray-500 mr-2">
                Note
              </label>
              <textarea
                id="note"
                rows="3"
                className="block p-2 w-2/3 text-sm text-gray-900 bg-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Note"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="px-5 py-2 mt-10 bg-blue-500 text-white rounded"
              onClick={handleCheckIn}
            >
              Checkin to {formData.issueTo || "Username"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
