"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "components/Sidebar";
import { useRouter } from "next/navigation";

const CheckoutForm = () => {
  const statusOptions = [
    { label: "Default", description: "" },
    {
      label: "MISStock",
      description:
        "✓  This asset can be checked out. Please change the status accordingly.",
      color: "text-green-500"
    },
    {
      label: "New Purchase",
      description:
        "✗ This asset cannot be checked out. Please change the status accordingly.",
      color: "text-red-500"
    },
    // {
    //   label: "MIS Store",
    //   description:
    //     "✓  This asset can be checked out.  Please change the status accordingly. ",
    //   color: "text-green-500"
    // },
    {
      label: "Buyback",
      description:
        "✗  This asset cannot be checked out.  Please changen the status accordingly.",
      color: "text-red-500"
    },
    {
      label: "Disposed",
      description:
        "✗  This asset cannot be checked out.  Please change the status accordingly.",
      color: "text-red-500"
    },

    {
      label: "Deployed",
      description:
        "✓  This asset can be checked out. Please change the status accordingly.",
      color: "text-green-500"
    }
  ];

  const [formData, setFormData] = useState({
    status: "",
    nodeName: "",
    model: "",
    assetOwner: "",
    checkOutDate: "",
    note: ""
  });

  const [serialNumber, setSerialNumber] = useState(null);

  const [openSection, setOpenSection] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenSection("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!serialNumber) return; // Ensure serialNumber is not null before fetching

      try {
        const response = await fetch(
          `/api/asset/get?serialNumber=${serialNumber}`
        );
        const data = await response.json();
        setFormData({
          status: data.status || "",
          nodeName: data.nodeName || "",
          model: data.model || "",
          assetOwner: data.assetOwner || "",
          checkOutDate: data.checkOutDate || "",
          note: ""
        });
      } catch (error) {
        console.error("Error fetching asset details:", error);
      }
    };

    fetchData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serialNumber]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCheckOut = async () => {
    const { status, assetOwner, checkOutDate } = formData;

    if (!status || !assetOwner) {
      alert("Please fill out all mandatory fields: Status and Asset Owner.");
      return;
    }

    // Check if status is 'MISStock'
    if (status === "MISStock") {
      alert(
        "Status cannot be 'MISStock' for checkout. Please select a different status."
      );
      return;
    }

    // Ensure checkout date is set
    if (!checkOutDate) {
      alert("Please select a checkout date.");
      return;
    }
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    console.log("Stored User Data:", storedUserData);

    const ddata = {
      model: formData.model,
      nodeName: formData.nodeName,
      status: formData.status,
      assetOwner: formData.assetOwner,
      storeLocation: "Storage Room A",
      note: formData.note,
      checkType: "checkout",
      serialNumber: serialNumber,
      checkOutDate: formData.checkOutDate,
      assetUser: storedUserData.siemensId, // Assuming userId is the ID of the user checking out the asset
    };

    console.log("Checkout data:", ddata);

    try {
      const response = await fetch("/api/asset/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ddata)
      });
      if (response.ok) {
        alert("Asset CheckOut successfully");
        // router.push("/stocks/allasset"); // Redirect to All Assets page
      } else {
        const errorData = await response.json();
        console.error("Failed to check out asset:", errorData);
        alert("Failed to check out asset!");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serialNumber = urlParams.get("SerialNumber");
    setSerialNumber(serialNumber);
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-5 rounded-lg">
        <section className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Checkout</h1>
        </section>
        <div className="bg-gray-800 p-8 rounded-lg w-[90%] mx-auto">
          <header className="flex justify-between items-center mb-5">
            <h2 className="text-xl">Checkout Asset</h2>
            <div className="cursor-pointer">
              <i className="fas fa-times"></i>
            </div>
          </header>

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
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-not-allowed"
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
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label htmlFor="status" className="w-52 text-gray-500 mr-2">
                Status <span className="text-red-600">*</span>
              </label>
              <div className="w-3/5 relative">
                <input
                  type="text"
                  id="status"
                  value={formData.status}
                  onClick={() => toggleSection("status")}
                  className="p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400 cursor-pointer w-full"
                  readOnly
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
                    ref={dropdownRef}
                    className="absolute bg-gray-800 border border-gray-700 mt-2 rounded w-full z-10"
                  >
                    {statusOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            status: option.label
                          });
                          toggleSection("status");
                        }}
                        className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                      >
                        <span className={`${option.color} mr-2`}></span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1 ml-56">
              {statusOptions.find((option) => option.label === formData.status)
                ?.description || "Select a status"}
            </div>
          </div>

          {/* Asset Owner */}
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="assetOwner" className="w-52 text-gray-500 mr-2">
                Asset Owner <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="assetOwner"
                value={formData.assetOwner}
                onChange={handleInputChange}
                placeholder="Enter the name"
                className="w-3/5 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400"
              />
            </div>
          </div>

          {/* Checkout Date */}
          <div className="mb-4 ml-10">
            <div className="flex items-center mb-2">
              <label htmlFor="checkOutDate" className="w-52 text-gray-500 mr-2">
                Checkout Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
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
                rows="3"
                className="block p-2 w-2/3 text-sm text-gray-900 bg-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Add any notes here..."
                value={formData.note}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="p-2 px-5 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCheckOut}
          >
            Checkout
          </button>
          <button
            type="button"
            className="p-2 px-5 ml-4 bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => {
              const queryParams = new URLSearchParams({
                nodeName: formData.nodeName,
                serialNumber: new URLSearchParams(window.location.search).get(
                  "SerialNumber"
                )
              }).toString();
              window.location.href = `/hardware/printSheet?${queryParams}`;
            }}
          >
            Print Hardware
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
