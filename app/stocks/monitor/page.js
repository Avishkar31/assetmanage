"use client";
import { useState, useEffect } from "react";
import Sidebar from "components/Sidebar";

function Page() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [monitors, setMonitors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("model");

  const [formData, setFormData] = useState({
    prRequester: "",
    manufacturer: "",
    model: "",
    prNumber: "",
    poNumber: "",
    serialNumber: "",
    status: "",
    username: "",
    assetHistory: []
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      fetchMonitors();
    }
  }, [selectedTeam]);

  const fetchMonitors = async () => {
    try {
      const response = await fetch(
        `/api/asset/CheckInOutMonitors?team=${selectedTeam}`
      );
      const data = await response.json();
      if (data.success) {
        setMonitors(data.data); // Ensure correct data structure
      }
    } catch (error) {
      console.error("Error fetching monitors:", error);
    }
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team._id); // Ensure correct selection
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    try {
      const response = await fetch("/api/asset/checkInOutMonitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, team: selectedTeam })
      });

      if (!response.ok) throw new Error("Failed to add monitor");

      await fetchMonitors();
      setFormData({
        prRequester: "",
        manufacturer: "",
        model: "",
        prNumber: "",
        poNumber: "",
        serialNumber: "",
        status: "",
        username: "",
        assetHistory: []
      });
    } catch (error) {
      console.error("Error adding monitor:", error);
    }
  };

  const handleDelete = async (monitorId) => {
    if (!confirm("Are you sure you want to delete this monitor?")) return;

    try {
      const response = await fetch(`/api/monitors/${monitorId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete monitor");
      await fetchMonitors();
    } catch (error) {
      console.error("Error deleting monitor:", error);
    }
  };

  const filteredMonitors = monitors.filter((monitor) =>
    monitor[searchField]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Monitor Management</h1>
          <div className="flex gap-2">
            <button
              className="bg-teal-600 p-2 rounded"
              onClick={() => alert("Import functionality to be implemented")}
            >
              Import Monitors
            </button>
            <button
              className="bg-teal-600 p-2 rounded"
              onClick={() => alert("Import functionality to be implemented")}
            >
              Export Monitors List
            </button>
          </div>
        </div>

        <section className="bg-gray-800 p-4 rounded mt-4">
          <h2 className="text-xl mb-2">Select Team</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* {teams?.map((team) => (
              <button
                key={team._id}
                onClick={() => handleTeamSelect(team)}
                className={`p-3 rounded-lg ${
                  selectedTeam === team._id ? "bg-teal-600" : "bg-gray-700"
                }`}
              >
                {team.name}
              </button>
            ))} */}
          </div>
        </section>

        <section className="bg-gray-800 p-4 rounded mt-4">
          <h3 className="text-xl mb-2">Add Monitor</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="prRequester"
              value={formData.prRequester}
              onChange={handleInputChange}
              placeholder="PR Requester"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              placeholder="Manufacturer"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Model"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <input
              type="text"
              name="prNumber"
              value={formData.prNumber}
              onChange={handleInputChange}
              placeholder="PR Number"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleInputChange}
              placeholder="PO Number"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleInputChange}
              placeholder="Serial Number"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="p-2 w-full bg-gray-700 mb-5"
              required
            >
              <option value="">Select Status</option>
              <option value="Near admin">Near admin</option>
              <option value="MIS Store">MIS Store</option>
              <option value="Home">Home</option>
            </select>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="p-2 w-full bg-gray-700 mb-5"
              required
            />
            <button type="submit" className="mt-2 bg-teal-600 p-2 rounded">
              Add Monitor
            </button>
          </form>
        </section>

        {selectedTeam && (
          <section className="bg-gray-800 p-4 rounded mt-4">
            <h3 className="text-xl">Monitors in {selectedTeam}</h3>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full bg-gray-700"
            />
            {filteredMonitors.length > 0 ? (
              <table className="w-full mt-4">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Model</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonitors.map((monitor) => (
                    <tr key={monitor._id} className="border-t border-gray-700">
                      <td className="p-3">{monitor.model}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(monitor._id)}
                          className="bg-red-600 p-2 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 mt-2">No monitors found.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default Page;
