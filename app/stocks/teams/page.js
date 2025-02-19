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

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) setTeams(data.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingTeam ? "PUT" : "POST";
    const url = editingTeam ? `/api/teams?id=${editingTeam._id}` : "/api/teams";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchTeams();
        setFormData({ name: "", description: "", department: "" });
        setEditingTeam(null);
      }
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleEdit = (team) => {
    setFormData({
      name: team.name,
      description: team.description,
      department: team.department
    });
    setEditingTeam(team);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl mb-4">Team Management</h1>
        <button
          onClick={() => (window.location.href = "/stocks")}
          className="bg-teal-600 p-2 rounded mb-6"  
        >
          Stocks Page
        </button>
      </div>
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
          <label>Team:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <button type="submit" className="bg-teal-600 p-2 rounded mt-2">
          {editingTeam ? "Update Team" : "Add Team"}
        </button>
      </form>

      <h2 className="text-xl mb-2">Team List</h2>
      <ul>
        {teams.map((team) => (
          <li
            key={team._id}
            className="flex justify-between bg-gray-800 p-3 rounded mb-2"
          >
            <div>
              <strong>{team.name}</strong> - {team.department} <br />
              <small>{team.description}</small>
            </div>
            <div>
              <button
                onClick={() => handleEdit(team)}
                className="bg-blue-500 px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team._id)}
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
