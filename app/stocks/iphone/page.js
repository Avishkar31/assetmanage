"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function IphonePage() {
  const [formData, setFormData] = useState({
    model: "",
    serialNumber: "", 
    poNumber: "",
    owner: "",
    status: "Available",
    purchaseDate: ""
  });

  const [iphones, setIphones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("model");
  const router = useRouter();

  useEffect(() => {
    fetchIphones();
  }, []);

  const fetchIphones = async () => {
    try {
      const response = await fetch('/api/iphones');
      if (!response.ok) {
        throw new Error('Failed to fetch iphones');
      }
      const data = await response.json();
      setIphones(data);
    } catch (error) {
      console.error("Error fetching iphones:", error);
      alert("Failed to load iphones");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/iphones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add iPhone');
      }

      await fetchIphones();

      setFormData({
        model: "",
        serialNumber: "",
        poNumber: "",
        owner: "",
        status: "Available",
        purchaseDate: ""
      });

    } catch (error) {
      console.error("Error adding iPhone:", error);
      alert("Failed to add iPhone");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this iPhone?")) {
      try {
        const response = await fetch(`/api/iphones/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete iPhone');
        }

        await fetchIphones();
      } catch (error) {
        console.error("Error deleting iPhone:", error);
        alert("Failed to delete iPhone");
      }
    }
  };

  const filteredIphones = iphones.filter(iphone => {
    const searchValue = iphone[searchField]?.toLowerCase() || '';
    return searchValue.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-5 overflow-y-auto">
        <header className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl">iPhone Inventory</h1>
            <p className="text-gray-400">Manage iPhone stock</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl mb-4">Add New iPhone</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PO Number</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
              >
                Add iPhone
              </button>
            </form>
          </section>

          <section className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">iPhone List</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 bg-gray-700 rounded"
                />
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="p-2 bg-gray-700 rounded"
                >
                  <option value="model">Model</option>
                  <option value="serialNumber">Serial Number</option>
                  <option value="poNumber">PO Number</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Model</th>
                    <th className="p-2">Serial Number</th>
                    <th className="p-2">PO Number</th>
                    <th className="p-2">Owner</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIphones.map((iphone, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-2">{iphone.model}</td>
                      <td className="p-2">{iphone.serialNumber}</td>
                      <td className="p-2">{iphone.poNumber}</td>
                      <td className="p-2">{iphone.owner || 'N/A'}</td>
                      <td className="p-2">{iphone.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
