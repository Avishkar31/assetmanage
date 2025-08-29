"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "components/Sidebar";
import {
  IoMdArrowDropup,
  IoMdArrowDropdown
} from "react-icons/io";
import {
  FiLoader,
  FiBox,
  FiType,
  FiTag,
  FiInfo,
  FiCalendar,
  FiTool
} from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { toast } from "react-hot-toast";
import getUserData from "@/utils/getUser";
import "components/AssetForm.css";

// Options
const typeOptions = [
  { label: "Default", description: "Please select a type" },
  { label: "Desktop", description: "Desktop Computer" },
  { label: "Laptop", description: "Laptop Computer" },
  { label: "Printer", description: "Printer Device" },
  { label: "Server", description: "Server Hardware" },
  { label: "Network Device", description: "Network Equipment" },
  { label: "Storage", description: "Storage Device" }
];

const statusOptions = [
  { label: "Default", description: "" },
  { label: "MISStock", description: "✓ Deployable. Can be checked out.", color: "text-green-500" },
  { label: "New Purchase", description: "✗ Not deployable.", color: "text-red-500" },
  { label: "Buyback", description: "✗ Not deployable.", color: "text-red-500" },
  { label: "Disposed", description: "✗ Not deployable.", color: "text-red-500" },
  { label: "Deployed", description: "✓ Deployable. Can be checked out.", color: "text-green-500" }
];

const conditionOptions = [
  { label: "Excellent" },
  { label: "Good" },
  { label: "Fair" },
  { label: "Bad" },
  { label: "Used" }
];

const locationOptions = [
  { value: "select", label: "Select Location" },
  { value: "Buyback", label: "Buyback" },
  { value: "Home", label: "Home" },
  { value: "MIS Store - 2nd floor Compactor Room", label: "MIS Store - 2nd floor Compactor Room" },
  { value: "MIS Store - 4th Floor", label: "MIS Store - 4th Floor" },
  { value: "basement", label: "Basement" },
  { value: "Branch Office", label: "Branch Office" },
  { value: "Remote Office", label: "Remote Office" }
];

