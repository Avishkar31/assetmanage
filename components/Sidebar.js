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

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file before importing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setShowImportDialog(false);
        setFile(null);
      } else {
        alert("Failed to upload file. Please try again.");
      }
      const data = await response.json();
      console.log("File upload response:", data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
      setIsLoading(false);
    }
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
    
        // Modified siemensId extraction
        const siemensId = userInfo.siemensId || 
                         (userInfo.user && userInfo.user.siemensId) || 
                         (typeof userInfo.email === 'string' ? userInfo.email : null) ||
                         "";
    
        const role = userInfo.role ||
                    (userInfo.user && userInfo.user.role) ||
                    "User";
    
        if (siemensId) {
          // Only split if it's an email address
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
          label: "Teams",
          href: "/stocks/teams",
          icon: "👥",
          active: pathname === "/teams"
        },
        {
          label: "Create new user",
          href: "/signup",
          icon: "👤",
          active: pathname === "/signup"
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
      {/* Mobile menu button (only visible on small screens) */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-gray-700 text-white p-2 rounded-md shadow-lg hover:bg-gray-600 transition-colors"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar container with responsive classes */}
      <div className={clsx(
        "bg-gray-800 transition-all duration-300 ease-in-out z-10 shadow-xl",
        "fixed md:static h-full overflow-y-auto", // Changed overflow-auto to overflow-y-auto for vertical scrolling
        isMobileMenuOpen ? "left-0" : "-left-full md:left-0", // Hide on mobile when closed
        "w-72 md:w-64 shrink-0" // Width settings
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
                        {item.children.map((child, childIndex) => (
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
                        ))}
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

        {/* Version info at bottom */}
        {/* <div className="absolute bottom-0 w-full p-4 text-center border-t border-gray-700">
          <p className="text-gray-500 text-xs">Made by Avishkar Gadkar</p>
        </div> */}

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4 shadow-2xl">
              <h2 className="text-xl text-white mb-4 font-semibold flex items-center">
                <span className="mr-2">📥</span> Import Data
              </h2>
              <p className="text-gray-300 mb-4">
                Please verify your data before importing. Incorrect data may
                affect the database.
              </p>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">📄</span>
                    <span className="text-white">
                      {file ? file.name : "Click to select a file"}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      Accepts .csv, .xlsx, .xls
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowImportDialog(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={isLoading}
                  className={clsx(
                    "text-white px-4 py-2 rounded-lg flex items-center transition-colors",
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  )}
                >
                  {isLoading ? (
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
                      Processing...
                    </>
                  ) : (
                    "Import"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close mobile menu when clicking outside */}
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