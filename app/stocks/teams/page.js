"use client";
import { useState, useEffect } from "react";

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: ""
  });
  const [editingTeam, setEditingTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchTeams();
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

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      } else {
        showNotification("Failed to fetch teams", "error");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      showNotification("Error fetching teams", "error");
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
    const method = editingTeam ? "PUT" : "POST";
    const url = editingTeam ? `/api/teams?id=${editingTeam._id}` : "/api/teams";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await fetchTeams();
        setFormData({ name: "", description: "", department: "" });
        setEditingTeam(null);
        
        // Show success message
        showNotification(
          editingTeam ? "Team updated successfully" : "Team added successfully", 
          "success"
        );
        
        // Invalidate the team stats cache to refresh charts
        await fetch("/api/team-stats", { cache: "no-store" });
      } else {
        showNotification(data.error || "Operation failed", "error");
      }
    } catch (error) {
      console.error("Error saving team:", error);
      showNotification("Error saving team", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (response.ok) {
        await fetchTeams();
        showNotification("Team deleted successfully", "success");
        
        // Invalidate the team stats cache to refresh charts
        await fetch("/api/team-stats", { cache: "no-store" });
      } else {
        showNotification(data.error || "Failed to delete team", "error");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      showNotification("Error deleting team", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (team) => {
    setFormData({
      name: team.name,
      description: team.description || "",
      department: team.department
    });
    setEditingTeam(team);
  };

  const cancelEdit = () => {
    setFormData({ name: "", description: "", department: "" });
    setEditingTeam(null);
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
        <h1 className="text-2xl mb-4">Team Management</h1>
        <div className="flex gap-2">
          {/* <button
            onClick={() => (window.location.href = "/team-chart")}
            className="bg-blue-600 p-2 rounded mb-6 hover:bg-blue-700 transition-colors"
          >
            View Team Chart
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
        <h2 className="text-xl mb-3">{editingTeam ? "Edit Team" : "Add New Team"}</h2>
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
              placeholder="Team name"
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
            placeholder="Team description (optional)"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-teal-600 p-2 rounded mt-2 hover:bg-teal-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : editingTeam ? "Update Team" : "Add Team"}
          </button>
          {editingTeam && (
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

      <h2 className="text-xl mb-2">Team List</h2>
      {isLoading && !teams.length ? (
        <p>Loading teams...</p>
      ) : teams.length === 0 ? (
        <p>No teams found. Add your first team above.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-gray-800 p-4 rounded shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold">{team.name}</h3>
                <div className="text-sm text-teal-300 mb-1">Department: {team.department}</div>
                <p className="text-gray-300 text-sm">{team.description || "No description provided."}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team._id)}
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