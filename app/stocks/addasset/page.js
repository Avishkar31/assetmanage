"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "components/Sidebar";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { FiLoader, FiBox, FiType, FiTag, FiInfo, FiCalendar, FiTool } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { toast } from "react-hot-toast";
import getUserData from "@/utils/getUser";
import "components/AssetForm.css";

// Option definitions remain the same
const typeOptions = [
  { label: "Default", description: "Please select a type" },
  { label: "Desktop", description: "Desktop Computer" },
  { label: "Laptop", description: "Laptop Computer" },
  // { label: "Monitor", description: "Computer Monitor" },
  { label: "Printer", description: "Printer Device" },
  { label: "Server", description: "Server Hardware" },
  { label: "Network Device", description: "Network Equipment" },
  // { label: "Peripheral", description: "Peripheral Device" },
  // { label: "Other", description: "Other Equipment" }
];

const statusOptions = [
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
  // {
  //   label: "MIS Store",
  //   description: "✓  That status is deployable. This asset can be checked out.",
  //   color: "text-green-500"
  // },
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
  // {
  //   label: "Inactive",
  //   description:
  //     "✗  That asset status is not deployable. This asset cannot be checked out.",
  //   color: "text-red-500"
  // },
  {
    label: "Deployed",
    description: "✓  That status is deployable. This asset can be checked out.",
    color: "text-green-500"
  }
];

const conditionOptions = [
  { label: "Excellent" },
  { label: "Good" },
  { label: "Fair" },
  { label: "Bad" }
];

const locationOptions = [
  { value: "select", label: "Select Location" },
  { value: "buyback", label: "Buyback" },
  { value: "home", label: "Home" },
  { value: "second", label: "MIS Store - 2nd floor Compactor Room" },
  { value: "four", label: "MIS Store - 4th Floor" },
  { value: "basement", label: "Basement" }
];

