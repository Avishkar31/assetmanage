"use client";
import React, { useState, useRef } from "react";

const PrintSheet = () => {
  const cpuRef = useRef();
  const lcdMonitorRef = useRef();
  const dockingStationRef = useRef();
  const keyboardRef = useRef();
  const mouseRef = useRef();
  const powerAdaptorLaptopRef = useRef();
  const powerAdaptopDockingStationRef = useRef();
  const laptopBagRef = useRef();
  const modularBatteryRef = useRef();
  const laptopLockRef = useRef();
  const hddRef = useRef();
  const headphoneRef = useRef();
  const cardReaderRef = useRef();
  const printerRef = useRef();
  const mobileRef = useRef();

  const [formData, setFormData] = useState({
    issuedTo: "",
    deskLocation: "",
    type: "",
    model: "",
    nodeName: "",
    serialNumber: "",
    allocation: "",
    period: "",
    accessories: {
      CPU: false,
      'LCD Monitor': false,
      'Docking Station': false,
      'Keyboard': false,
      'Mouse': false,
      'Power Adapter (Laptop)': false,
      'Power Adaptor (Docking station)': false,
      'Laptop Bag': false,
      'Modular Battery': false,
      'Laptop Lock': false,
      'Internal HDD/ External HDD': false,
      'Headphone': false,
      'Cardreader': false,
      'Printer': false,
      'Mobile': false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (accessory) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: !prev.accessories[accessory] ? "1" : ""
      }
    }));
  };

  const handlePrintAndSave = async () => {
    try {
      // Save the data
    //   const response = await fetch('/api/hardware/save', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to save data');
    //   }

      // Print the page
      window.print();
      
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <div>
      <div className="w-[21cm] min-h-[29.7cm] mx-auto bg-white p-8 text-black print:shadow-none">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Hardware Allocation Sheet</h1>
          <p className="text-sm mt-2">Date:</p>
        </div>

        {/* User Info Section */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <label className="font-semibold">Issued To:</label>
                <input
                  type="text"
                  name="issuedTo"
                  value={formData.issuedTo}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Desk Location:</label>
                <input
                  type="text"
                  name="deskLocation"
                  value={formData.deskLocation}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
            </div>
            <div>
              <div className="mb-2">
                <label className="font-semibold">Model:</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Node Name:</label>
                <input
                  type="text"
                  name="nodeName"
                  value={formData.nodeName}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Serial Number:</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="mb-2">
              <label className="font-semibold">Allocation:</label>
              <input
                type="text"
                name="allocation"
                value={formData.allocation}
                onChange={handleInputChange}
                className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Period:</label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                className="ml-2 border-b border-gray-500 px-2 text-sm bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Accessories Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Accessories</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.accessories).map(([accessory, checked]) => (
              <div key={accessory} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked === "1"}
                  onChange={() => handleCheckboxChange(accessory)}
                  className="mr-2 appearance-none h-4 w-4 border border-gray-300 rounded bg-transparent checked:bg-black checked:border-transparent focus:outline-none"
                  ref={
                    accessory === 'CPU' ? cpuRef :
                    accessory === 'LCD Monitor' ? lcdMonitorRef :
                    accessory === 'Docking Station' ? dockingStationRef :
                    accessory === 'Keyboard' ? keyboardRef :
                    accessory === 'Mouse' ? mouseRef :
                    accessory === 'Power Adapter (Laptop)' ? powerAdaptorLaptopRef :
                    accessory === 'Power Adaptor (Docking station)' ? powerAdaptopDockingStationRef :
                    accessory === 'Laptop Bag' ? laptopBagRef :
                    accessory === 'Modular Battery' ? modularBatteryRef :
                    accessory === 'Laptop Lock' ? laptopLockRef :
                    accessory === 'Internal HDD/ External HDD' ? hddRef :
                    accessory === 'Headphone' ? headphoneRef :
                    accessory === 'Cardreader' ? cardReaderRef :
                    accessory === 'Printer' ? printerRef :
                    accessory === 'Mobile' ? mobileRef : null
                  }
                />
                <span>{accessory}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-12">
          <div className="flex justify-between">
            <div className="text-center">
              <div className="border-t border-black w-48 mt-16"></div>
              <p className="text-sm">Employee Signature</p>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-48 mt-16"></div>
              <p className="text-sm">IT Department Signature</p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-8 text-xs">
          <p className="font-semibold mb-2">Terms & Conditions:</p>
          <ol className="list-decimal ml-4">
            <li>All equipment remains the property of the company</li>
            <li>
              User is responsible for the proper care and handling of the
              equipment
            </li>
            <li>Any damage or loss must be reported immediately</li>
            <li>Equipment must be returned upon termination of employment</li>
          </ol>
        </div>
      </div>

      {/* Print & Save Button - Hidden during printing */}
      <div className="flex justify-center mt-4 print:hidden">
        <button
          onClick={handlePrintAndSave}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Print & Save
        </button>
      </div>
    </div>
  );
};

export default PrintSheet;
