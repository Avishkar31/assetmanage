"use client";
import React, { useState, useEffect } from "react";

export default function ManufacturerManagement() {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    status: "active",
    supportContact: {
      email: ""
    }
  });
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/manufacturers");
      const data = await response.json();
      if (data.success) {
        setManufacturers(data.data);
      } else {
        setError("Failed to fetch manufacturers");
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setError("Error loading manufacturers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData({
        ...formData,
        supportContact: { ...formData.supportContact, email: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingManufacturer ? "PUT" : "POST";
    const url = editingManufacturer 
      ? `/api/manufacturers?id=${editingManufacturer._id}` 
      : "/api/manufacturers";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchManufacturers();
        setFormData({
          name: "",
          description: "",
          website: "",
          status: "active",
          supportContact: { email: "" }
        });
        setEditingManufacturer(null);
      }
    } catch (error) {
      console.error("Error saving manufacturer:", error);
    }
  };

  const initiateDelete = (manufacturer) => {
    setManufacturerToDelete(manufacturer);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!manufacturerToDelete) return;

    try {
      await fetch(`/api/manufacturers?id=${manufacturerToDelete._id}`, { method: "DELETE" });
      fetchManufacturers();
      setShowConfirmDelete(false);
      setManufacturerToDelete(null);
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
    }
  };

  const handleEdit = (manufacturer) => {
    setFormData({
      name: manufacturer.name,
      description: manufacturer.description || "",
      website: manufacturer.website || "",
      status: manufacturer.status,
      supportContact: {
        email: manufacturer.supportContact?.email || ""
      }
    });
    setEditingManufacturer(manufacturer);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Manufacturer Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-4 w-[60%]">
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        
        <div className="mb-2">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        
        <div className="mb-2">
          <label>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        
        <div className="mb-2">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="mb-2">
          <label>Support Email:</label>
          <input
            type="email"
            name="email"
            value={formData.supportContact.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {editingManufacturer ? "Update" : "Add"} Manufacturer
        </button>
      </form>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete {manufacturerToDelete?.name}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p>Loading manufacturers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
        </div>
      ) : manufacturers.length === 0 ? (
        <div className="text-center py-4">
          <p>No manufacturers found in the database.</p>
          <p className="text-gray-400">Add a new manufacturer using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {manufacturers.map((manufacturer) => (
            <div key={manufacturer._id} className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl mb-2">{manufacturer.name}</h3>
              <p className="text-gray-400">{manufacturer.description}</p>
              <p className="text-gray-400">
                Website: <a href={manufacturer.website} className="text-blue-400 hover:underline">{manufacturer.website}</a>
              </p>
              <p className="text-gray-400">Status: {manufacturer.status}</p>
              <p className="text-gray-400">
                Support Email: {manufacturer.supportContact?.email}
              </p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(manufacturer)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => initiateDelete(manufacturer)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
