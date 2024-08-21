"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  IoCloseSharp,
  IoMdAdd,
  IoMdArrowDropup,
  IoMdArrowDropdown
} from "react-icons/io";

const AddAssetForm = () => {
  const [formData, setFormData] = useState({
    assetTag: "",
    nodeName: "",
    manufacturer: "",
    serialNumber: "",
    type: "",
    model: "",
    expires: "",
    category: "",
    status: "16 GB",
    department: "",
    issueTo: "",
    note: "",
    defaultLocation: "",
    costCenter: "",
    receivedDate: "",
    assetOwner: "",
    condition: "Excellent",
    storeLocation: "",
    killdiskDate: "",
    attachedFile: "",
    disposedDate: "",
    poNumber: "",
    order: "",
    purchaseDate: ""
  });

  const [selectedRam, setSelectedRam] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [openSection, setOpenSection] = useState("");

  const ramOptions = [
    { label: "Inpool", available: true },
    { label: "New Purchase", available: true },
    { label: "MIS Store", available: true },
    { label: "Buyback", available: true },
    { label: "Disposed", available: true },
    { label: "Inactive", available: true },
    { label: "Deplyed", available: true }
  ];

  const conditionOptions = [
    { label: "Excellent", available: true },
    { label: "Good", available: true },
    { label: "Fair", available: true },
    { label: "Bad", available: true }
  ];

  useEffect(() => {
    const fetchNextAssetTag = async () => {
      try {
        const response = await fetch("/api/getLatestAssetTag");
        const latestTag = await response.json();
        setFormData((prevData) => ({ ...prevData, assetTag: latestTag + 1 }));
      } catch (error) {
        console.error("Error fetching the latest asset tag:", error);
      }
    };

    fetchNextAssetTag();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Asset added successfully");
        // Handle success (e.g., clear form, redirect)
      } else {
        alert("Failed to add asset");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Stocks</h1>
          <div className="flex items-center">
            <div className="flex items-center relative">
              <button className="bg-none border-none cursor-pointer">
                <lord-icon
                  src="https://cdn.lordicon.com/fkdzyfle.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: 30, height: 50 }}
                ></lord-icon>
              </button>
              <input
                type="text"
                id="search-input"
                className="hidden p-1 ml-2"
                placeholder="Search..."
              />
              <button className="hidden ml-2 cursor-pointer">✖</button>
            </div>
            <div className="ml-4 cursor-pointer" title="logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
          </div>
        </header>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Adding Asset</h2>
            {/* <div className="cursor-pointer text-3xl ">
              <IoCloseSharp />
            </div> */}
          </div>
          <form onSubmit={handleSubmit}>
            {/* Asset Tag */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="assetTag" className="w-52 text-gray-500 mr-2">
                  Asset Tag
                </label>
                <input
                  type="text"
                  id="assetTag"
                  value={formData.assetTag}
                  onChange={handleInputChange}
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                  readOnly
                />
              </div>
            </div>

            {/* Node Name */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="nodeName" className="w-52 text-gray-500 mr-2">
                  Node Name
                </label>
                <input
                  type="text"
                  id="nodeName"
                  value={formData.nodeName}
                  onChange={handleInputChange}
                  placeholder="Enter the Node Name"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Manufacturer */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="manufacturer"
                  className="w-52 text-gray-500 mr-2"
                >
                  Manufacturer
                </label>
                <select
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleSelectChange}
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                >
                  <option value="default">Default</option>
                  <option value="hp">HP</option>
                  <option value="dell">Dell</option>
                  <option value="apple">Apple</option>
                  <option value="microsoft">Microsoft</option>
                </select>
              </div>
            </div>

            {/* Serial Number */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="serialNumber"
                  className="w-52 text-gray-500 mr-2"
                >
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Enter the serial Number"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
                <span className="ml-2">
                  <IoMdAdd />
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="type" className="w-52 text-gray-500 mr-2">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Type"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Model */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="model" className="w-52 text-gray-500 mr-2">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter the model number"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Expires */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="expires" className="w-52 text-gray-500 mr-2">
                  Expires
                </label>
                <input
                  type="date"
                  id="expires"
                  value={formData.expires}
                  onChange={handleInputChange}
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="category" className="w-52 text-gray-500 mr-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                >
                  <option value="default">Default</option>
                  <option value="desktop">Desktop</option>
                  <option value="laptop">Laptop</option>
                  <option value="monitor">Monitor</option>
                  <option value="printer">Printer</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="status" className="w-52 text-gray-500 mr-2">
                  Status
                </label>
                <div
                  className="w-3/5 relative"
                  onClick={() => toggleSection("status")}
                >
                  <input
                    type="text"
                    id="status"
                    value={formData.status}
                    readOnly
                    className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer"
                  />
                  <span className="absolute right-2 top-2 text-gray-500">
                    {openSection === "status" ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                  {openSection === "status" && (
                    <div className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full">
                      {ramOptions.map((option) => (
                        <div
                          key={option.label}
                          onClick={() => setSelectedRam(option.label)}
                          className="p-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="department" className="w-52 text-gray-500 mr-2">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter the department"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Issue To */}
            <div className="mb-4">
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

            {/* Note */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="note" className="w-52 text-gray-500 mr-2">
                  Note
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Default Location */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="defaultLocation"
                  className="w-52 text-gray-500 mr-2"
                >
                  Default Location
                </label>
                <input
                  type="text"
                  id="defaultLocation"
                  value={formData.defaultLocation}
                  onChange={handleInputChange}
                  placeholder="Enter default location"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Cost Center */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="costCenter" className="w-52 text-gray-500 mr-2">
                  Cost Center
                </label>
                <input
                  type="text"
                  id="costCenter"
                  value={formData.costCenter}
                  onChange={handleInputChange}
                  placeholder="Enter the cost center"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Received Date */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="receivedDate"
                  className="w-52 text-gray-500 mr-2"
                >
                  Received Date
                </label>
                <input
                  type="date"
                  id="receivedDate"
                  value={formData.receivedDate}
                  onChange={handleInputChange}
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Asset Owner */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="assetOwner" className="w-52 text-gray-500 mr-2">
                  Asset Owner
                </label>
                <input
                  type="text"
                  id="assetOwner"
                  value={formData.assetOwner}
                  onChange={handleInputChange}
                  placeholder="Enter the asset owner"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Condition */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label htmlFor="condition" className="w-52 text-gray-500 mr-2">
                  Condition
                </label>
                <div
                  className="w-3/5 relative"
                  onClick={() => toggleSection("condition")}
                >
                  <input
                    type="text"
                    id="condition"
                    value={formData.condition}
                    readOnly
                    className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer"
                  />
                  <span className="absolute right-2 top-2 text-gray-500">
                    {openSection === "condition" ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                  {openSection === "condition" && (
                    <div className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full">
                      {conditionOptions.map((option) => (
                        <div
                          key={option.label}
                          onClick={() => setSelectedCondition(option.label)}
                          className="p-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Store Location */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="storeLocation"
                  className="w-52 text-gray-500 mr-2"
                >
                  Store Location
                </label>
                <input
                  type="text"
                  id="storeLocation"
                  value={formData.storeLocation}
                  onChange={handleInputChange}
                  placeholder="Enter store location"
                  className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                />
              </div>
            </div>

            {/* Killdisk Section */}
            <div className="mb-4">
              <h3
                className="mb-2 cursor-pointer flex items-center"
                onClick={() => toggleSection("killdiskDate")}
              >
                Killdisk
                <span className="ml-1">
                  {openSection === "killdiskDate" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </h3>
              {openSection === "killdiskDate" && (
                <div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="killdiskDate"
                      className="w-52 text-gray-500 mr-2"
                    >
                      Killdisk Date
                    </label>
                    <input
                      type="date"
                      id="killdiskDate"
                      value={formData.killdiskDate}
                      onChange={handleInputChange}
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="attachedFile"
                      className="w-52 text-gray-500 mr-2"
                    >
                      Attach
                    </label>
                    <input
                      type="file"
                      id="attachedFile"
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Disposed Section */}
            <div className="mb-4">
              <h3
                className="mb-2 cursor-pointer flex items-center"
                onClick={() => toggleSection("disposed")}
              >
                Disposed
                <span className="ml-1">
                  {openSection === "disposed" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </h3>
              {openSection === "disposed" && (
                <div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="disposedDate"
                      className="w-52 text-gray-500 mr-2"
                    >
                      Disposed Date
                    </label>
                    <input
                      type="date"
                      id="disposedDate"
                      value={formData.disposedDate}
                      onChange={handleInputChange}
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Information Section */}
            <div className="mb-4">
              <h3
                className="mb-2 cursor-pointer flex items-center"
                onClick={() => toggleSection("orderInfo")}
              >
                Order Information
                <span className="ml-1">
                  {openSection === "orderInfo" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
              </h3>
              {openSection === "orderInfo" && (
                <div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="poNumber"
                      className="w-52 text-gray-500 mr-2"
                    >
                      PO Number
                    </label>
                    <input
                      type="text"
                      id="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      placeholder="Enter PO Number"
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <label htmlFor="order" className="w-52 text-gray-500 mr-2">
                      Order
                    </label>
                    <input
                      type="text"
                      id="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="Enter Order"
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="purchase"
                      className="w-52 text-gray-500 mr-2"
                    >
                      Purchase Number
                    </label>
                    <input
                      type="date"
                      id="purchase"
                      value={formData.purchase}
                      onChange={handleInputChange}
                      className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssetForm;
