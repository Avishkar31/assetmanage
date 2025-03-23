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
  const [assetId, setAssetId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [accessories, setAccessories] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        setAssetId(data._id); // Store the asset ID for update/delete operations
        setHistory(data.assetHistory);

        // Parse accessories string into object
        if (data.accessories) {
          const accessoriesObj = data.accessories
            .split(", ")
            .reduce((acc, item) => {
              const [key, value] = item.split(":");
              acc[key] = parseInt(value);
              return acc;
            }, {});
          setAccessories(accessoriesObj);
        }

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
        setErrorMessage("Failed to load asset data");
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

  const handleUpdateClick = async () => {
    if (isReadOnly) {
      // If in read-only mode, switch to edit mode
      setIsReadOnly(false);
      return;
    }

    try {
      setIsUpdating(true);
      setErrorMessage("");

      // Get current user info (you'll need to implement this based on your auth system)
      const user = { siemensId: "current-user" }; // Replace with actual user info

      const updateData = {
        ...formData,
        user // Include user for history tracking
      };

      const response = await fetch(`/api/asset/update/${assetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update asset");
      }

      const updatedAsset = await response.json();
      setFormData(updatedAsset);
      setHistory(updatedAsset.assetHistory);
      setIsReadOnly(true);
      setUpdateMessage("Asset updated successfully");

      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error("Error updating asset:", error);
      setErrorMessage(error.message || "Failed to update asset");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    // First, show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/asset/delete/${assetId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete asset");
      }

      // Redirect to assets list page after successful deletion
      window.location.href = "/stocks";
    } catch (error) {
      console.error("Error deleting asset:", error);
      setErrorMessage(
        error.message || "Failed to delete asset. You may not have permission."
      );
    }
  };

  const toggleReadOnly = () => setIsReadOnly(!isReadOnly);

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

        {/* Status Messages */}
        {updateMessage && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded">
            {updateMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded">
            {errorMessage}
          </div>
        )}

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
                    value={formData.note || ""}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className="bg-gray-800 text-white border-gray-600 rounded-lg p-2 outline-none"
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
              className={`py-2.5 px-5 mb-2 w-80 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 ${
                !isReadOnly
                  ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
                  : "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              }`}
              onClick={handleUpdateClick}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Updating..."
                : !isReadOnly
                ? "Save Changes"
                : "Update"}
            </button>

            <button
              type="button"
              className="py-2.5 px-5 mb-2 w-80 text-sm font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-700 hover:bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-300"
              onClick={handleDeleteClick}
            >
              Delete
            </button>

            <div className="border p-4 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              <h3 className="text-lg font-medium mb-2 dark:text-white">
                Accessories
              </h3>
              {Object.keys(accessories).length === 0 ? (
                <p className="dark:text-gray-400">
                  No Accessories available for this asset.
                </p>
              ) : (
                <ul className="space-y-2">
                  {Object.entries(accessories).map(
                    ([accessory, quantity], index) => (
                      <li
                        key={index}
                        className="border p-2 rounded dark:bg-gray-700 dark:border-gray-500"
                      >
                        <p className="dark:text-white">{accessory}</p>
                        <p className="dark:text-gray-400">
                          Quantity: {quantity}
                        </p>
                      </li>
                    )
                  )}
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
