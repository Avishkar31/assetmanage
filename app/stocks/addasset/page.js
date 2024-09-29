"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import {
  IoCloseSharp,
  IoMdAdd,
  IoMdArrowDropup,
  IoMdArrowDropdown
} from "react-icons/io";
import { FiLoader } from "react-icons/fi";

const AddAssetForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    assetTag: "", // Asset Tag number, auto-incremented and fetched from the server
    nodeName: "", // Name of the node
    manufacturer: "", // Manufacturer of the asset
    serialNumber: "", // Serial number of the asset
    type: "", // Type of the asset (e.g., laptop, desktop)
    model: "", // Model of the asset
    expires: "", // Expiry date of the asset
    category: "", // Category of the asset, derived from type
    status: "Default", // Status of the asset (e.g., deployed, inpool)
    department: "", // Department where the asset is allocated
    issueTo: "", // Person to whom the asset is issued
    note: "", // Additional notes
    defaultLocation: "Select Location", // Default location of the asset, updated when status is "Deployed"
    costCenter: "", // Cost center associated with the asset
    receivedDate: "", // Date when the asset was received
    assetOwner: "", // Owner of the asset
    condition: "", // Condition of the asset (e.g., excellent, good)
    storeLocation: "Rack No", // Store location, e.g., rack number
    killdiskDate: "", // Date when killdisk was applied (if applicable)
    attachedFile: "", // File attached to the asset record
    disposedDate: "", // Date when the asset was disposed (if applicable)
    poNumber: "", // Purchase order number
    order: "", // Order number
    purchaseDate: "" // Date of purchase
  });

  // State to manage the visibility of sections
  const [openSection, setOpenSection] = useState("");
  // State to manage the loading indicator for the serial number
  const [showLoader, setShowLoader] = useState(false);
  // State to manage duplicate serial number error
  const [duplicateError, setDuplicateError] = useState("");

  const dropdownRef = useRef(null); // Reference to the dropdown for click detection

  // Options for manufacturer dropdown
  const manufacturerOptions = [
    {
      label: "Default",
      description: "Manufacturer selection is required to continue."
    },
    {
      label: "HP",
      description: "Ensure all data fields are fully populated."
    },
    {
      label: "Dell",
      description:
        "Fetching information directly from Dell's website. Please type the serial number."
    },
    {
      label: "Apple",
      description: "Ensure all data fields are fully populated."
    },
    {
      label: "Microsoft",
      description: "Ensure all data fields are fully populated."
    }
  ];

  // Options for status dropdown with descriptions and colors
  const ramOptions = [
    { label: "Default", description: "" },
    {
      label: "Inpool",
      description:
        "✓  That status is deployable. This asset can be checked out.",
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
      description:
        "✓  That status is deployable. This asset can be checked out.",
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
      description:
        "✓  That status is deployable. This asset can be checked out.",
      color: "text-green-500"
    }
  ];

  // Options for asset condition dropdown
  const conditionOptions = [
    { label: "Excellent" },
    { label: "Good" },
    { label: "Fair" },
    { label: "Bad" }
  ];

  // Effect to automatically set default location to "Home" when status is "Deployed"
  useEffect(() => {
    if (formData.status === "Deployed") {
      setFormData((prev) => ({ ...prev, defaultLocation: "Home" }));
    }
  }, [formData.status]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      // Automatically set category based on type
      category:
        id === "type" && value.toLowerCase() === "laptop"
          ? "laptop"
          : id === "type" && value.toLowerCase() === "desktop"
          ? "desktop"
          : id === "type" && value.toLowerCase() === "monitor"
          ? "monitor"
          : prevData.category
    }));
  };

  // Handle serial number input with loader display for 2 seconds
  const handleSerialNumberChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    if (id === "serialNumber") {
      setShowLoader(true);

      setTimeout(() => {
        setShowLoader(false);
      }, 2000); // 2 seconds
    }
  };

  // Handle dropdown selection changes for select fields
  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Toggle visibility of sections in the form
  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? "" : section));
  };

  // Close the dropdown when clicking outside of it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenSection(""); // Close the dropdown if clicked outside
    }
  };

  // Add event listener to detect clicks outside dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formDataFinal = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "")
      );

      const response = await fetch("/api/asset/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataFinal)
      });

      if (response.ok) {
        await response.json();
        alert("Asset added successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Continue with the JSX render part...

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Stocks</h1>
        </header>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Adding Asset</h2>
          </div>
          {/* Asset Tag  and button to add duplicate with same data */}
          {/* <div className="mb-4">
            <div className="flex items-center">
              <label htmlFor="assetTag" className="w-52 text-gray-500 mr-2">
                Asset Tag
              </label>
              <input
                type="text"
                id="assetTag"
                value={formData.assetTag} // Ensure formData.assetTag has a value
                onChange={handleInputChange} // Remove this if the input should remain read-only
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
              <button
                // onClick={handleAddAsset} // Ensure this function is correctly implemented
                className="ml-2 p-2 bg-gray-700 text-gray-400 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Add Asset"
              >
                <IoMdAdd />
              </button>
            </div>
          </div> */}

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
              <label htmlFor="manufacturer" className="w-52 text-gray-500 mr-2">
                Manufacturer
              </label>
              <select
                id="manufacturer"
                value={formData.manufacturer}
                onChange={handleSelectChange}
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300"
              >
                {manufacturerOptions.map((option) => (
                  <option key={option.label} value={option.label.toLowerCase()}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description for the selected manufacturer */}
            <div className="text-sm text-gray-500 mt-1 ml-56">
              {
                manufacturerOptions.find(
                  (option) =>
                    option.label.toLowerCase() === formData.manufacturer
                )?.description
              }
            </div>
          </div>

          {/* Serial Number */}
          <div className="mb-4 flex items-center">
            <label htmlFor="serialNumber" className="w-52 text-gray-500 mr-2">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              value={formData.serialNumber}
              onChange={handleSerialNumberChange}
              placeholder="Enter the Serial number"
              className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
            />
            {showLoader && (
              <span
                className="ml-2 p-2 bg-gray-700 text-gray-400 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Loading"
              >
                <FiLoader />
              </span>
            )}
          </div>

          {/* <div className="text-sm text-gray-500 mt-1 ml-56">
                  {isSerialNumberDuplicate
                    ? "This serial number is already in the database."
                    : "Serial number must be unique for each asset"}
                </div> */}

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
                <option value="">Default</option>
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
              <div className="w-3/5 relative">
                <input
                  type="text"
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  onClick={() => toggleSection("status")} // Toggle dropdown
                  className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer w-full"
                  readOnly // Prevent manual typing
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
                    ref={dropdownRef} // Attach the ref here
                    className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full z-10"
                  >
                    {ramOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => {
                          setFormData({ ...formData, status: option.label });
                          toggleSection("status"); // Close dropdown after selection
                        }}
                        className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                      >
                        <span className={`${option.color} mr-2`}>
                          {option.symbol}
                        </span>
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

          {/* Department */}
          <div className="mb-4 ml-10">
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

          {/* Note */}
          <div className="mb-4 ml-10">
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
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label
                htmlFor="defaultLocation"
                className="w-52 text-gray-500 mr-2"
              >
                Default Location
              </label>
              <select
                id="defaultLocation"
                value={formData.defaultLocation}
                onChange={handleSelectChange}
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300"
              >
                <option value="select">Select Location</option>
                <option value="buyback">Buyback</option>
                <option value="home">Home</option>
                <option value="second">
                  MIS Store - 2nd floor Compactor Roome
                </option>
                <option value="four">MIS Store - 4th Floor</option>
                <option value="basement">Basement</option>
              </select>
            </div>
          </div>

          {/* Cost Center */}
          <div className="mb-4 ml-10">
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
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="receivedDate" className="w-52 text-gray-500 mr-2">
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
            <div className="text-sm text-gray-500 mt-1 ml-56">
              Received date of the asset
            </div>
          </div>

          {/* Asset Owner */}
          <div className="mb-4 ml-10">
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
                className="w-3/5 p-3  bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="condition" className="w-52 text-gray-500 mr-2">
                Condition
              </label>
              <div className="w-3/5 relative">
                <input
                  type="text"
                  id="condition"
                  value={formData.condition || "Select Condition"}
                  readOnly
                  className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer w-full"
                  onClick={() => toggleSection("condition")}
                />
                <span className="absolute right-2 top-2 text-gray-500">
                  {openSection === "condition" ? (
                    <IoMdArrowDropup />
                  ) : (
                    <IoMdArrowDropdown />
                  )}
                </span>
                {openSection === "condition" && (
                  <div
                    ref={dropdownRef} // Attach the ref here
                    className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full z-10"
                  >
                    {conditionOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            condition: option.label
                          });
                          toggleSection("condition"); // Close dropdown after selection
                        }}
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
          <div className="mb-4 ml-10">
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
            {(formData.status === "Inactive" ||
              formData.status === "Disposed" ||
              formData.status === "Buyback") && (
              <>
                <h3
                  className="mb-2 cursor-pointer flex items-center font-bold"
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
              </>
            )}
          </div>

          {/* Disposed Section */}
          <div className="mb-4">
            {(formData.status === "Inactive" ||
              formData.status === "Disposed" ||
              formData.status === "Buyback") && (
              <>
                <h3
                  className="mb-2 cursor-pointer flex items-center font-bold"
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
              </>
            )}
          </div>

          {/* Order Information Section */}
          <div className="mb-4">
            <h3
              className="mb-2 cursor-pointer flex items-center font-bold "
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
                  <label htmlFor="poNumber" className="w-52 text-gray-500 mr-2">
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
                  <label htmlFor="purchase" className="w-52 text-gray-500 mr-2">
                    Purchase Number
                  </label>
                  <input
                    type="text"
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
        </div>
      </div>
    </div>
  );
};

export default AddAssetForm;
