"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const PrintSheet = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    poNumber: "",
    orderNumber: "",
    issueTo: "",
    deskLocation: "",
    category: "",
    type: "",
    model: "",
    nodeName: "",
    serialNumber: "",
    allocation: "",
    period: "",
    issueDate: new Date().toLocaleDateString(),
    accessories: {
      CPU: false,
      "LCD Monitor": false,
      "Docking Station": false,
      Keyboard: false,
      Mouse: false,
      "Power Adapter (Laptop)": false,
      "Power Adaptor (Docking station)": false,
      "Laptop Bag": false,
      "Modular Battery": false,
      "Laptop Lock": false,
      "Internal HDD/ External HDD": false,
      Headphone: false,
      Cardreader: false,
      Printer: false,
      Mobile: false
    }
  });

  // Load data from URL parameters efficiently
  useEffect(() => {
    if (!searchParams) return;

    const fields = [
      "poNumber",
      "orderNumber",
      "issueTo",
      "deskLocation",
      "category",
      "type",
      "model",
      "nodeName",
      "serialNumber"
    ];

    const updatedData = {};
    fields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) updatedData[field] = value;
    });

    // Handle accessories from URL params
    const accessoriesFromParams = {};
    Object.keys(formData.accessories).forEach((acc) => {
      const value = searchParams.get(acc);
      if (value) accessoriesFromParams[acc] = value === "1";
    });

    setFormData((prev) => ({
      ...prev,
      ...updatedData,
      accessories: {
        ...prev.accessories,
        ...accessoriesFromParams
      }
    }));

    setLoading(false);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (accessory) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: !prev.accessories[accessory] ? "1" : ""
      }
    }));
  };

  // Optimize save and print functionality
  const handlePrintAndSave = async () => {
    try {
      setLoading(true);

      // Optimized to only send necessary data
      const dataToSave = {
        ...formData,
        serialNumber: formData.serialNumber,
        accessories: Object.fromEntries(
          Object.entries(formData.accessories).filter(
            ([_, value]) => value === "1"
          )
        )
      };

      const response = await fetch("/api/savePrintData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSave),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        window.print();
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAsset = () => {
    const serialNumber = formData.serialNumber;

    if (!serialNumber) {
      alert("Serial number is required to view asset");
      return;
    }

    // Construct accessories query string
    const accessoriesQuery = Object.entries(formData.accessories)
      .filter(([_, value]) => value === "1")
      .map(([key]) => `${encodeURIComponent(key)}=1`)
      .join("&");

    // Use router for navigation
    router.push(
      `/hardware/assetView?serialNumber=${encodeURIComponent(serialNumber)}${
        accessoriesQuery ? `&${accessoriesQuery}` : ""
      }`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading asset information...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="w-[21cm] h-[29.7cm] mx-auto bg-white p-4 text-black print:shadow-none border border-gray-300">
        {/* Header */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-bold font-mono mb-2 text-center">
            SIEMENS
          </h1>
          <div className="flex items-center mb-1 justify-end">
            <span className="font-semibold w-32">Issue Date:</span>
            <input
              type="text"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 text-sm bg-transparent w-32 ml-1"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1 justify-end">
            <span className="font-semibold w-32">PO No:</span>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 text-sm bg-transparent w-32 ml-1"
              readOnly
            />
          </div>
          <div className="flex items-center mb-1 justify-end">
            <span className="font-semibold w-32">Order No:</span>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 text-sm bg-transparent w-32 ml-1"
              readOnly
            />
          </div>
          <h2 className="text-lg font-semibold my-2 underline text-center">
            Hardware Allocation & Receipt Form
          </h2>
        </div>

        {/* User Info Section */}
        <div className="text-sm mb-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Issue To", key: "issueTo" },
              { label: "Desk Location", key: "deskLocation" },
              { label: "Category", key: "category" },
              { label: "Model", key: "model" },
              { label: "Node Name", key: "nodeName" },
              { label: "Serial Number", key: "serialNumber" }
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center mb-1">
                <span className="font-semibold w-32">{label}:</span>
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                  className="border-b border-gray-500 px-1 text-sm bg-transparent w-full ml-1"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Items Table */}
        <div>
          <h2 className="font-semibold mb-4">Accessories:</h2>
          <table className="w-full border-collapse border border-gray-400 text-sm mb-4 mx-1">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-1">Item</th>
                <th className="border border-gray-400 p-1">QTY</th>
                <th className="border border-gray-400 p-1">Issued</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData.accessories).map(([item, checked]) => (
                <tr key={item}>
                  <td className="border border-gray-400 p-1">{item}</td>
                  <td className="border border-gray-400 p-1 text-center">
                    {checked === "1" ? "01" : "00"}
                  </td>
                  <td className="border border-gray-400 p-1 text-center">
                    <input
                      type="checkbox"
                      checked={checked === "1"}
                      onChange={() => handleCheckboxChange(item)}
                      className="h-3 w-3"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="text-sm space-y-2">
          <div className="flex justify-between mb-6">
            <p>
              <strong>Name & Sign of Issuing Person:</strong> ___________
            </p>
            <p>
              <strong>Name & Sign of Carrying Person:</strong> ___________
            </p>
          </div>
        </div>

        <div className="text-sm space-y-2 mb-16">
          <p>
            <strong>
              I hereby confirm that I have received the above - mentioned items.
            </strong>
          </p>
          <p>
            <strong>System Status: Connected / Not Connected </strong>
          </p>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex justify-between mt-16">
            <p>
              <strong>Name & Sign of receiving Person:</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Print & Save Button */}
      <div className="flex justify-center mt-3 print:hidden">
        <button
          onClick={handlePrintAndSave}
          disabled={loading}
          className={`bg-teal-500 text-white px-5 py-2 rounded transition-colors text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          {loading ? "Processing..." : "Print & Save"}
        </button>

        <button
          onClick={handleViewAsset}
          disabled={loading}
          className={`bg-blue-500 text-white px-5 py-2 rounded transition-colors text-sm ml-3 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          View Asset
        </button>
      </div>
    </div>
  );
};

export default PrintSheet;
