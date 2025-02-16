"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "components/Sidebar";

function Page() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [monitors, setMonitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("model"); // default search field
  const [formData, setFormData] = useState({
    model: "",
    serialNumber: "", 
    poNumber: ""
  });

  const teams = [
    "Team 1",
    "Team 2", 
    "Team 3",
    "Team 4",
    "Team 5",
    "Team 6"
  ];

  useEffect(() => {
    if (selectedTeam) {
      fetchMonitors();
    }
  }, [selectedTeam]);

  const fetchMonitors = async () => {
    try {
      const response = await fetch(`/api/monitors?team=${selectedTeam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monitors');
      }
      const data = await response.json();
      setMonitors(data);
    } catch (error) {
      console.error("Error fetching monitors:", error);
      alert("Failed to load monitors");
    }
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    try {
      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          team: selectedTeam
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add monitor');
      }

      await fetchMonitors();

      setFormData({
        model: "",
        serialNumber: "",
        poNumber: ""
      });

    } catch (error) {
      console.error("Error adding monitor:", error);
      alert("Failed to add monitor");
    }
  };

  const handleDelete = async (monitorId) => {
    if (!window.confirm("Are you sure you want to remove this monitor?")) {
      return;
    }

    try {
      const response = await fetch(`/api/monitors/${monitorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete monitor');
      }

      await fetchMonitors();
    } catch (error) {
      console.error("Error deleting monitor:", error);
      alert("Failed to delete monitor");
    }
  };

  const filteredMonitors = monitors.filter(monitor => {
    const searchValue = monitor[searchField]?.toLowerCase() || '';
    return searchValue.includes(searchQuery.toLowerCase());
  });

  return (
    <main>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl">Monitor Review</h1>
              <p className="text-gray-400">Manage team monitors</p>
            </div>
          </header>

          <div className="flex gap-5">
            <section className="flex-1 bg-gray-800 p-4">
              <div>
                <h2 className="text-xl mb-2">Select Team</h2>
                <p className="text-gray-400 mb-4">Choose a team to manage their monitors</p>
                <div className="grid grid-cols-3 gap-4">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => handleTeamSelect(team)}
                      className={`p-3 rounded-lg text-left ${
                        selectedTeam === team 
                          ? "bg-teal-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex-1 bg-gray-800 p-4">
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl mb-2">
                  Add Monitor to {selectedTeam || "Selected Team"}
                </h3>
                <div className="mb-4">
                  <label htmlFor="model" className="block mb-1">
                    Model Name:
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="border border-gray-600 p-2 bg-gray-700 text-white w-full rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="serialNumber" className="block mb-1">
                    Serial Number:
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="border border-gray-600 p-2 bg-gray-700 text-white w-full rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="poNumber" className="block mb-1">
                    PO Number:
                  </label>
                  <input
                    type="text"
                    id="poNumber"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    className="border border-gray-600 p-2 bg-gray-700 text-white w-full rounded"
                    required
                  />
                </div>
                <div>
                  <button 
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    disabled={!selectedTeam}
                  >
                    Add Monitor
                  </button>
                </div>
              </form>
            </section>
          </div>

          {selectedTeam && (
            <section className="mt-5 bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl">Monitors in {selectedTeam}</h3>
                <div className="flex gap-2 items-center ml-auto">
                  <select 
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded p-2"
                  >
                    <option value="model">Model</option>
                    <option value="serialNumber">Serial Number</option>
                    <option value="poNumber">PO Number</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Search by ${searchField}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded p-2 w-64"
                  />
                </div>
              </div>
              
              {filteredMonitors.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Model Name</th>
                      <th className="p-3 text-left">Serial Number</th>
                      <th className="p-3 text-left">PO Number</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonitors.map((monitor) => (
                      <tr key={monitor._id} className="border-t border-gray-700">
                        <td className="p-3">{monitor.model}</td>
                        <td className="p-3">{monitor.serialNumber}</td>
                        <td className="p-3">{monitor.poNumber}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete(monitor._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">
                  {searchQuery ? "No matches found" : "No monitors found for this team"}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;
