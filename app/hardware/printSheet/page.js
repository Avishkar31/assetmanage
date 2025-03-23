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

  const handlePrintAndSave = async () => {
    try {
      setLoading(true);

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
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        setTimeout(() => {
          window.print();
        }, 500);
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

    const baseUrl = `/stocks/view?SerialNumber=${encodeURIComponent(
      serialNumber
    )}`;
    const accessoriesQuery = Object.entries(formData.accessories)
      .filter(([_, value]) => value === "1")
      .map(([key]) => `${encodeURIComponent(key)}=1`)
      .join("&");

    const finalUrl = accessoriesQuery
      ? `<span class="math-inline">\{baseUrl\}&</span>{accessoriesQuery}`
      : baseUrl;

    router.push(finalUrl);
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
      <div className="w-[21cm] mx-auto bg-white p-4 text-black print:shadow-none border border-gray-300">
        <div className="text-right mb-2">
          <h1 className="text-xl font-bold font-mono mb-1 text-center">
            SIEMENS
          </h1>
          <div className="flex items-center mb-0.5 justify-end text-xs">
            <span className="font-semibold w-24">Issue Date:</span>
            <input
              type="text"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 bg-transparent w-24 ml-1"
              readOnly
            />
          </div>
          <div className="flex items-center mb-0.5 justify-end text-xs">
            <span className="font-semibold w-24">PO No:</span>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 bg-transparent w-24 ml-1"
              readOnly
            />
          </div>
          <div className="flex items-center mb-0.5 justify-end text-xs">
            <span className="font-semibold w-24">Order No:</span>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="border-b border-gray-500 px-1 bg-transparent w-24 ml-1"
              readOnly
            />
          </div>
          <h2 className="text-base font-semibold my-1 underline text-center">
            Hardware Allocation & Receipt Form
          </h2>
        </div>

        <div className="text-xs mb-2">
          <div className="grid grid-cols-2 gap-1">
            {[
              { label: "Issue To", key: "issueTo" },
              { label: "Desk Location", key: "deskLocation" },
              { label: "Category", key: "category" },
              { label: "Model", key: "model" },
              { label: "Node Name", key: "nodeName" },
              { label: "Serial Number", key: "serialNumber" }
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center mb-0.5">
                <span className="font-semibold w-24">{label}:</span>
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                  className="border-b border-gray-500 px-1 bg-transparent w-full ml-1"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2 text-xs">Accessories:</h2>
          <table className="w-full border-collapse border border-gray-400 text-xs mb-2 mx-1">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-0.5">Item</th>
                <th className="border border-gray-400 p-0.5">QTY</th>
                <th className="border border-gray-400 p-0.5">Issued</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData.accessories).map(([item, checked]) => (
                <tr key={item}>
                  <td className="border border-gray-400 p-0.5">{item}</td>
                  <td className="border border-gray-400 p-0.5 text-center">
                    {checked === "1" ? "01" : "00"}
                  </td>
                  <td className="border border-gray-400 p-0.5 text-center">
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

        <div className="text-xs space-y-1">
          <div className="flex justify-between mb-3">
            <p>
              <strong>Name & Sign of Issuing Person:</strong> ___________
            </p>
            <p>
              <strong>Name & Sign of Carrying Person:</strong> ___________
            </p>
          </div>
        </div>

        <div className="text-xs space-y-1 mb-8">
          <p>
            <strong>
              I hereby confirm that I have received the above - mentioned items.
            </strong>
          </p>
          <p>
            <strong>System Status: Connected / Not Connected </strong>
          </p>
        </div>

        <div className="text-xs space-y-1">
          <div className="flex justify-between mt-8">
            <p>
              <strong>Name & Sign of receiving Person:</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2 print:hidden">
        <button
          onClick={handlePrintAndSave}
          disabled={loading}
          className={`bg-teal-500 text-white px-4 py-1 rounded transition-colors text-sm ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          {loading ? "Processing..." : "Print & Save"}
        </button>

        <button
          onClick={handleViewAsset}
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-1 rounded transition-colors text-sm ml-2 ${
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
