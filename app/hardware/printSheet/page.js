"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

const PrintSheet = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    issuedTo: "",
    deskLocation: "",
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
    const issuedTo = searchParams.get('issuedTo');
    const model = searchParams.get('model');
    const nodeName = searchParams.get('nodeName');
    const serialNumber = searchParams.get('serialNumber');

    setFormData(prev => ({
      ...prev,
      issuedTo: issuedTo || "",
      model: model || "",
      nodeName: nodeName || "",
      serialNumber: serialNumber || ""
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
      window.print();
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
          <div className="text-sm text-right">
            <div className="mb-1">
              <span className="font-semibold">Issue Date:</span>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className="border-b border-gray-500 px-1 text-sm bg-transparent w-32 ml-1"
              />
            </div>
            <div className="mb-1">
              <span className="font-semibold">PO No:</span>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                className="border-b border-gray-500 px-1 text-sm bg-transparent w-28 ml-1"
              />
            </div>
            <div>
              <span className="font-semibold">Order No:</span>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                className="border-b border-gray-500 px-1 text-sm bg-transparent w-28 ml-1"
              />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-center my-2 underline">
            Hardware Allocation & Receipt Form
          </h2>
        </div>

        {/* User Info Section */}
        <div className="text-sm mb-6">
          <div className="flex gap-12">
            <div className="flex-1">
              <div className="mb-2">
                <label className="font-semibold">Issue To:</label>
                <input
                  type="text"
                  name="issuedTo"
                  value={formData.issuedTo}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent w-3/4"
                  readOnly
                />
              </div>
              <div className="mb-3 flex items-center">
                <div className="flex items-center">
                  <label className="font-semibold mr-2">Desk</label>
                  <label className="font-semibold">Location:</label>
                </div>
                <input
                  type="text"
                  name="deskLocation"
                  value={formData.deskLocation}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-1 text-sm bg-transparent w-1/2"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent w-3/4"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Allocation:</label>
                <input
                  type="text"
                  name="allocation"
                  value={formData.allocation}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent"
                  placeholder="Permanent / Temporary"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <label className="font-semibold">Model:</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent w-3/4"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Node Name:</label>
                <input
                  type="text"
                  name="nodeName"
                  value={formData.nodeName}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent w-3/4"
                  readOnly
                />
              </div>
              <div className="mb-2 flex items-center">
                <div className="flex items-center">
                  <label className="font-semibold mr-2">Serial</label>
                  <label className="font-semibold">Number:</label>
                </div>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-1 text-sm bg-transparent w-1/2"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Period:</label>
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="ml-1 border-b border-gray-500 px-1 text-sm bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Items Table */}
        <div>
          <h2 className="font-semibold mb-2">Accessories:</h2>
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
                  <td className="border border-gray-400 p-1 text-center">{checked === "1" ? "01" : "00"}</td>
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
        <div className="text-sm space-y-3">
          <div className="flex justify-between mb-8">
            <p className="mb-1">
              <strong>Name & Sign of Issuing Person:</strong> ___________
            </p>
            <p className="mb-1">
              <strong>Name & Sign of Carrying Person:</strong> ___________
            </p>
          </div>

          <div>
            <p className="mb-6">
              I hereby confirm that I have received the above-mentioned items.
            </p>
            <div className="flex justify-between">
              <p className="mb-1">
                <strong>System Status:</strong> Connected / Not Connected
              </p>
              <p>
                <strong>Name & Sign of Receiving Person:</strong> ___________
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print & Save Button - Hidden during printing */}
      <div className="flex justify-center mt-3 print:hidden">
        <button
          onClick={handlePrintAndSave}
          className="bg-teal-500 text-white px-5 py-2 rounded hover:bg-teal-600 transition-colors text-sm"
        >
          Print & Save
        </button>
      </div>
    </div>
  );
};

export default PrintSheet;
