// app/stocks/monitors/add/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddMonitorPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    prRequester: "",
    manufacturer: "",
    model: "",
    prNumber: "",
    poNumber: "",
    serialNumber: "",
    status: "inpool",
    updatedBy: "", // Changed from username to updatedBy for consistency
    team: "",
    issueTo: ""
  });
  
  const router = useRouter();
  
  useEffect(() => {
    fetchTeams();
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setFormData(prev => ({
          ...prev,
          updatedBy: userData?.siemensId || userData?.name || "Unknown User" // Changed from username to updatedBy
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          updatedBy: "Unknown User" // Changed from username to updatedBy
        }));
      }
    } catch (e) {
      console.error("Error accessing or parsing user data:", e);
      setFormData(prev => ({
        ...prev,
        updatedBy: "Unknown User" // Changed from username to updatedBy
      }));
    }
  }, []);
  
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate if deployed but no issueTo
    if (formData.status === "deployed" && !formData.issueTo) {
      setError("Recipient is required when status is set to Deployed");
      setLoading(false);
      return;
    }
    
    try {
      // Create properly structured request with updated history entry
      const requestBody = {
        ...formData,
        username: formData.updatedBy, // Keep username for backward compatibility
        // Create proper history entry with separate user and updatedBy fields
        assetHistory: {
          date: new Date(),
          user: formData.issueTo || null, // Recipient
          updatedBy: formData.updatedBy, // Person performing the action
          action: 'created',
          status: formData.status
        }
      };
      
      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add monitor");
      }
      
      router.push('/stocks/monitors');
    } catch (error) {
      console.error("Error adding monitor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="mb-6">
        <Link href="/stocks/monitors">
          <button className="flex items-center text-gray-400 hover:text-white">
            <ArrowLeft size={18} className="mr-2" /> Back to Monitors
          </button>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add New Monitor</h1>
      
      {error && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">PR Requester*</label>
            <input
              type="text"
              name="prRequester"
              value={formData.prRequester}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">Manufacturer*</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">Model*</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">PR Number*</label>
            <input
              type="text"
              name="prNumber"
              value={formData.prNumber}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">PO Number*</label>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">Serial Number*</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="block mb-2">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="inpool">In Pool</option>
              <option value="deployed">Deployed</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Team*</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>

          {(formData.status === "deployed" || formData.status === "inpool") && (
            <div>
              <label className="block mb-2">Issue To*</label>
              <input
                type="text"
                name="issueTo"
                value={formData.issueTo}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required={formData.status === "deployed"}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> Save Monitor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}