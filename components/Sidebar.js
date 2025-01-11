import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

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
                  <a
                    href="@/components/profile"
                    className="text-gray-400 hover:text-white"
                  >
                    Edit your profile
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-400 hover:text-white">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <p className="text-gray-400">Administrator</p>
      </div>
      <nav>
        <ul>
          <li className="my-2">
            <a href="./" className="text-gray-400 hover:text-white">
              Overview
            </a>
          </li>
          <li className="my-2">
            <a href="./allasset" className="text-gray-400 hover:text-white">
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
                  <a href="/monitor" className="text-gray-400 hover:text-white">
                    Monitor
                  </a>
                </li>
                <li className="my-2">
                  <a href="" className="text-gray-400 hover:text-white">
                    Mouse
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Keyboard
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
                    iPhone
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="my-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Buyback
            </a>
          </li>
          <li className="my-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Disposed
            </a>
          </li>
          <li className="my-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Deleted
            </a>
          </li>
          <li className="my-2">
            <a href="#" className="text-gray-400 hover:text-white">
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
                  <a href="#" className="text-gray-400 hover:text-white">
                    Departments
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
                    People
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Models
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Manufacturer
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-gray-400 hover:text-white">
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
                  <a href="#" className="text-gray-400 hover:text-white">
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