const UpdatingAssetForm = ({ assetId }) => {
  const [formData, setFormData] = useState({
    nodeName: "",
    manufacturer: "",
    serialNumber: "",
    model: "",
    type: "",
    expires: "",
    category: "",
    status: "",
    segment: "",
    assetOwner: "",
    note: "",
    defaultLocation: "Select Location",
    costCenter: "",
    receivedDate: "",
    condition: "",
    storeLocation: "",
    killdiskDate: "",
    attachedFile: "",
    disposedDate: "",
    poNumber: "",
    order: "",
    purchaseDate: ""
  });

  const [errors, setErrors] = useState({});
  const [segments, setSegments] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState({
    segments: false,
    manufacturers: false,
    form: false,
    asset: false
  });
  const [showSerialLoader, setShowSerialLoader] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const dropdownRefs = {
    type: useRef(null),
    status: useRef(null),
    condition: useRef(null)
  };

  // Helper function to format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch asset data to update
  useEffect(() => {
    const fetchAsset = async () => {
      if (!assetId) return;
      
      setLoading(prev => ({ ...prev, asset: true }));
      try {
        const response = await fetch(`/api/asset/${assetId}`);
        const data = await response.json();
        if (data.success && data.asset) {
          const asset = data.asset;
          
          // Pre-fill form data with proper date formatting
          setFormData({
            nodeName: asset.nodeName || "",
            manufacturer: asset.manufacturer || "",
            serialNumber: asset.serialNumber || "",
            model: asset.model || "",
            type: asset.type || "",
            expires: formatDateForInput(asset.expires),
            category: asset.category || "",
            status: asset.status || "",
            segment: asset.segment || "",
            assetOwner: asset.assetOwner || "",
            note: asset.note || "",
            defaultLocation: asset.defaultLocation || "Select Location",
            costCenter: asset.costCenter || "",
            receivedDate: formatDateForInput(asset.receivedDate),
            condition: asset.condition || "",
            storeLocation: asset.storeLocation || "",
            killdiskDate: formatDateForInput(asset.killdiskDate),
            attachedFile: asset.attachedFile || "",
            disposedDate: formatDateForInput(asset.disposedDate),
            poNumber: asset.poNumber || "",
            order: asset.order || "",
            purchaseDate: formatDateForInput(asset.purchaseDate)
          });
        } else {
          toast.error("Failed to fetch asset data");
        }
      } catch (err) {
        console.error("Error fetching asset:", err);
        toast.error("Error fetching asset data");
      } finally {
        setLoading(prev => ({ ...prev, asset: false }));
      }
    };
    
    fetchAsset();
  }, [assetId]);

  // Fetch segments
  useEffect(() => {
    const fetchSegments = async () => {
      setLoading(prev => ({ ...prev, segments: true }));
      try {
        const res = await fetch("/api/segments");
        const data = await res.json();
        if (data.success) setSegments(data.data);
      } catch (err) {
        console.error("Error fetching segments:", err);
      } finally {
        setLoading(prev => ({ ...prev, segments: false }));
      }
    };
    fetchSegments();
  }, []);

  // Fetch manufacturers
  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(prev => ({ ...prev, manufacturers: true }));
      try {
        const res = await fetch("/api/Manufacturer");
        const data = await res.json();
        if (data.data) setManufacturers(data.data);
      } catch (err) {
        console.error("Error fetching manufacturers:", err);
      } finally {
        setLoading(prev => ({ ...prev, manufacturers: false }));
      }
    };
    fetchManufacturers();
  }, []);

  // Notification auto hide
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSection && dropdownRefs[openSection]?.current &&
        !dropdownRefs[openSection].current.contains(event.target)) {
        setOpenSection("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSection]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const toggleSection = (section) => setOpenSection(prev => prev === section ? "" : section);

  const handleStatusSelect = (label) => {
    setFormData(prev => ({ ...prev, status: label }));
    setOpenSection("");
  };

  const handleSubmit = async () => {
    const requiredFields = ["manufacturer", "serialNumber", "status", "segment", "assetOwner", "type"];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({ message: "Please fill all required fields", type: "error" });
      return;
    }

    setLoading(prev => ({ ...prev, form: true }));
    try {
      const user = await getUserData();
      const siemensId = user?.siemensId || user?.email || user?.name || "Unknown User";

      const updateData = {
        ...formData,
        updatedBy: siemensId,
        updatedAt: new Date()
      };

      const response = await fetch(`/api/asset/${assetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error("Failed to update asset");

      setNotification({ message: "Asset updated successfully", type: "success" });
      toast.success("Asset updated successfully");
    } catch (err) {
      console.error("Error updating asset:", err);
      setNotification({ message: err.message, type: "error" });
      toast.error(err.message);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // Show loading spinner while fetching asset data
  if (loading.asset) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-gray-100">
        <Sidebar />
        <div className="flex-grow p-3 md:p-5 lg:p-6 overflow-x-hidden flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <FiLoader className="animate-spin text-2xl text-blue-400" />
            <span className="text-lg">Loading asset data...</span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex-grow p-3 md:p-5 lg:p-6 overflow-x-hidden">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Updating Asset
            </h1>
            <p className="text-gray-400 text-sm">Updating a existing inventory item</p>
          </div>
        </header>

        {/* Notification */}
        {notification.message && (
          <div
            className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300 ease-in-out ${notification.type === "success"
                ? "bg-green-500/90 border-l-4 border-green-700"
                : "bg-red-500/90 border-l-4 border-red-700"
              }`}
          >
            {notification.message}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-gradient-to-b from-gray-800/70 to-gray-900/90 p-5 md:p-6 rounded-xl w-full max-w-6xl mx-auto shadow-xl border border-gray-800/50 backdrop-blur-sm">


          <div className="space-y-8">
            {/* Essential Information Section */}
            <div className="bg-gray-850/40 rounded-lg p-5 border border-gray-700/30 shadow-inner">
              <h3 className="text-md font-medium mb-4 flex items-center text-gray-200">
                {/* <FiInfo className="mr-2 text-blue-400" />  */}
                Essential Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Node Name */}
                <div className="form-group">
                  <label htmlFor="nodeName" className="form-label">
                    Node Name
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      {/* <FiTag /> */}
                    </span>
                    <input
                      type="text"
                      id="nodeName"
                      value={formData.nodeName}
                      onChange={handleInputChange}
                      placeholder="Enter node name"
                      className={`form-input pl-10 ${errors.nodeName ? "error" : ""}`}
                    />
                  </div>

                </div>

                {/* Serial Number */}
                <div className="form-group">
                  <label htmlFor="serialNumber" className="form-label">
                    Serial Number <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      {/* <FiTag /> */}
                    </span>
                    <input
                      type="text"
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      placeholder="Enter serial number"
                      className={`form-input pl-10 ${errors.serialNumber ? "error" : ""}`}
                    />
                    {showSerialLoader && (
                      <span className="input-loader">
                        <FiLoader className="animate-spin" />
                      </span>
                    )}
                  </div>
                  {errors.serialNumber && (
                    <p className="input-error">Serial number is required</p>
                  )}
                </div>

                {/* Manufacturer */}
                <div className="form-group">
                  <label htmlFor="manufacturer" className="form-label">
                    Manufacturer <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      {/* <HiOutlineOfficeBuilding /> */}
                    </span>
                    <select
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleSelectChange}
                      className={`form-select pl-10 ${errors.manufacturer ? "error" : ""}`}
                      disabled={loading.manufacturers}
                    >
                      <option value="">Select Manufacturer</option>
                      {loading.manufacturers ? (
                        <option value="" disabled>Loading manufacturers...</option>
                      ) : (
                        manufacturers.map((manufacturer) => (
                          <option key={manufacturer._id} value={manufacturer.name.toLowerCase()}>
                            {manufacturer.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {errors.manufacturer && (
                    <p className="input-error">Manufacturer is required</p>
                  )}
                  <p className="input-help">
                    {formData.manufacturer && "Selected manufacturer: " + formData.manufacturer}
                  </p>
                </div>

                {/* Type */}
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Type <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group" ref={dropdownRefs.type}>
                    <span className="input-icon">
                      {/* <FiType /> */}
                    </span>
                    <input
                      type="text"
                      id="type"
                      value={formData.type || ""}
                      onChange={(e) => handleInputChange(e)} // Add this onChange handler
                      placeholder="Select or type"
                      className={`form-input pl-10 ${errors.type ? "error" : ""}`}
                      onClick={() => toggleSection("type")}
                    />
                    <span className="input-suffix" onClick={() => toggleSection("type")}>
                      {openSection === "type" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </span>
                    {openSection === "type" && (
                      <div className="dropdown-menu">
                        {typeOptions.filter(o => o.label !== "Default").map((option) => (
                          <div
                            key={option.label}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                type: option.label,
                                category: option.label.toLowerCase() !== "default" ? option.label.toLowerCase() : ""
                              });
                              toggleSection("");
                            }}
                            className="dropdown-item"
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.type && (
                    <p className="input-error">Type is required</p>
                  )}
                  <p className="input-help">
                    {typeOptions.find((option) => option.label === formData.type)?.description || ""}
                  </p>
                </div>

                {/* Model */}
                <div className="form-group">
                  <label htmlFor="model" className="form-label">Model</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiBox />
                    </span>
                    <input
                      type="text"
                      id="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="Enter model number"
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group" ref={dropdownRefs.status}>
                    <span className="input-icon">
                      <FiInfo />
                    </span>
                    <input
                      type="text"
                      id="status"
                      value={formData.status || ""}
                      readOnly
                      placeholder="Select status"
                      className={`form-input pl-10 ${errors.status ? "error" : ""}`}
                      onClick={() => toggleSection("status")}
                    />
                    <span className="input-suffix" onClick={() => toggleSection("status")}>
                      {openSection === "status" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </span>
                    {openSection === "status" && (
                      <div className="dropdown-menu">
                        {statusOptions.filter(o => o.label !== "Default").map((option) => (
                          <div
                            key={option.label}
                            onClick={() => handleStatusSelect(option.label)}
                            className="dropdown-item"
                          >
                            <span className={`mr-2 ${option.color}`}>
                              {option.label === "MISStock" || option.label === "Deployed" ? "✓" : "✗"}
                            </span>
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.status && (
                    <p className="input-error">Status is required</p>
                  )}
                  <p className="input-help">
                    {statusOptions.find((option) => option.label === formData.status)?.description || ""}
                  </p>
                </div>

                {/* Segment/segment */}
                <div className="form-group">
                  <label htmlFor="segment" className="form-label">
                    Segment <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <HiOutlineOfficeBuilding />
                    </span>
                    <select
                      id="segment"
                      value={formData.segment}
                      onChange={handleSelectChange}
                      className={`form-select pl-10 ${errors.segment ? "error" : ""}`}
                      disabled={loading.segments}
                    >
                      <option value="">Select Segment</option>
                      {loading.segments ? (
                        <option value="" disabled>Loading segments...</option>
                      ) : (
                        segments.map((segment) => (
                          <option key={segment._id} value={segment.name}>
                            {segment.name} {segment.segment && `(${segment.segment})`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {errors.segment && (
                    <p className="input-error">Segment is required</p>
                  )}
                </div>

                {/* Asset Owner */}
                <div className="form-group">
                  <label htmlFor="assetOwner" className="form-label">
                    Asset Owner <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
                    </span>
                    <input
                      type="text"
                      id="assetOwner"
                      value={formData.assetOwner}
                      onChange={handleInputChange}
                      placeholder="Enter recipient name"
                      className={`form-input pl-10 ${errors.assetOwner ? "error" : ""}`}
                    />
                  </div>
                  {errors.assetOwner && (
                    <p className="input-error">Asset Owner is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="bg-gray-850/40 rounded-lg p-5 border border-gray-700/30 shadow-inner">
              <h3 className="text-md font-medium mb-4 flex items-center text-gray-200">
                <FiTool className="mr-2 text-blue-400" /> Additional Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Category */}
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiBox />
                    </span>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleSelectChange}
                      className="form-select pl-10"
                    >
                      <option value="">Default</option>
                      <option value="desktop">Desktop</option>
                      <option value="laptop">Laptop</option>
                      <option value="monitor">Monitor</option>
                      <option value="printer">Printer</option>
                    </select>
                  </div>
                  <p className="input-help">Auto-selected based on type</p>
                </div>

                {/* Expires */}
                <div className="form-group">
                  <label htmlFor="expires" className="form-label">Warranty Expire</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiCalendar />
                    </span>
                    <input
                      type="date"
                      id="expires"
                      value={formData.expires}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Default Location */}
                <div className="form-group">
                  <label htmlFor="defaultLocation" className="form-label"> Location</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <HiOutlineLocationMarker />
                    </span>
                    <select
                      id="defaultLocation"
                      value={formData.defaultLocation}
                      onChange={handleSelectChange}
                      className="form-select pl-10"
                    >
                      {locationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Condition */}
                <div className="form-group">
                  <label htmlFor="condition" className="form-label">Condition</label>
                  <div className="input-group" ref={dropdownRefs.condition}>
                    <span className="input-icon">
                      <FiInfo />
                    </span>
                    <input
                      type="text"
                      id="condition"
                      value={formData.condition || ""}
                      readOnly
                      placeholder="Select condition"
                      className="form-input pl-10"
                      onClick={() => toggleSection("condition")}
                    />
                    <span className="input-suffix" onClick={() => toggleSection("condition")}>
                      {openSection === "condition" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </span>
                    {openSection === "condition" && (
                      <div className="dropdown-menu">
                        {conditionOptions.map((option) => (
                          <div
                            key={option.label}
                            onClick={() => {
                              setFormData({ ...formData, condition: option.label });
                              toggleSection("");
                            }}
                            className="dropdown-item"
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Received Date */}
                <div className="form-group">
                  <label htmlFor="receivedDate" className="form-label">Received Date</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiCalendar />
                    </span>
                    <input
                      type="date"
                      id="receivedDate"
                      value={formData.receivedDate}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                    />
                  </div>
                  <p className="input-help">When the asset was received</p>
                </div>

                {/* Store Location */}
                <div className="form-group">
                  <label htmlFor="storeLocation" className="form-label">Store Location</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <HiOutlineLocationMarker />
                    </span>
                    <input
                      type="text"
                      id="storeLocation"
                      value={formData.storeLocation}
                      onChange={handleInputChange}
                      placeholder="Enter store location"
                      className="form-input pl-10"
                    />
                  </div>
                </div>



                {/* Cost Center */}
                <div className="form-group">
                  <label htmlFor="costCenter" className="form-label">Cost Center</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
                    </span>
                    <input
                      type="text"
                      id="costCenter"
                      value={formData.costCenter}
                      onChange={handleInputChange}
                      placeholder="Enter cost center"
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Notes - Full width */}
                <div className="form-group md:col-span-2">
                  <label htmlFor="note" className="form-label">Notes</label>
                  <div className="input-group h-auto">
                    <textarea
                      id="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Enter additional notes"
                      className="form-input min-h-[100px] resize-y"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Sections */}
            {(formData.status === "Inactive" || formData.status === "Disposed" || formData.status === "Buyback") && (
              <div className="space-y-5">
                {/* Killdisk Section */}
                <div className="collapsible-section">
                  <button
                    type="button"
                    onClick={() => toggleSection("killdiskDate")}
                    className="collapsible-header"
                  >
                    <span className="flex items-center">
                      <FiTool className="mr-2 text-blue-400" />
                      <span className="font-medium">Killdisk Information</span>
                    </span>
                    <span>
                      {openSection === "killdiskDate" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </span>
                  </button>

                  {openSection === "killdiskDate" && (
                    <div className="collapsible-content">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <label htmlFor="killdiskDate" className="form-label">Killdisk Date</label>
                          <div className="input-group">
                            <span className="input-icon">
                              <FiCalendar />
                            </span>
                            <input
                              type="date"
                              id="killdiskDate"
                              value={formData.killdiskDate}
                              onChange={handleInputChange}
                              className="form-input pl-10"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="attachedFile" className="form-label">Attach File</label>
                          <div className="input-group">
                            <input
                              type="file"
                              id="attachedFile"
                              className="form-file-input"
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  attachedFile: e.target.files[0]?.name || ""
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Disposed Section */}
                <div className="collapsible-section">
                  <button
                    type="button"
                    onClick={() => toggleSection("disposed")}
                    className="collapsible-header"
                  >
                    <span className="flex items-center">
                      <FiTool className="mr-2 text-blue-400" />
                      <span className="font-medium">Disposal Information</span>
                    </span>
                    <span>
                      {openSection === "disposed" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </span>
                  </button>

                  {openSection === "disposed" && (
                    <div className="collapsible-content">
                      <div className="form-group">
                        <label htmlFor="disposedDate" className="form-label">Disposed Date</label>
                        <div className="input-group">
                          <span className="input-icon">
                            <FiCalendar />
                          </span>
                          <input
                            type="date"
                            id="disposedDate"
                            value={formData.disposedDate}
                            onChange={handleInputChange}
                            className="form-input pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Information Section */}
            <div className="collapsible-section">
              <button
                type="button"
                onClick={() => toggleSection("orderInfo")}
                className="collapsible-header"
              >
                <span className="flex items-center">
                  <FiTool className="mr-2 text-blue-400" />
                  <span className="font-medium">Order Information</span>
                </span>
                <span>
                  {openSection === "orderInfo" ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </button>

              {openSection === "orderInfo" && (
                <div className="collapsible-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="poNumber" className="form-label">PO Number</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <FiTag />
                        </span>
                        <input
                          type="text"
                          id="poNumber"
                          value={formData.poNumber}
                          onChange={handleInputChange}
                          placeholder="Enter PO Number"
                          className="form-input pl-10"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="order" className="form-label">Order</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <FiTag />
                        </span>
                        <input
                          type="text"
                          id="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          placeholder="Enter Order Number"
                          className="form-input pl-10"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <FiCalendar />
                        </span>
                        <input
                          type="date"
                          id="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleInputChange}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end mt-8 pt-5 border-t border-gray-800">
              <button
                type="button"
                className="btn-secondary mr-3"
                disabled={loading.form}
                onClick={() => {
                  setFormData({
                    nodeName: "",
                    manufacturer: "",
                    serialNumber: "",
                    model: "",
                    type: "",
                    expires: "",
                    category: "",
                    status: "",
                    segment: "",
                    assetOwner: "",
                    note: "",
                    defaultLocation: "Select Location",
                    costCenter: "",
                    receivedDate: "",

                    condition: "",
                    storeLocation: "Rack No",
                    killdiskDate: "",
                    attachedFile: "",
                    disposedDate: "",
                    poNumber: "",
                    order: "",
                    purchaseDate: ""
                  });
                  setErrors({});
                }}
              >
                Reset Form
              </button>

              <button
                type="button"
                className={`btn-primary ${loading.form ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading.form}
              >
                {loading.form ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    <span>Updating...</span>
                  </>
                ) : (
                  'Save Asset'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>


    
  );
};


export default UpdatingAssetForm;
