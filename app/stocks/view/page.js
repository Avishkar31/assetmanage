"use client";
import { useState, useEffect } from "react";
import Sidebar from "components/Sidebar";
import AssetHistoryShow from "@/components/AssetHistoryShow";

// Reusable InputComponent
const InputComponent = ({ id, value, onChange, readOnly }) => (
  <input
    id={id}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className="bg-gray-800 text-white border-gray-600 rounded-lg p-2 outline-none"
  />
);

const ViewAsset = () => {
  const [formData, setFormData] = useState({
    status: "",
    nodeName: "",
    serialNumber: "",
    category: "",
    model: "",
    expires: "",
    defaultLocation: "",
    assetOwner: "",
    costCenter: "",
    receivedDate: "",
    condition: "",
    note: "",
    storeLocation: "",
    poNumber: "",
    order: "",
    accessories: []
  });

  const [history, setHistory] = useState([]);
  const [serialNumber, setSerialNumber] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [assetHistory, setAssetHistory] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serialNumber = urlParams.get("SerialNumber");
    setSerialNumber(serialNumber);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/asset/get?serialNumber=${serialNumber}`
        );
        const data = await response.json();
        setFormData(data);
        setHistory(data.assetHistory);
        // Extract and set accessories from the latest history entry
        if (data.assetHistory && data.assetHistory.length > 0) {
          const latestEntry = data.assetHistory[data.assetHistory.length - 1];
          setFormData((prev) => ({
            ...prev,
            accessories: latestEntry.accessories || []
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (serialNumber) {
      fetchData();
    }
  }, [serialNumber]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleDeleteClick = () => {
    alert(
      "You are not an authorized person to delete. Please connect with the admin."
    );
  };

  const toggleReadOnly = () => setIsReadOnly(!isReadOnly);

  const handleHistoryClick = async () => {
    try {
      const response = await fetch(
        `/api/asset/history?assetId=${serialNumber}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const historyData = await response.json();
      setAssetHistory(historyData);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching asset history:", error);
      alert("Error fetching history. Please try again later.");
    }
  };

  const handleCheckoutToggle = () => {
    const targetUrl =
      formData.status === "Deployed"
        ? `/stocks/checkin?SerialNumber=${serialNumber}`
        : `/stocks/checkout?SerialNumber=${serialNumber}`;
    window.location.href = targetUrl;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Stocks</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="bg-transparent border-none cursor-pointer"
                onClick={toggleReadOnly}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/fkdzyfle.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: "30px", height: "50px" }}
                />
              </button>
            </div>
          </div>
        </header>
        <div className="flex gap-6">
          <div className="flex-1 bg-gray-800 p-6 rounded-lg">
            <header className="mb-4">
              <h3 className="text-lg sticky">View Asset</h3>
            </header>
            <div className="space-y-4">
              {[
                ["Status", "status"],
                ["Node Name", "nodeName"],
                ["Serial Number", "serialNumber"],
                ["Category", "category"],
                ["Model", "model"],
                ["Expires", "expires"],
                ["Issue To", "issueTo"],
                ["Default Location", "defaultLocation"],
                ["Asset Owner", "assetOwner"],
                ["Cost Center", "costCenter"],
                ["Received Date", "receivedDate"],
                ["Asset Condition", "condition"],
                ["MIS Store Location", "storeLocation"],
                ["PO Number", "poNumber"],
                ["Order", "order"]
              ].map(([label, id]) => (
                <div key={id} className="flex justify-between">
                  <span className="text-gray-400">{label}:</span>
                  <span>
                    <InputComponent
                      id={id}
                      value={formData[id] || ""} // Default to empty string if undefined
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                    />
                  </span>
                </div>
              ))}

              <div className="flex justify-between">
                <span className="text-gray-400">Note:</span>
                <span>
                  <textarea
                    id="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className="bg-gray-800 text-white  border-gray-600 rounded-lg p-2 outline-none"
                  />
                </span>
              </div>

              {/* History Section */}
              <AssetHistoryShow history={history} />
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-2">
            {/* Action buttons */}
            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={handleCheckoutToggle}
            >
              {formData.status === "Deployed" ? "Checkin" : "Checkout"}
            </button>
            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Update
            </button>

            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={handleDeleteClick}
            >
              Delete
            </button>

            <div className="border p-4 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              <h3 className="text-lg font-medium mb-2 dark:text-white">
                Accessories
              </h3>
              {assetHistory.length === 0 ? (
                <p className="dark:text-gray-400">
                  No Accessories available for this asset.
                </p>
              ) : (
                <ul className="space-y-2">
                  {assetHistory.map((entry, index) => (
                    <li
                      key={index}
                      className="border p-2 rounded dark:bg-gray-700 dark:border-gray-500"
                    >
                      <p className="dark:text-white">
                        Allocated to: {entry.user} (or however your API returns
                        the person's name)
                      </p>
                      <p className="dark:text-gray-400">
                        Date: {new Date(entry.date).toLocaleDateString()}{" "}
                        (adjust date formatting)
                      </p>{" "}
                      {/* Format the date */}
                      <p className="dark:text-gray-400">Accessories:</p>
                      <ul className="list-disc pl-5 dark:text-gray-400">
                        {Object.entries(entry.accessories).map(
                          ([accessory, value]) => (
                            <li key={accessory}>
                              {accessory}: {value ? "Yes" : "No"}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAsset;
