"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname(); // Get the current route

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
    for (const ref of Object.values(dropdownRefs)) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
  };

  const handleLogout = () => {
    // Clear token or session data
    localStorage.removeItem("token");

    // Redirect to login or home page
    window.location.href = "/";
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-64 shrink-0 bg-gray-800 p-5">
      <div className="text-center mb-5">
        <img
          src="https://www.siemens.com/img/svg/logo-dark-3958fff2.svg"
          alt="Siemens"
          className="rounded-full w-24 h-24 mx-auto"
        />
        <div className="relative" ref={dropdownRefs.profile}>
          <h3
            className="cursor-pointer mt-2 flex items-center"
            onClick={() => toggleDropdown("profile")}
          >
            Gadkar Avishkar
            <span className="ml-1">
              {openDropdown === "profile" ? (
                <IoMdArrowDropup />
              ) : (
                <IoMdArrowDropdown />
              )}
            </span>
          </h3>
          {openDropdown === "profile" && (
            <div className="absolute bg-gray-900 mt-2 rounded-lg p-2 shadow-lg">
              <ul>
                <li className="mb-2">
                  <a href="/profile" className="text-gray-400 hover:text-white">
                    Edit your profile
                  </a>
                </li>
                <li>
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
                    href="/monitor"
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
                    href="/mouse"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/mouse",
                      "text-gray-400": pathname !== "/mouse"
                    })}
                  >
                    Mouse
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/keyboard"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/keyboard",
                      "text-gray-400": pathname !== "/keyboard"
                    })}
                  >
                    Keyboard
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/iphone"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/iphone",
                      "text-gray-400": pathname !== "/iphone"
                    })}
                  >
                    iPhone
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="my-2">
            <a
              href="/buyback"
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
              href="/disposed"
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
              href="/deleted"
              className={clsx("hover:text-white", {
                "text-white font-bold": pathname === "/deleted",
                "text-gray-400": pathname !== "/deleted"
              })}
            >
              Deleted
            </a>
          </li>
          <li className="my-2">
            <a
              href="/imports"
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
                    href="/departments"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/departments",
                      "text-gray-400": pathname !== "/departments"
                    })}
                  >
                    Departments
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="./people"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "./people",
                      "text-gray-400": pathname !== "./people"
                    })}
                  >
                    Create new user
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/models"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/models",
                      "text-gray-400": pathname !== "/models"
                    })}
                  >
                    Models
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/manufacturer"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/manufacturer",
                      "text-gray-400": pathname !== "/manufacturer"
                    })}
                  >
                    Manufacturer
                  </a>
                </li>
                <li className="my-2">
                  <a
                    href="/categories"
                    className={clsx("hover:text-white", {
                      "text-white font-bold": pathname === "/categories",
                      "text-gray-400": pathname !== "/categories"
                    })}
                  >
                    Categories
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
                    href="/contact-us"
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
    </div>
  );
};

export default Sidebar;
