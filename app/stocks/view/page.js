"use client";
import { useState, useEffect } from "react";
import Sidebar from "components/Sidebar";
import AssetHistoryShow from "@/components/AssetHistoryShow";
import { toast } from "react-hot-toast";

// Reusabnent
const InputComponent = ({ id, value }) => (
  <input
    id={id}
    value={value}
    readOnly={true}
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
    type: "",
    deskLocation: "",
    allocation: "",
    period: "",
    accessories: []
  });

  const [history, setHistory] = useState([]);
  const [serialNumber, setSerialNumber] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [accessories, setAccessories] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [userRole, setUserRole] = useState(""); // Add userRole state
  const [isEditingAccessories, setIsEditingAccessories] = useState(false);
  const [editableAccessories, setEditableAccessories] = useState({});
  const [newAccessory, setNewAccessory] = useState({ name: "", quantity: 1 });

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
      setUserRole((userData.role || "").toLowerCase()); // Convert to lowercase for consistent comparison
    } catch (e) {
      console.error("Error parsing user data:", e);
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

  const handleUpdateClick = () => {
    // Redirect to update page with the serial number
    if (serialNumber) {
      window.location.href = `/stocks/updating?serialNumber=${serialNumber}`;
    }
  };

  const handleDeleteClick = async () => {
    // First, show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );
    if (!confirmed) return;

    try {
      if (!assetId) {
        throw new Error("Asset ID is missing");
      }

      const response = await fetch(`/api/asset/delete/${assetId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete asset");
      }

      toast.success("Asset deleted successfully");
      // Redirect to assets list page after successful deletion
      setTimeout(() => {
        window.location.href = "/stocks/allasset";
      }, 1000);
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error(error.message || "Failed to delete asset. You may not have permission.");
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

  const handleUpdateAccessories = () => {
    setEditableAccessories({...accessories});
    setIsEditingAccessories(true);
  };

  const handleSaveAccessories = async () => {
    try {
      const response = await fetch(`/api/asset/${assetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessories: editableAccessories
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update accessories');
      }

      setAccessories(editableAccessories);
      setIsEditingAccessories(false);
      toast.success('Accessories updated successfully');
    } catch (error) {
      console.error('Error updating accessories:', error);
      toast.error('Failed to update accessories');
    }
  };

  const handleAddAccessory = () => {
    if (newAccessory.name.trim()) {
      setEditableAccessories(prev => ({
        ...prev,
        [newAccessory.name]: newAccessory.quantity
      }));
      setNewAccessory({ name: "", quantity: 1 });
    }
  };

  const handleRemoveAccessory = (accessoryName) => {
    const updatedAccessories = {...editableAccessories};
    delete updatedAccessories[accessoryName];
    setEditableAccessories(updatedAccessories);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-3 md:p-6 bg-gray-900 overflow-y-auto">
        <header className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl">Stocks</h1>
          <div className="flex items-center space-x-4">
          </div>
        </header>

        {/* Status Messages */}
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
                ["MIS Store Location", "storeLocation"],
                ["PO Number", "poNumber"],
                ["Order", "order"]
              ].map(([label, id]) => (
                <div key={id} className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="text-gray-400 text-sm mb-1 md:mb-0">{label}:</span>
                  <div className="w-full md:w-1/2 lg:w-3/5">
                    <InputComponent
                      id={id}
                      value={formData[id] || ""} // Default to empty string if undefined
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
                    readOnly={true}
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
              className="py-2 px-4 mb-2 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={handleUpdateClick}
            >
              Update Asset
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
              disabled={userRole.toLowerCase() !== "admin"}
              title={userRole.toLowerCase() !== "admin" ? "Only admin can delete asset" : ""}
            >
              Delete
            </button>

            <div className="border p-3 md:p-4 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md md:text-lg font-medium dark:text-white">
                  Accessories
                </h3>
                <button
                  onClick={handleUpdateAccessories}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Edit Accessories
                </button>
              </div>
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

      {/* Edit Accessories Modal */}
      {isEditingAccessories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Accessories</h2>
            
            {/* Add new accessory */}
            <div className="mb-4 flex space-x-2">
              <input
                type="text"
                placeholder="Accessory name"
                value={newAccessory.name}
                onChange={(e) => setNewAccessory(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="number"
                min="1"
                value={newAccessory.quantity}
                onChange={(e) => setNewAccessory(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="w-20 px-3 py-2 bg-gray-700 rounded-lg text-white"
              />
              <button
                onClick={handleAddAccessory}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Accessories list */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {Object.entries(editableAccessories).map(([accessory, quantity], index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                  <span className="text-white">{accessory}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setEditableAccessories(prev => ({
                        ...prev,
                        [accessory]: parseInt(e.target.value) || 1
                      }))}
                      className="w-16 px-2 py-1 bg-gray-600 rounded text-white"
                    />
                    <button
                      onClick={() => handleRemoveAccessory(accessory)}
                      className="text-red-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingAccessories(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccessories}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAsset;