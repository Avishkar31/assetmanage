"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const pathname = usePathname();

  const dropdownRefs = {
    accessories: useRef(null),
    requests: useRef(null),
    settings: useRef(null),
    profile: useRef(null)
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Add file validation and processing logic
      alert(
        "Please verify your data before importing. Incorrect data may affect the database."
      );
      // Process file upload
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Get user data from localStorage on mount
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token", token);
        const response = await fetch("http://localhost:3000/api/users/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const storedUser = await response.json();
        console.log("storedUser", storedUser);

        // localStorage.getItem("user");
        if (storedUser) {
          // Check for both outlook and email fields
          const email = storedUser.siemensId;
          if (email) {
            // Extract username before @ symbol
            const username = email.split("@")[0];
            setUserEmail(username);
          } else {
            console.warn("No email found in user data");
            setUserEmail("No Email Found");
          }
        } else {
          console.warn("No user data found in localStorage");
          setUserEmail("No Email Found");
        }
      } catch (error) {
        console.error("Error getting user data:", error);
        setUserEmail("Error Loading Email");
      }
    };

    getUserData();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-64 shrink-0 bg-gray-800 p-5">
      <div className="text-center mb-5">
        <div className="relative" ref={dropdownRefs.profile}>
          <h2
            className="cursor-pointer mt-2 flex items-center justify-center"
            onClick={() => toggleDropdown("profile")}
          >
            <span className="text-gray-500" style={{ fontSize: '1.5em' }}>👤 {userEmail}</span>
            <span className="ml-1">
              {openDropdown === "profile" ? (
                <IoMdArrowDropup />
              ) : (
                <IoMdArrowDropdown />
              )}
            </span>
          </h2>
          {openDropdown === "profile" && (
            <div className="absolute bg-gray-900 mt-2 rounded-lg p-2 shadow-lg">
              <ul>
                {/* <li className="mb-2">
                  <a
                    href="/profile "
                    className="text-gray-400 hover:text-white"
                  >
                    Edit your profile
                  </a>
                </li> */}
                <li className="mb-2 p-1 w-20">
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <nav>
        <ul>
          <li className="my-2">
            <a
              href="/stocks"
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/",
                "text-gray-400": pathname !== "/"
              })}
            >
              Overview
            </a>
          </li>
          <li className="my-2">
            <a
              href="/stocks/allasset"
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/allasset",
                "text-gray-400": pathname !== "/allasset"
              })}
            >
              All assets
            </a>
          </li>
          <li className="my-2">
            <a
              href="#"
              className="text-gray-400 hover:text-white flex justify-between items-center"
              onClick={() => toggleDropdown("accessories")}
            >
              Accessories
              <span className="ml-1">
                {openDropdown === "accessories" ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </span>
            </a>
            {openDropdown === "accessories" && (
              <ul
                className="ml-5 mt-2 bg-gray-900 rounded-lg p-2"
                ref={dropdownRefs.accessories}
              >
                <li className="my-2">
                  <a
                    href="/stocks/monitor"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/monitor",
                      "text-gray-400": pathname !== "/monitor"
                    })}
                  >
                    Monitor
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/stocks/addKeyMice"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/addKeyMice",
                      "text-gray-400": pathname !== "/addKeyMice"
                    })}
                  >
                    Mouse / Keyboard
                  </a>
                </li>
                {/* <li className="my-2">
                  <a
                    href="/stocks/iphone"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/iphone",
                      "text-gray-400": pathname !== "/iphone"
                    })}
                  >
                    iPhone
                  </a>
                </li> */}
              </ul>
            )}
          </li>
          <li className="my-2">
            <a
              href="/stocks/allasset?status=buyback"
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/buyback",
                "text-gray-400": pathname !== "/buyback"
              })}
            >
              Buyback
            </a>
          </li>
          <li className="my-2">
            <a
              href="/stocks/allasset?status=disposed"
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/disposed",
                "text-gray-400": pathname !== "/disposed"
              })}
            >
              Disposed
            </a>
          </li>

          <li className="my-2">
            <a
              href="#"
              onClick={handleImportClick}
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/imports",
                "text-gray-400": pathname !== "/imports"
              })}
            >
              Imports
            </a>
          </li>
          <li className="my-2">
            <a
              href="#"
              className="text-gray-400 hover:text-white flex justify-between items-center"
              onClick={() => toggleDropdown("settings")}
            >
              Settings
              <span className="ml-1">
                {openDropdown === "settings" ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </span>
            </a>
            {openDropdown === "settings" && (
              <ul
                className="ml-5 mt-2 bg-gray-900 rounded-lg p-2"
                ref={dropdownRefs.settings}
              >
                <li className="my-2">
                  <a
                    href="/stocks/teams"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/teams",
                      "text-gray-400": pathname !== "/teams"
                    })}
                  >
                    Teams
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="./signup"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "./signup",
                      "text-gray-400": pathname !== "./signup"
                    })}
                  >
                    Create new user
                  </a>
                </li>

                <li className="my-2">
                  <a
                    href="/stocks/manufacturers"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/manufacturer",
                      "text-gray-400": pathname !== "/manufacturer"
                    })}
                  >
                    Manufacturers
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="my-2">
            <a
              href="#"
              className="text-gray-400 hover:text-white flex justify-between items-center"
              onClick={() => toggleDropdown("requests")}
            >
              Requests
              <span className="ml-1">
                {openDropdown === "requests" ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </span>
            </a>
            {openDropdown === "requests" && (
              <ul
                className="ml-5 mt-2 bg-gray-900 rounded-lg p-2"
                ref={dropdownRefs.requests}
              >
                <li className="my-2">
                  <a
                    href="mailto:avishkar.gadkar.ext@siemens.com"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/contact-us",
                      "text-gray-400": pathname !== "/contact-us"
                    })}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl text-white mb-4">Import Data</h2>
            <p className="text-gray-300 mb-4">
              Please verify your data before importing. Incorrect data may
              affect the database.
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="mb-4 text-gray-300"
              accept=".csv,.xlsx,.xls"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowImportDialog(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
