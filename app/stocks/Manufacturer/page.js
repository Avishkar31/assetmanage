"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Use dynamic import with ssr: false to prevent server-side rendering errors
const ManufacturerPieChart = dynamic(
  () => import("../../../components/ManufacturerPieChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex justify-center items-center">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    ),
  }
);

export default function ManufacturerManagement() {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: ""
  });
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartKey, setChartKey] = useState(0); // Add a key to force chart re-render

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/Manufacturer");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setManufacturers(data.data || []);
      setChartKey(prevKey => prevKey + 1); // Force chart re-render when data changes
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setError("Error fetching manufacturers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      let url = "/api/Manufacturer";
      let method = "POST";

      if (editingManufacturer) {
        url = `/api/Manufacturer?id=${editingManufacturer._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed with status: ${response.status}`);
      }

      setFormData({ name: "", address: "", contact: "" });
      setEditingManufacturer(null);
      setMessage(editingManufacturer ? "Manufacturer updated successfully" : "Manufacturer added successfully");
      fetchManufacturers(); // This will update the chart as well
    } catch (error) {
      console.error("Error saving manufacturer:", error);
      setError(error.message || "Error saving manufacturer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this manufacturer?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const url = `/api/Manufacturer?id=${id}`;
      
      const response = await fetch(url, {
        method: "DELETE"
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed with status: ${response.status}`);
      }

      setMessage("Manufacturer deleted successfully");
      fetchManufacturers(); // This will update the chart as well
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      setError(error.message || "Error deleting manufacturer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manufacturer) => {
    if (!manufacturer) {
      setError("Invalid manufacturer data");
      return;
    }
    setFormData({
      name: manufacturer.name,
      address: manufacturer.address || "",
      contact: manufacturer.contact || ""
    });
    setEditingManufacturer(manufacturer);
    setError(null);
    setMessage(null);
  };

  const handleCancel = () => {
    setFormData({ name: "", address: "", contact: "" });
    setEditingManufacturer(null);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Manufacturer Management</h1>
      
      {message && <div className="bg-green-600 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}
      {loading && <div className="bg-blue-600 p-3 rounded mb-4">Loading...</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
            <h2 className="text-xl mb-2">
              {editingManufacturer ? "Edit Manufacturer" : "Add New Manufacturer"}
            </h2>
            <div className="mb-3">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Contact:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 p-2 rounded"
                disabled={loading}
              >
                {editingManufacturer ? "Update Manufacturer" : "Add Manufacturer"}
              </button>
              {editingManufacturer && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 p-2 rounded"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <button 
            onClick={fetchManufacturers} 
            className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded mb-4"
            disabled={loading}
          >
            Refresh Manufacturer List
          </button>

          <h2 className="text-xl mb-3">Manufacturer List</h2>
          {manufacturers.length > 0 ? (
            <div className="grid gap-3">
              {manufacturers.map((manufacturer) => (
                <div
                  key={manufacturer._id}
                  className="flex justify-between bg-gray-800 p-4 rounded"
                >
                  <div>
                    <h3 className="text-lg font-bold">{manufacturer.name}</h3>
                    <p className="text-gray-300">{manufacturer.address}</p>
                    <p className="text-gray-300">{manufacturer.contact}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(manufacturer)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(manufacturer._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded text-center">
              {loading ? "Loading manufacturers..." : "No manufacturers found"}
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-xl mb-3 text-center">Manufacturer Distribution</h2>
          <ManufacturerPieChart key={chartKey} manufacturers={manufacturers} />
        </div>
      </div>
    </div>
  );
}