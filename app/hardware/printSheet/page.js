"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const PrintSheet = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Format current date with day name, date, and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
  };
  
  const [formData, setFormData] = useState({
    assetOwner: "",
    type: "",
    model: "",
    nodeName: "",
    serialNumber: "",
    
    issueDate: getCurrentDateTime(),
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
    if (!searchParams) return;
    
    // Load main form fields
    const fields = [
      "assetOwner", "type", "model", "nodeName", "serialNumber"
    ];

    const updatedData = {};
    fields.forEach((field) => {
      let value = null;

      // case-insensitive match
      for (const [key, val] of searchParams.entries()) {
        if (key.toLowerCase() === field.toLowerCase()) {
          value = val;
          break;
        }
      }

      if (value) updatedData[field] = value;
    });

    // Load accessories
    const updatedAccessories = { ...formData.accessories };
    Object.keys(formData.accessories).forEach((acc) => {
      const paramName = encodeURIComponent(acc).replace(/%20/g, '+');
      const value = searchParams.get(paramName) || searchParams.get(acc);
      if (value === "1" || value === "true") {
        updatedAccessories[acc] = true;
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...updatedData,
      accessories: updatedAccessories
    }));

    setLoading(false);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (accessory) => {
    setFormData(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: !prev.accessories[accessory]
      }
    }));
  };

  const handlePrintAndSave = async () => {
    try {
      setLoading(true);

      // Convert boolean accessories to "1" for API
      const accessoriesForAPI = {};
      Object.entries(formData.accessories).forEach(([key, value]) => {
        if (value === true) accessoriesForAPI[key] = "1";
      });

      const dataToSave = {
        ...formData,
        accessories: accessoriesForAPI
      };

      const response = await fetch("/api/savePrintData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        setTimeout(() => window.print(), 500);
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

    const baseUrl = `/stocks/view?SerialNumber=${encodeURIComponent(serialNumber)}`;
    
    const accessoriesQuery = Object.entries(formData.accessories)
      .filter(([_, value]) => value === true)
      .map(([key]) => `${encodeURIComponent(key)}=1`)
      .join("&");

    const finalUrl = accessoriesQuery ? `${baseUrl}&${accessoriesQuery}` : baseUrl;
    router.push(finalUrl);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-600">Loading asset information...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="w-[21cm] h-[29.7cm] mx-auto bg-white shadow-md text-black print:shadow-none border border-gray-300">
        {/* Asset management header */}
        <div className="flex justify-between px-4 py-2 border-b border-gray-300 text-xs">
          <div>{formData.issueDate}</div>
          <div>Asset management</div>
        </div>
        
        {/* Main content */}
        <div className="p-4 h-full">
          {/* SIEMENS header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold">SIEMENS</h1>
          </div>
          
          {/* Header information */}
          <div className="flex justify-end mb-2 text-xs">
            <div className="w-1/2">
              <div className="flex mb-2">
                <span className="w-16">Issue Date:</span>
                <input
                  type="text"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="border-b border-gray-500 flex-grow bg-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Form title */}
          <h2 className="text-center font-bold my-4 underline">Hardware Allocation & Receipt Form</h2>
          
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
            <div className="flex">
              <span className="w-16">Asset Owner:</span>
              <input
                type="text"
                name="assetOwner"
                value={formData.assetOwner}
                onChange={handleInputChange}
                className="border-b border-gray-500 flex-grow bg-transparent"
              />
            </div>
            
            <div className="flex">
              <span className="w-24">Type:</span>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border-b border-gray-500 flex-grow bg-transparent"
              />
            </div>
            <div className="flex">
              <span className="w-16">Model:</span>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="border-b border-gray-500 flex-grow bg-transparent"
              />
            </div>
            <div className="flex">
              <span className="w-24">Node Name:</span>
              <input
                type="text"
                name="nodeName"
                value={formData.nodeName}
                onChange={handleInputChange}
                className="border-b border-gray-500 flex-grow bg-transparent"
              />
            </div>
            <div className="flex">
              <span className="w-16">Serial Number:</span>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                className="border-b border-gray-500 flex-grow bg-transparent"
              />
            </div>
          </div>
          
          {/* Accessories section */}
          <div className="mt-6 mb-4">
            <h3 className="font-bold text-xs mb-2">Accessories:</h3>
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-1 text-left">Item</th>
                  <th className="border border-gray-400 p-1 text-center w-16">QTY</th>
                  <th className="border border-gray-400 p-1 text-center w-16">Issued</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.accessories).map(([item, checked]) => (
                  <tr key={item}>
                    <td className="border border-gray-400 p-1">{item}</td>
                    <td className="border border-gray-400 p-1 text-center">
                      {checked ? "01" : "00"}
                    </td>
                    <td className="border border-gray-400 p-1 text-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxChange(item)}
                        className="h-3 w-3"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Signatures section */}
          <div className="text-xs mt-8">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Name & Sign of Issuing Person:</p>
                <div className="border-b border-gray-400 w-64 h-6 mt-4"></div>
              </div>
              <div>
                <p className="font-bold">Name & Sign of Carrying Person:</p>
                <div className="border-b border-gray-400 w-64 h-6 mt-4"></div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="font-bold">
                I hereby confirm that I have received the above-mentioned items.
              </p>
              <p className="mt-2 font-bold">
                System Status: Connected / Not Connected
              </p>
            </div>
            
            <div className="mt-10">
              <p className="font-bold">Name & Sign of receiving Person:</p>
              <div className="border-b border-gray-400 w-64 h-6 mt-4"></div>
            </div>
          </div>
        </div>
        
        {/* Footer with page number */}
        <div className="absolute bottom-2 right-4 text-xs print:block hidden">1/1</div>
      </div>

      {/* Action buttons - hidden when printing */}
      <div className="flex justify-center mt-4 space-x-4 print:hidden">
        <button
          onClick={handlePrintAndSave}
          disabled={loading}
          className="bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-600 transition-colors"
        >
          {loading ? "Processing..." : "Print & Save"}
        </button>

        <button
          onClick={handleViewAsset}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition-colors"
        >
          View Asset
        </button>
      </div>
    </div>
  );
};

export default PrintSheet;
