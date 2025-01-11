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
        setFormData(intitialFormData); // Set the form data with the API response
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();

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
    if (
      !formData.status ||
      !formData.issueTo ||
      !formData.defaultLocation ||
      !formData.checkinDate
    ) {
      alert(
        "Please fill in all mandatory fields: Status, Issue To, Default Location, and Check-in Date."
      );
      return;
    }

    const ddata = {
      nodeName: formData.nodeName,
      status: formData.status,
      issueTo: formData.issueTo,
      storeLocation: formData.defaultLocation,
      note: formData.note || "Checked in after repair",
      checkType: "checkin",
      checkinDate: formData.checkinDate,
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
        alert("Asset Check-In successfully");
        router.push("stocks/allassets");
      } else {
        alert("Failed to check-in asset!");
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
                Status <span className="text-red-500">*</span>
              </label>
              <div className="w-3/5 relative">
                <input
                  type="text"
                  id="status"
                  value={formData.status}
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

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="issueTo" className="w-52 text-gray-500 mr-2">
                Issue To <span className="text-red-500">*</span>
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
              <label
                htmlFor="defaultLocation"
                className="w-52 text-gray-500 mr-2"
              >
                Default Location <span className="text-red-500">*</span>
              </label>
              <select
                id="defaultLocation"
                value={formData.defaultLocation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, defaultLocation: e.target.value })
                }
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              >
                <option value="">Select Location</option>
                <option value="Home">Home</option>
                <option value="MIS Store-2nd Compactor Floor">
                  MIS Store-2nd Compactor Floor
                </option>
                <option value="MIS Store-4th Floor">MIS Store-4th Floor</option>
                <option value="MIS Store-Basement">MIS Store-Basement</option>
                <option value="Buyback">Buyback</option>
              </select>
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="checkinDate" className="w-52 text-gray-500 mr-2">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="checkinDate"
                value={formData.checkinDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, checkinDate: e.target.value })
                }
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
                value={formData.note || ""}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="block p-2 w-2/3 text-sm bg-gray-900 border border-gray-700 rounded text-gray-400"
                placeholder="Note"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className={`px-5 py-2 mt-10 ${
                formData.status &&
                formData.issueTo &&
                formData.defaultLocation &&
                formData.checkinDate
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              } rounded`}
              onClick={handleCheckIn}
              disabled={
                !formData.status ||
                !formData.issueTo ||
                !formData.defaultLocation ||
                !formData.checkinDate
              }
            >
              Check-in to {formData.issueTo || "Username"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
