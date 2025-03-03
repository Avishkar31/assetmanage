"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const PrintSheet = () => {
  const searchParams = useSearchParams();
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

  useEffect(() => {
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

    const updatedData = fields.reduce((acc, field) => {
      acc[field] = searchParams.get(field) || "";
      return acc;
    }, {});

    setFormData((prev) => ({
      ...prev,
      ...updatedData
    }));
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

  const handlePrintAndSave = async () => {
    try {
      console.table("formadagta", formData);
      const response = await fetch("/api/savePrintData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        window.print();
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="w-[21cm] h-[29.7cm] mx-auto bg-white p-6 text-black print:shadow-none">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-mono mb-3">SIEMENS</h1>
          <h2 className="text-lg font-semibold my-2 underline">
            Hardware Allocation & Receipt Form
          </h2>
        </div>

        {/* User Info Section */}
        <div className="text-sm mb-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              "Issue To",
              "Desk Location",
              "Category",
              "Model",
              "Node Name",
              "Serial Number"
            ].map((label) => (
              <div key={label} className="flex items-center mb-2">
                <span className="font-semibold w-32">{label}:</span>
                <input
                  type="text"
                  name={label.toLowerCase().replace(" ", "")}
                  value={formData[label.toLowerCase().replace(" ", "")]}
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
          <h2 className="font-semibold mb-5">Accessories:</h2>
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
        <div className="text-sm space-y-3 ">
          <div className="flex justify-between mb-10">
            <p>
              <strong>Name & Sign of Issuing Person:</strong> ___________
            </p>
            <p>
              <strong>Name & Sign of Carrying Person:</strong> ___________
            </p>
          </div>
        </div>

        <div className="text-sm space-y-3 mb-20">
          <p>
            <strong>
              I hereby confirm that I have received the above - mentioned items.
            </strong>
          </p>
          <p>
            <strong>System Status: Connected / Not Connected </strong>
          </p>
        </div>

        <div className="text-sm space-y-3">
          <div className="flex justify-between mt-20">
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
          className="bg-teal-500 text-white px-5 py-2 rounded hover:bg-teal-600 transition-colors text-sm"
        >
          Print & Save
        </button>

        <button
          onClick={() => {
            const accessoriesQuery = Object.entries(formData.accessories)
              .map(([key, value]) => `${key}=${value}`)
              .join("&");

            alert("Print successful!");
            window.location.href = `/hardware/assetView?serialNumber=${formData.serialNumber}&${accessoriesQuery}`;
          }}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition-colors text-sm ml-3"
        >
          View Asset
        </button>
      </div>
    </div>
  );
};

export default PrintSheet;
