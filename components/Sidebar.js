"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import useUserStore from "@/store/userStore";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Separate loading state for upload
  const pathname = usePathname();
  const [file, setFile] = useState(null);

  const dropdownRefs = {
    accessories: useRef(null),
    requests: useRef(null),
    settings: useRef(null),
    profile: useRef(null)
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      openDropdown &&
      dropdownRefs[openDropdown] &&
      !dropdownRefs[openDropdown].current.contains(event.target)
    ) {
      setOpenDropdown(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleImportClick = (e) => {
    e.preventDefault();
    setShowImportDialog(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔥 UPDATED UPLOAD FUNCTION WITH BETTER ERROR HANDLING
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file before importing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        // SUCCESS
        alert(`✅ SUCCESS!\n\n${data.insertedCount} assets imported successfully!`);
        setShowImportDialog(false);
        setFile(null);
        window.location.reload(); // Refresh the page to show new assets
      } else {
        // ERROR - Show detailed error message
        showDetailedError(data);
      }
      
    } catch (error) {
      console.error("Network error:", error);
      alert("❌ NETWORK ERROR\n\nPlease check your internet connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🔥 NEW FUNCTION TO SHOW DETAILED ERRORS
  const showDetailedError = (errorData) => {
    const { userMessage, missingColumns, duplicates, validationErrors } = errorData;
    
    let message = `❌ IMPORT FAILED\n\n${userMessage}\n\n`;
    
    // Add specific guidance based on error type
    if (missingColumns && missingColumns.length > 0) {
      message += `📋 MISSING COLUMNS:\n${missingColumns.map(col => `• ${col}`).join('\n')}\n\n`;
      message += `💡 HOW TO FIX:\n1. Open your CSV file\n2. Add these column headers\n3. Save and try again\n\n`;
    }
    
    if (duplicates && duplicates.length > 0) {
      message += `🔄 DUPLICATE SERIAL NUMBERS:\n${duplicates.map(dup => `• ${dup}`).join('\n')}\n\n`;
      message += `💡 HOW TO FIX:\n1. Find these serial numbers in your CSV\n2. Make them unique\n3. Save and try again\n\n`;
    }
    
    if (validationErrors && validationErrors.length > 0) {
      message += `⚠️ DATA ISSUES:\n${validationErrors.slice(0, 3).map(err => `• ${err}`).join('\n')}\n\n`;
      message += `💡 HOW TO FIX:\n1. Check the mentioned rows\n2. Fill required fields\n3. Use correct Status values: Active, Deployed, MISStock, Inactive, Disposed\n\n`;
    }
    
    alert(message);
  };

  // 🔥 NEW FUNCTION TO DOWNLOAD CSV TEMPLATE
  const downloadTemplate = () => {
    const csvTemplate = `NodeName,Manufacturer,Type,SerialNumber,Model,Expries,Categories,Status,Segment,assetOwner,Note,DefaultLocation,CostCenter,ReceivedDate,Condition,StoreLocation,PONumber,Order,PurchaseNumber
Laptop-001,Dell,Laptop,DL123456789,Latitude 5520,31-12-2025,IT Equipment,Active,Corporate,John Doe,Sample laptop,Mumbai Office,IT-001,01-01-2024,New,IT Room,PO001,ORD001,01-01-2024
Desktop-002,HP,Desktop,HP987654321,EliteDesk 800,31-12-2026,IT Equipment,Deployed,Corporate,Jane Smith,Sample desktop,Delhi Office,IT-002,15-02-2024,Good,IT Room,PO002,ORD002,15-02-2024`;

    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asset_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert("📄 Template downloaded!\n\nUse this file as a reference for the correct format.");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    const getUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const userData = user ? JSON.parse(user) : null;
        const userId = userData?.id;

        if (!token || !userId) {
          console.warn("No token or user ID found in localStorage");
          setUserEmail("Guest");
          setUserRole("Visitor");
          setIsLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/users/${userId}`);

        if (!response.ok) {
          console.error("API response error:", response.status);
          setUserEmail("Error " + response.status);
          setIsLoading(false);
          return;
        }

        const apiUserData = await response.json();
        const userInfo = apiUserData.data || apiUserData;

        const siemensId = userInfo.siemensId ||
          (userInfo.user && userInfo.user.siemensId) ||
          (typeof userInfo.email === 'string' ? userInfo.email : null) ||
          "";

        const role = userInfo.role ||
          (userInfo.user && userInfo.user.role) ||
          "User";

        if (siemensId) {
          const username = siemensId.includes("@") ? siemensId.split("@")[0] : siemensId;
          setUserEmail(username);
          setUserRole(role);
        } else {
          console.warn("No siemensId found in user data");
          setUserEmail("No ID");
        }
      } catch (error) {
        console.error("Error getting user data:", error);
        setUserEmail("Error");
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole((userData.role || "").toLowerCase());
      } catch (e) {
        console.error("Error parsing user data:", e);
        setUserRole("");
      }
    }
  }, []);

  const menuItems = [
    {
      label: "Overview",
      href: "/stocks",
      icon: "📊",
      active: pathname === "/"
    },
    {
      label: "All assets",
      href: "/stocks/allasset",
      icon: "🖥️",
      active: pathname === "/allasset"
    },
    {
      label: "Accessories",
      icon: "🔌",
      isDropdown: true,
      dropdownKey: "accessories",
      children: [
        {
          label: "Monitor",
          href: "/stocks/monitors",
          icon: "🖥️",
          active: pathname === "/monitor"
        },
        {
          label: "Peripherals",
          href: "/stocks/peripherals",
          icon: "🖱️",
          active: pathname === "/addKeyMice"
        }
      ]
    },
    {
      label: "Buyback",
      href: "./stocks/allasset?status=Buyback",
      icon: "💰",
      active: pathname === "/buyback"
    },
    {
      label: "Disposed",
      href: "/stocks/allasset?status=Disposed",
      icon: "🗑️",
      active: pathname === "/disposed"
    },
    {
      label: "Imports",
      href: "#",
      icon: "📥",
      onClick: handleImportClick
    },
    {
      label: "Settings",
      icon: "⚙️",
      isDropdown: true,
      dropdownKey: "settings",
      children: [
        {
          label: "Segments",
          href: "/stocks/segments",
          icon: "👥",
          active: pathname === "/segments"
        },
        {
          label: "Create new user",
          href: "/signup",
          icon: "👤",
          active: pathname === "/signup",
          disabled: userRole.toLowerCase() !== "admin",
          title: userRole.toLowerCase() !== "admin" ? "Only admin can delete asset" : ""
        },
        {
          label: "Manufacturers",
          href: "/stocks/Manufacturer",
          icon: "🏭",
          active: pathname === "/Manufacturer"
        }
      ]
    },
    {
      label: "Requests",
      icon: "📝",
      isDropdown: true,
      dropdownKey: "requests",
      children: [
        {
          label: "Contact Us",
          href: "mailto:avishkar.gadkar.ext@siemens.com",
          icon: "✉️",
          active: pathname === "/contact-us"
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-gray-700 text-white p-2 rounded-md shadow-lg hover:bg-gray-600 transition-colors"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar container */}
      <div className={clsx(
        "bg-gray-800 transition-all duration-300 ease-in-out z-10 shadow-xl",
        "fixed md:static h-full overflow-y-auto",
        isMobileMenuOpen ? "left-0" : "-left-full md:left-0",
        "w-72 md:w-64 shrink-0"
      )}>
        {/* Branding/Logo Area */}
        <div className="bg-gray-900 p-4 border-b border-gray-700">
          <div className="flex items-center justify-center">
            <span className="text-teal-400 text-2xl font-bold">Asset Manager</span>
          </div>
        </div>

        {/* User Profile Area */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative" ref={dropdownRefs.profile}>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <div className="animate-pulse bg-gray-600 h-8 w-32 rounded"></div>
              </div>
            ) : (
              <div
                className="cursor-pointer bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleDropdown("profile")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center text-white text-lg mr-3">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{userEmail}</div>
                      <div className="text-gray-400 text-sm">{userRole}</div>
                    </div>
                  </div>
                  <span>
                    {openDropdown === "profile" ? (
                      <IoMdArrowDropup className="text-white" />
                    ) : (
                      <IoMdArrowDropdown className="text-white" />
                    )}
                  </span>
                </div>
              </div>
            )}

            {openDropdown === "profile" && (
              <div className="absolute w-full bg-gray-900 mt-2 rounded-lg p-2 shadow-lg z-50">
                <ul>
                  <li className="p-2 w-full hover:bg-gray-700 rounded-md transition-colors">
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white w-full text-left flex items-center"
                    >
                      <span className="mr-2">🚪</span> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.isDropdown ? (
                  <>
                    <a
                      href="#"
                      className={clsx(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        openDropdown === item.dropdownKey
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDropdown(item.dropdownKey);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </div>
                      <span>
                        {openDropdown === item.dropdownKey ? (
                          <IoMdArrowDropup />
                        ) : (
                          <IoMdArrowDropdown />
                        )}
                      </span>
                    </a>
                    {openDropdown === item.dropdownKey && (
                      <ul
                        className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-4"
                        ref={dropdownRefs[item.dropdownKey]}
                      >
                        {item.children.map((child, childIndex) => {
                          if (child.label === "Create new user" && userRole.toLowerCase() !== "admin") {
                            return null;
                          }
                          return (
                            <li key={childIndex}>
                              <a
                                href={child.href}
                                className={clsx(
                                  "flex items-center p-2 rounded-md transition-colors",
                                  child.active
                                    ? "bg-gray-700 text-white font-medium"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                )}
                              >
                                <span className="mr-2">{child.icon}</span>
                                {child.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className={clsx(
                      "flex items-center p-3 rounded-lg transition-colors",
                      item.active
                        ? "bg-gray-700 text-white font-medium"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 🔥 UPDATED IMPORT DIALOG WITH BETTER UI AND TEMPLATE DOWNLOAD */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4 shadow-2xl">
              <h2 className="text-xl text-white mb-4 font-semibold flex items-center">
                <span className="mr-2">📥</span> Import Assets from CSV
              </h2>

              {/* 🔥 NEW: Template Download Section */}
              <div className="mb-4 p-3 bg-teal-900 bg-opacity-50 border border-teal-500 rounded-lg">
                <p className="text-teal-200 text-sm mb-2">
                  📋 First time importing? Download our template:
                </p>
                <button 
                  onClick={downloadTemplate}
                  className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 transition-colors"
                >
                  📄 Download CSV Template
                </button>
              </div>

              {/* 🔥 NEW: Requirements Section */}
              <div className="mb-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg">
                <p className="text-yellow-200 text-sm font-medium mb-2">📝 Requirements:</p>
                <ul className="text-yellow-100 text-xs space-y-1">
                  <li>• File must be .csv format</li>
                  <li>• SerialNumber, Type, Status, Segment are required</li>
                  <li>• Status: Active, Deployed, MISStock, Inactive, Disposed</li>
                  <li>• Serial numbers must be unique</li>
                  <li>• Date format: DD-MM-YYYY or YYYY-MM-DD</li>
                </ul>
              </div>

              <p className="text-gray-300 mb-4">
                Select your CSV file to import assets into the system.
              </p>

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">📄</span>
                    <span className="text-white">
                      {file ? file.name : "Click to select CSV file"}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      Only .csv files accepted
                    </span>
                  </div>
                </label>
              </div>

              {/* Selected file info */}
              {file && (
                <div className="mb-4 p-2 bg-gray-700 rounded text-sm">
                  <p className="text-green-400">✅ Selected: {file.name}</p>
                  <p className="text-gray-300">Size: {(file.size / 1024).toFixed(1)} KB</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportDialog(false);
                    setFile(null);
                  }}
                  disabled={isUploading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading || !file}
                  className={clsx(
                    "text-white px-4 py-2 rounded-lg flex items-center transition-colors",
                    isUploading || !file
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  )}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Importing...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      Import Assets
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;