const AddAssetForm = () => {
  // All state declarations and fetch functions remain the same
  const [formData, setFormData] = useState({
    nodeName: "",
    manufacturer: "",
    serialNumber: "",
    model: "",
    type: "",
    expires: "",
    category: "",
    status: "",
    department: "",
    issueTo: "",
    note: "",
    defaultLocation: "Select Location",
    costCenter: "",
    receivedDate: "",
    assetOwner: "",
    condition: "",
    storeLocation: "Rack No",
    killdiskDate: "",
    attachedFile: "",
    disposedDate: "",
    poNumber: "",
    order: "",
    purchaseDate: ""
  });

  const [errors, setErrors] = useState({
    nodeName: false,
    manufacturer: false,
    serialNumber: false,
    status: false,
    department: false,
    issueTo: false,
    type: false
  });

  const [teams, setTeams] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState({
    teams: false,
    manufacturers: false,
    form: false
  });

  const [openSection, setOpenSection] = useState("");
  const [showSerialLoader, setShowSerialLoader] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const dropdownRefs = {
    type: useRef(null),
    status: useRef(null),
    condition: useRef(null)
  };

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(prev => ({ ...prev, teams: true }));
      try {
        const response = await fetch("/api/teams");
        const data = await response.json();
        if (data.success) {
          setTeams(data.data);
        } else {
          console.error("Failed to fetch teams:", data.error);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(prev => ({ ...prev, teams: false }));
      }
    };

    fetchTeams();
  }, []);

  // Fetch manufacturers data
  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(prev => ({ ...prev, manufacturers: true }));
      try {
        const response = await fetch("/api/Manufacturer");
        const data = await response.json();
        if (data.data) {
          setManufacturers(data.data);
        } else {
          console.error("Failed to fetch manufacturers:", data.error);
        }
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoading(prev => ({ ...prev, manufacturers: false }));
      }
    };

    fetchManufacturers();
  }, []);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      
      category:
        id === "type" && value.toLowerCase() === "laptop"
          ? "laptop"
          : id === "type" && value.toLowerCase() === "desktop"
          ? "desktop"
          : id === "type" && value.toLowerCase() === "monitor"
          ? "monitor"
          : id === "type" && value.toLowerCase() === "printer"
          ? "printer"
          : prevData.category
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleClickOutside = (event) => {
    if (openSection && 
        dropdownRefs[openSection] && 
        !dropdownRefs[openSection].current?.contains(event.target)) {
      setOpenSection("");
    }
  };

  const handleStatusSelect = (label) => {
    setFormData({ ...formData, status: label });
    setOpenSection("");
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "nodeName", 
      "manufacturer", 
      "serialNumber", 
      "status", 
      "department", 
      "issueTo", 
      "type"
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification("Please fill all required fields", "error");
      return;
    }

    setLoading(prev => ({ ...prev, form: true }));

    try {
      const formDataFinal = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "")
      );

      const formDataUpdate = {
        user: await getUserData(),
        ...formDataFinal
      };

      const response = await fetch("/api/asset/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add asset.");
      }

      await response.json();
      showNotification("Asset added successfully", "success");
      toast.success("Asset added successfully");
      
      // Reset form
      setFormData({
        nodeName: "",
        manufacturer: "",
        serialNumber: "",
        model: "",
        expires: "",
        category: "",
        status: "",
        department: "",
        issueTo: "",
        note: "",
        defaultLocation: "Select Location",
        costCenter: "",
        receivedDate: "",
        assetOwner: "",
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
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification(`Error: ${error?.message || "Something went wrong!"}`, "error");
      toast.error(`Error: ${error?.message || "Something went wrong!"}`);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    
    if (formData.status === "Deployed") {
      setFormData((prev) => ({ ...prev, defaultLocation: "Home" }));
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formData.status, openSection]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex-grow p-3 md:p-5 lg:p-6 overflow-x-hidden">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Add New Asset
            </h1>
            <p className="text-gray-400 text-sm">Create a new inventory item</p>
          </div>
        </header>

        {/* Notification */}
        {notification.message && (
          <div 
            className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
              notification.type === "success" 
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
                <FiInfo className="mr-2 text-blue-400" /> Essential Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Node Name */}
                <div className="form-group">
                  <label htmlFor="nodeName" className="form-label">
                    Node Name <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
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
                  {errors.nodeName && (
                    <p className="input-error">Node name is required</p>
                  )}
                </div>

                {/* Serial Number */}
                <div className="form-group">
                  <label htmlFor="serialNumber" className="form-label">
                    Serial Number <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
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
                      <HiOutlineOfficeBuilding />
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
                      <FiType />
                    </span>
                    <input
                      type="text"
                      id="type"
                      value={formData.type || ""}
                      readOnly
                      placeholder="Select type"
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
                              {option.label === "Inpool" || option.label === "MIS Store" || option.label === "Deployed" ? "✓" : "✗"}
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

                {/* Team/Department */}
                <div className="form-group">
                  <label htmlFor="department" className="form-label">
                    Team <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <HiOutlineOfficeBuilding />
                    </span>
                    <select
                      id="department"
                      value={formData.department}
                      onChange={handleSelectChange}
                      className={`form-select pl-10 ${errors.department ? "error" : ""}`}
                      disabled={loading.teams}
                    >
                      <option value="">Select Team</option>
                      {loading.teams ? (
                        <option value="" disabled>Loading teams...</option>
                      ) : (
                        teams.map((team) => (
                          <option key={team._id} value={team.name}>
                            {team.name} {team.department && `(${team.department})`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="input-error">Team is required</p>
                  )}
                </div>

                {/* Issue To */}
                <div className="form-group">
                  <label htmlFor="issueTo" className="form-label">
                    Issue To <span className="text-red-400">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
                    </span>
                    <input
                      type="text"
                      id="issueTo"
                      value={formData.issueTo}
                      onChange={handleInputChange}
                      placeholder="Enter recipient name"
                      className={`form-input pl-10 ${errors.issueTo ? "error" : ""}`}
                    />
                  </div>
                  {errors.issueTo && (
                    <p className="input-error">Issue To is required</p>
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
                  <label htmlFor="expires" className="form-label">Expires</label>
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
                  <label htmlFor="defaultLocation" className="form-label">Default Location</label>
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

                {/* Asset Owner */}
                <div className="form-group">
                  <label htmlFor="assetOwner" className="form-label">Asset Owner</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FiTag />
                    </span>
                    <input
                      type="text"
                      id="assetOwner"
                      value={formData.assetOwner}
                      onChange={handleInputChange}
                      placeholder="Enter asset owner"
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
                    department: "",
                    issueTo: "",
                    note: "",
                    defaultLocation: "Select Location",
                    costCenter: "",
                    receivedDate: "",
                    assetOwner: "",
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
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Asset'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for form components */}
      <style jsx global>{`
        /* Core Form Styles */
        .form-group {
          @apply flex flex-col;
        }
        
        .form-label {
          @apply text-sm font-medium text-gray-300 mb-2;
        }
        
        .input-group {
          @apply relative flex items-center;
        }
        
        .input-icon {
          @apply absolute left-3 text-gray-400 pointer-events-none;
        }
        
        .input-suffix {
          @apply absolute right-3 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors;
        }
        
        .input-loader {
          @apply absolute right-3 text-gray-400;
        }
        
        .form-input, .form-select {
          @apply w-full p-3 rounded-lg bg-gray-900/80 border border-gray-700 text-sm text-gray-200 
            placeholder:text-gray-500 outline-none transition-all duration-200
            hover:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-400;
        }
        
        .form-input.error, .form-select.error {
          @apply border-red-500 focus:ring-red-500 focus:border-red-500;
        }
        
        input[type="date"].form-input {
          @apply text-gray-300;
        }
        
        .form-file-input {
          @apply block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
            file:text-sm file:text-white file:bg-blue-500/90 file:cursor-pointer 
            hover:file:bg-blue-600/90 border border-gray-700 rounded-lg text-gray-300 
            text-sm cursor-pointer bg-gray-900/80;
        }
        
        .dropdown-menu {
          @apply absolute z-30 bg-gray-800 border border-gray-700/70 rounded-lg shadow-xl overflow-hidden 
            w-full -left-0 top-full mt-1 max-h-60 overflow-y-auto backdrop-blur-sm;
        }
        
        .dropdown-item {
          @apply p-3 hover:bg-gray-700/90 cursor-pointer transition-colors text-sm text-gray-200 border-b border-gray-700/30 last:border-0;
        }
        
        .input-error {
          @apply text-red-400 text-xs mt-1;
        }
        
        .input-help {
          @apply text-gray-500 text-xs mt-1;
        }
        
        /* Collapsible Sections */
        .collapsible-section {
          @apply bg-gray-850/40 rounded-lg border border-gray-700/30 shadow-inner overflow-hidden;
        }
        
        .collapsible-header {
          @apply flex items-center justify-between w-full p-4 hover:bg-gray-800/40 transition-colors text-left;
        }
        
        .collapsible-content {
          @apply p-5 border-t border-gray-700/30 bg-gray-800/10;
        }
        
        /* Buttons */
        .btn-primary {
          @apply flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
            hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium shadow-sm 
            transition-all duration-200 hover:shadow outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed;
        }
        
        .btn-primary.loading {
          @apply from-blue-700 to-blue-600 cursor-wait;
        }
        
        .btn-secondary {
          @apply flex items-center justify-center px-6 py-3 bg-gray-700/50 hover:bg-gray-700 
            text-gray-200 border border-gray-600 rounded-lg font-medium transition-colors 
            outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-70 disabled:cursor-not-allowed;
        }
        
        /* Better support for Edge/IE browsers */
        @supports (-ms-ime-align: auto) {
          .form-input, .form-select {
            @apply bg-gray-900;
          }
          
          input[type="date"]::-ms-clear, input[type="date"]::-ms-reveal {
            display: none;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            @apply bg-gray-600 rounded cursor-pointer;
          }
        }
        
        /* Fix for dropdown positioning */
        .dropdown-menu {
          position: absolute;
          transform-origin: top center;
          animation: dropdownOpen 0.15s ease-out;
        }
        
        @keyframes dropdownOpen {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Utilities */
        .bg-gray-850 {
          background-color: rgb(22, 27, 34);
        }
      `}</style>
    </div>
  );
};

export default AddAssetForm;