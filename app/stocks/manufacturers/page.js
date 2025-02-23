"use client";
import { useState, useEffect } from "react";

export default function ManufacturerManagement() {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: ""
  });
  const [editingManufacturer, setEditingManufacturer] = useState(null);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const response = await fetch("/api/manufacturers");  
      const data = await response.json();
      if (data.success) setManufacturers(data.data);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setFormData({ name: "", description: "", website: "" });
        setEditingManufacturer(null);
      }
    } catch (error) {
      console.error("Error saving manufacturer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/manufacturers?id=${id}`, { method: "DELETE" });
      fetchManufacturers();
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
    }
  };

  const handleEdit = (manufacturer) => {
    setFormData({
      name: manufacturer.name,
      description: manufacturer.description,
      website: manufacturer.website
    });
    setEditingManufacturer(manufacturer);
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
        <button type="submit" className="bg-teal-600 p-2 rounded mt-2">
          {editingManufacturer ? "Update Manufacturer" : "Add Manufacturer"}
        </button>
      </form>

      <h2 className="text-xl mb-2">Manufacturer List</h2>
      <ul>
        {manufacturers.map((manufacturer) => (
          <li
            key={manufacturer._id}
            className="flex justify-between bg-gray-800 p-3 rounded mb-2"
          >
            <div>
              <strong>{manufacturer.name}</strong> <br />
              <small>{manufacturer.description}</small> <br />
              {manufacturer.website && (
                <a
                  href={
                    manufacturer.website.startsWith("http")
                      ? manufacturer.website
                      : `https://${manufacturer.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  {manufacturer.website}
                </a>
              )}
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
        ))}
      </ul>
    </div>
  );
}
