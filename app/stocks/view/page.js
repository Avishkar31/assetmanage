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
    className="w-full bg-gray-800 text-white border-gray-600 rounded-lg p-2 outline-none text-sm"
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
    assetOwner: "",
    type: "",
    deskLocation: "",
    allocation: "",
    period: "",
    accessories: []
  });

  const [originalData, setOriginalData] = useState({});
  const [history, setHistory] = useState([]);
  const [serialNumber, setSerialNumber] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [accessories, setAccessories] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [userRole, setUserRole] = useState(""); // Add userRole state

  useEffect(() => {
    // Handle responsive view
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serialNumber = urlParams.get("SerialNumber");
    setSerialNumber(serialNumber);
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/asset/get?serialNumber=${serialNumber}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFormData(data);
        setOriginalData(data); // Store original data for comparison during updates
        setAssetId(data._id);
        setHistory(data.assetHistory || []);

        // Parse accessories
        if (data.accessories && typeof data.accessories === 'object') {
          setAccessories(data.accessories);
        } else if (data.accessories && typeof data.accessories === 'string') {
          try {
            // Handle string format "key:value, key:value"
            const accessoriesObj = data.accessories
              .split(", ")
              .reduce((acc, item) => {
                const [key, value] = item.split(":");
                acc[key] = parseInt(value) || 1;
                return acc;
              }, {});
            setAccessories(accessoriesObj);
          } catch (e) {
            console.error("Error parsing accessories string:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(`Failed to load asset data: ${error.message}`);
      }
    };

    if (serialNumber) {
      fetchData();
    }
  }, [serialNumber]);

  useEffect(() => {
    // Get user role from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || "");
      } catch (e) {
        setUserRole("");
      }
    }
  }, []);

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

      // Prepare update data with only modified fields
      const updateData = {
        serialNumber: formData.serialNumber,
        nodeName: formData.nodeName
      };
      
      // Include only fields that have changed
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key] && key !== '_id' && key !== 'assetHistory') {
          updateData[key] = formData[key];
        }
      });

      // Only send update if there are changes
      if (Object.keys(updateData).length <= 2) {
        setUpdateMessage("No changes detected");
        setTimeout(() => setUpdateMessage(""), 3000);
        setIsReadOnly(true);
        setIsUpdating(false);
        return;
      }

      // Call the new PUT endpoint
      const response = await fetch(`/api/asset/update`, {
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

      const result = await response.json();
      
      // Update the UI with the returned asset
      if (result.asset) {
        setFormData(result.asset);
        setOriginalData(result.asset);
        setHistory(result.asset.assetHistory || []);
      }
      
      setIsReadOnly(true);
      setUpdateMessage(result.message || "Asset updated successfully");

      // Show which fields were changed
      if (result.changes && result.changes.length > 0) {
        console.log("Changes made:", result.changes);
      }

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-3 md:p-6 bg-gray-900 overflow-y-auto">
        <header className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl">Stocks</h1>
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
          <div className="bg-green-500 text-white p-2 md:p-3 mb-3 md:mb-4 rounded text-sm">
            {updateMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 md:p-3 mb-3 md:mb-4 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <div className={`flex flex-col ${!isMobileView ? 'md:flex-row' : ''} gap-4 md:gap-6`}>
          <div className="flex-1 bg-gray-800 p-4 md:p-6 rounded-lg">
            <header className="mb-3 md:mb-4">
              <h3 className="text-md md:text-lg sticky">View Asset</h3>
            </header>
            <div className="space-y-3 md:space-y-4">
              {[
                ["Status", "status"],
                ["Node Name", "nodeName"],
                ["Serial Number", "serialNumber"],
                // ["Category", "category"],
                ["Type", "type"],
                ["Model", "model"],
                // ["Desk Location", "deskLocation"],
                ["Asset Owner", "assetOwner"],
                // ["Allocation", "allocation"],
                // ["Period", "period"],
                ["Expires", "expires"],
                ["Default Location", "defaultLocation"],
                
                ["Cost Center", "costCenter"],
                ["Received Date", "receivedDate"],
                ["Asset Condition", "condition"],
                // ["MIS Store Location", "storeLocation"],
                ["PO Number", "poNumber"],
                ["Order", "order"]
              ].map(([label, id]) => (
                <div key={id} className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="text-gray-400 text-sm mb-1 md:mb-0">{label}:</span>
                  <div className="w-full md:w-1/2 lg:w-3/5">
                    <InputComponent
                      id={id}
                      value={formData[id] || ""} // Default to empty string if undefined
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <span className="text-gray-400 text-sm mb-1 md:mb-0">Note:</span>
                <div className="w-full md:w-1/2 lg:w-3/5">
                  <textarea
                    id="note"
                    value={formData.note || ""}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className="w-full bg-gray-800 text-white border-gray-600 rounded-lg p-2 outline-none text-sm"
                    rows={3}
                  />
                </div>
              </div>

              {/* History Section */}
              <AssetHistoryShow history={history} />
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-2 md:max-w-xs">
            {/* Action buttons */}
            <button
              type="button"
              className="py-2 px-4 mb-2 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={handleCheckoutToggle}
            >
              {formData.status === "Deployed" ? "Checkin" : "Checkout"}
            </button>
            
            <button
              type="button"
              className={`py-2 px-4 mb-2 w-full text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 ${
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

            {/* <button
              type="button" 
              className="py-2 px-4 mb-2 w-full text-sm font-medium text-white focus:outline-none bg-green-600 rounded-lg border border-green-700 hover:bg-green-700 focus:z-10 focus:ring-4 focus:ring-green-300"
              onClick={handlePrintForm}
            >
              Print Form
            </button> */}

            <button
              type="button"
              className="py-2 px-4 mb-2 w-full text-sm font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-700 hover:bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-300"
              onClick={handleDeleteClick}
              disabled={userRole !== "Admin"}
              title={userRole !== "Admin" ? "Only admin can delete asset" : ""}
            >
              Delete
            </button>

            <div className="border p-3 md:p-4 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              <h3 className="text-md md:text-lg font-medium mb-2 dark:text-white">
                Accessories
              </h3>
              {Object.keys(accessories).length === 0 ? (
                <p className="dark:text-gray-400 text-sm">
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
                        <p className="dark:text-white text-sm">{accessory}</p>
                        <p className="dark:text-gray-400 text-xs">
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