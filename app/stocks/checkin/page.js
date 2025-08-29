"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "components/Sidebar";
import { useRouter } from "next/navigation";

const statusOptions = [
  { label: "Default", description: "" },
  {
    label: "MISStock",
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
  const [formData, setFormData] = useState({
    nodeName: "",
    status: "",
    assetOwner: "",
    defaultLocation: "",
    checkinDate: "",
    note: ""
  });
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSection, setOpenSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    const urlParams = new URLSearchParams(window.location.search);
    const sn = urlParams.get("SerialNumber");
    setSerialNumber(sn);

    const fetchAssetData = async () => {
      if (!sn) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/asset/get?serialNumber=${sn}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch asset: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setFormData({
          nodeName: data.nodeName || "",
          status: data.status || "",
          assetOwner: data.assetOwner || "",
          defaultLocation: data.defaultLocation || "",
          checkinDate: new Date().toISOString().split("T")[0], // Today's date as default
          note: ""
        });
      } catch (err) {
        console.error("Error fetching asset data:", err);
        setError("Could not load asset information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();

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
    // Validate required fields
    if (!formData.status || !formData.assetOwner || !formData.defaultLocation || !formData.checkinDate) {
      setError("Please fill in all mandatory fields: Status, Asset Owner, Location, and Check-in Date.");
      return;
    }

    // Validate status for check-in
    const invalidStatuses = ["Deployed", "Buyback", "Disposed"];
    if (invalidStatuses.includes(formData.status)) {
      setError(`Status cannot be '${formData.status}' for check-in. Please select a different status.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get user information from local storage
      const storedUserData = JSON.parse(localStorage.getItem("user")) || {};
      
      const checkInData = {
        serialNumber: serialNumber,
        nodeName: formData.nodeName,
        status: formData.status,
        assetOwner: formData.assetOwner,
        storeLocation: formData.defaultLocation, // This maps to storeLocation in the API
        note: formData.note || "Standard check-in",
        checkinDate: formData.checkinDate,
        assetUser: storedUserData.siemensId || "unknown-user" // Fallback if not logged in
      };

      console.log("Sending check-in data:", checkInData);
      
      const response = await fetch("/api/asset/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkInData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check-in asset");
      }

      const result = await response.json();
      console.log("Check-in successful:", result);
      alert("Asset checked in successfully!");
      router.push("/stocks/allasset");
    } catch (err) {
      console.error("Check-in error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nodeName) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-5 flex justify-center items-center">
          <p>Loading asset information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <section className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Stocks</h1>
        </section>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <header className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Check-in Asset</h2>
            <div className="cursor-pointer" onClick={() => router.push("/stocks/allasset")}>
              <i className="fas fa-times">✖</i>
            </div>
          </header>

          {error && (
            <div className="mb-4 p-3 bg-red-800 border border-red-600 text-white rounded">
              {error}
            </div>
          )}

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
                onChange={handleInputChange}
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
                  {openSection === "status" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
                {openSection === "status" && (
                  <div
                    ref={dropdownRef}
                    className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full z-10"
                  >
                    {statusOptions.map((option) => (
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
              {statusOptions.find((option) => option.label === formData.status)
                ?.description || "Select a status"}
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="assetOwner" className="w-52 text-gray-500 mr-2">
                Asset Owner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="assetOwner"
                value={formData.assetOwner}
                onChange={handleInputChange}
                placeholder="Enter the name"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="defaultLocation" className="w-52 text-gray-500 mr-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                id="defaultLocation"
                value={formData.defaultLocation}
                onChange={(e) => setFormData({ ...formData, defaultLocation: e.target.value })}
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              >
                <option value="">Select Location</option>
                <option value="Home">Home</option>
                <option value="MIS Store-2nd Compactor Floor">MIS Store-2nd Compactor Floor</option>
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
                value={formData.checkinDate}
                onChange={handleInputChange}
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
                value={formData.note}
                onChange={handleInputChange}
                className="block p-2 w-2/3 text-sm bg-gray-900 border border-gray-700 rounded text-gray-400"
                placeholder="Add notes about this check-in"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className={`px-5 py-2 mt-10 ${
                !loading && formData.status && formData.assetOwner && 
                formData.defaultLocation && formData.checkinDate
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              } rounded`}
              onClick={handleCheckIn}
              disabled={loading || !formData.status || !formData.assetOwner || 
                       !formData.defaultLocation || !formData.checkinDate}
            >
              {loading ? "Processing..." : `Check-in to ${formData.assetOwner || "User"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;