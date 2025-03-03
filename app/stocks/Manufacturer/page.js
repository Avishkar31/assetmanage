"use client";
import { useState, useEffect } from "react";

export default function ManufacturerManagement() {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: ""
  });
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const response = await fetch("/api/Manufacturer");
      if (!response.ok) {
        throw new Error("Failed to fetch manufacturers");
      }
      const data = await response.json();
      setManufacturers(data.data);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setError("Error fetching manufacturers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save manufacturer");
      }

      setFormData({ name: "", address: "", contact: "" });
      setEditingManufacturer(null);
      fetchManufacturers();
    } catch (error) {
      console.error("Error saving manufacturer:", error);
      setError(error.message || "Error saving manufacturer");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/Manufacturer?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete manufacturer");
      }

      fetchManufacturers();
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      setError(error.message || "Error deleting manufacturer");
    }
  };

  const handleEdit = (manufacturer) => {
    if (!manufacturer) {
      setError("Invalid manufacturer data");
      return;
    }
    setFormData({
      name: manufacturer.name,
      address: manufacturer.address,
      contact: manufacturer.contact
    });
    setEditingManufacturer(manufacturer);
    setError(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Manufacturer Management</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-4">
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
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-2">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <button type="submit" className="bg-teal-600 p-2 rounded mt-2">
          {editingManufacturer ? "Update Manufacturer" : "Add Manufacturer"}
        </button>
      </form>

      <h2 className="text-xl mb-2">Manufacturer List</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {manufacturers.length > 0 ? (
          manufacturers.map((manufacturer) => (
            <li
              key={manufacturer._id}
              className="flex justify-between bg-gray-800 p-3 rounded mb-2"
            >
              <div>
                <strong>{manufacturer.name}</strong> <br />
                <small>{manufacturer.address}</small> <br />
                <small>{manufacturer.contact}</small>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(manufacturer)}
                  className="bg-blue-500 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(manufacturer._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No manufacturers found</p>
        )}
      </ul>
    </div>
  );
}
