"use client";
import { useState, useEffect } from "react";

export default function SegmentManagement() {
  // Error 1: Variable name mismatch - setSegment vs setSegments
  const [segments, setSegments] = useState([]); // Changed from setSegment to setSegments
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: ""
  });
  const [editingSegment, setEditingSegment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchSegments();
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchSegments = async () => {
    setIsLoading(true);
    try {
      // Error 2: API endpoint mismatch - should match your actual API route
      const response = await fetch("/api/segments"); // Changed from segments to segments to match your existing API
      const data = await response.json();
      if (data.success) {
        setSegments(data.data);
      } else {
        showNotification("Failed to fetch segments", "error");
      }
    } catch (error) {
      console.error("Error fetching segments:", error);
      showNotification("Error fetching segments", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const method = editingSegment ? "PUT" : "POST";
    // Error 3: API endpoint mismatch
    const url = editingSegment ? `/api/segments?id=${editingSegment._id}` : "/api/segments"; // Changed from segments to segments

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await fetchSegments();
        setFormData({ name: "", description: "", department: "" });
        setEditingSegment(null);
        
        // Show success message
        showNotification(
          editingSegment ? "Segment updated successfully" : "Segment added successfully", 
          "success"
        );
        
        // Error 4: API endpoint mismatch
        await fetch("/api/segment-stats", { cache: "no-store" }); // Changed from segment-stats to segment-stats
      } else {
        showNotification(data.error || "Operation failed", "error");
      }
    } catch (error) {
      console.error("Error saving segment:", error);
      showNotification("Error saving segment", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this segment?")) return;
    
    setIsLoading(true);
    try {
      // Error 5: API endpoint mismatch
      const response = await fetch(`/api/segments?id=${id}`, { method: "DELETE" }); // Changed from segments to segments
      const data = await response.json();
      
      if (response.ok) {
        await fetchSegments();
        showNotification("Segment deleted successfully", "success");
        
        // Error 6: API endpoint mismatch
        await fetch("/api/segment-stats", { cache: "no-store" }); // Changed from segment-stats to segment-stats
      } else {
        showNotification(data.error || "Failed to delete segment", "error");
      }
    } catch (error) {
      console.error("Error deleting segment:", error);
      showNotification("Error deleting segment", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (segment) => {
    setFormData({
      name: segment.name,
      description: segment.description || "",
      department: segment.department
    });
    setEditingSegment(segment);
  };

  const cancelEdit = () => {
    setFormData({ name: "", description: "", department: "" });
    setEditingSegment(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {notification.message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl mb-4">Segment Management</h1>
        <div className="flex gap-2">
          {/* <button
            onClick={() => (window.location.href = "/segment-chart")}
            className="bg-blue-600 p-2 rounded mb-6 hover:bg-blue-700 transition-colors"
          >
            View segment Chart
          </button> */}
          <button
            onClick={() => (window.location.href = "/stocks")}
            className="bg-teal-600 p-2 rounded mb-6 hover:bg-teal-700 transition-colors"
          >
            Stocks Page
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-4">
        <h2 className="text-xl mb-3">{editingSegment ? "Edit Segment" : "Add New Segment"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="mb-2">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Segment name"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Department name"
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 h-20"
            placeholder="Segment description (optional)"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-teal-600 p-2 rounded mt-2 hover:bg-teal-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : editingSegment ? "Update Segment" : "Add Segment"}
          </button>
          {editingSegment && (
            <button 
              type="button" 
              onClick={cancelEdit}
              className="bg-gray-600 p-2 rounded mt-2 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl mb-2">Segment List</h2>
      {isLoading && !segments.length ? (
        <p>Loading segments...</p>
      ) : segments.length === 0 ? (
        <p>No segments found. Add your first segment above.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <div
              key={segment._id}
              className="bg-gray-800 p-4 rounded shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold">{segment.name}</h3>
                <div className="text-sm text-teal-300 mb-1">Department: {segment.department}</div>
                <p className="text-gray-300 text-sm">{segment.description || "No description provided."}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(segment)}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(segment._id)}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
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