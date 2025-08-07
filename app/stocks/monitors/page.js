"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Filter, RefreshCw, Download, Upload } from "lucide-react";

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    team: "",
    status: "",
    serialNumber: "",
    manufacturer: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState({ status: "", message: "" });
  const fileInputRef = useRef(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Initialize filters from URL if present
    const teamParam = searchParams.get('team');
    const statusParam = searchParams.get('status');
    
    if (teamParam || statusParam) {
      setFilters(prev => ({
        ...prev,
        team: teamParam || "",
        status: statusParam || ""
      }));
    }
    
    // Load initial data
    fetchMonitors();
    fetchTeams();
  }, [searchParams]);
  
  const fetchMonitors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.team) queryParams.append('team', filters.team);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.serialNumber) queryParams.append('serialNumber', filters.serialNumber);
      if (filters.manufacturer) queryParams.append('manufacturer', filters.manufacturer);
      
      const response = await fetch(`/api/monitors?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setMonitors(data.data || []);
    } catch (error) {
      console.error("Error fetching monitors:", error);
      setError("Error fetching monitors: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    fetchMonitors();
    
    // Update URL with filters for shareable links
    const queryParams = new URLSearchParams();
    if (filters.team) queryParams.append('team', filters.team);
    if (filters.status) queryParams.append('status', filters.status);
    
    router.push(`/stocks/monitors?${queryParams.toString()}`, { scroll: false });
  };
  
  const resetFilters = () => {
    setFilters({
      team: "",
      status: "",
      serialNumber: "",
      manufacturer: ""
    });
    router.push('/stocks/monitors', { scroll: false });
    fetchMonitors();
  };
  
  const handleExport = async () => {
    try {
      setImportProgress({ status: "loading", message: "Preparing export..." });
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.team) queryParams.append('team', filters.team);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.manufacturer) queryParams.append('manufacturer', filters.manufacturer);
      
      // Create a download link and simulate click
      const link = document.createElement('a');
      link.href = `/api/monitors/export?${queryParams.toString()}`;
      link.download = `monitors-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setImportProgress({ status: "success", message: "Export complete! File download started." });
      setTimeout(() => {
        setImportProgress({ status: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error exporting monitors:", error);
      setImportProgress({ status: "error", message: "Export failed: " + error.message });
    }
  };
  
  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };
  
  const handleImport = async () => {
    if (!importFile) {
      setImportProgress({ status: "error", message: "Please select a file to import" });
      return;
    }
    
    setImportProgress({ status: "loading", message: "Importing data..." });
    
    try {
      // Get current user
      let username = "Unknown User";
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          username = userData.email || userData.name || "Unknown User";
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const monitors = JSON.parse(e.target.result);
          
          const response = await fetch('/api/monitors/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              monitors,
              username
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed with status: ${response.status}`);
          }
          
          const result = await response.json();
          setImportProgress({ 
            status: "success", 
            message: `Import successful: ${result.results.created} created, ${result.results.updated} updated${
              result.results.errors.length > 0 ? `, ${result.results.errors.length} errors` : ''
            }` 
          });
          
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setImportFile(null);
          
          // Refresh the monitors list
          fetchMonitors();
          
          // Close modal after delay
          setTimeout(() => {
            setImportModalOpen(false);
            setImportProgress({ status: "", message: "" });
          }, 3000);
        } catch (error) {
          console.error("Error processing import data:", error);
          setImportProgress({ status: "error", message: "Import failed: " + error.message });
        }
      };
      
      reader.readAsText(importFile);
    } catch (error) {
      console.error("Error importing monitors:", error);
      setImportProgress({ status: "error", message: "Import failed: " + error.message });
    }
  };
  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/stocks')}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center mr-4"
        >
          {/* You can use an icon here if you want */}
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold">Monitor Management</h1>
        <div className="flex gap-2">
          <Link href="/stocks/monitors/add">
            <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg flex items-center">
              <Plus size={18} className="mr-2" /> Add New Monitor
            </button>
          </Link>
          <button 
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
          >
            <Download size={18} className="mr-2" /> Export
          </button>
          <button 
            onClick={() => setImportModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center"
          >
            <Upload size={18} className="mr-2" /> Import
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="serialNumber"
              value={filters.serialNumber}
              onChange={handleFilterChange}
              placeholder="Search by serial number..."
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center"
            >
              <Filter size={18} className="mr-2" /> Filters
            </button>
            
            <button 
              onClick={fetchMonitors}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex items-center"
            >
              <RefreshCw size={18} className="mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Team</label>
              <select 
                name="team" 
                value={filters.team} 
                onChange={handleFilterChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Status</label>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="">All Statuses</option>
                <option value="inpool">Inpool</option>
                <option value="deployed">Deployed</option>
                
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Manufacturer</label>
              <input 
                type="text" 
                name="manufacturer" 
                value={filters.manufacturer} 
                onChange={handleFilterChange}
                placeholder="Search by manufacturer"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            
            <div className="md:col-span-3 flex justify-end space-x-2">
              <button 
                onClick={resetFilters}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Reset
              </button>
              <button 
                onClick={applyFilters}
                className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Monitors List */}
      <div className="bg-gray-800 rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading monitors...</p>
          </div>
        ) : monitors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 mb-4">No monitors found. Try adjusting your filters or add a new monitor.</p>
            <Link href="/stocks/monitors/add">
              <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded">
                Add Monitor
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4">Serial Number</th>
                  <th className="p-4">Manufacturer</th>
                  <th className="p-4">Model</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Issued To</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitors.map((monitor) => (
                  <tr key={monitor._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-4">{monitor.serialNumber}</td>
                    <td className="p-4">{monitor.manufacturer}</td>
                    <td className="p-4">{monitor.model}</td>
                    <td className="p-4">{monitor.team?.name || "N/A"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(monitor.status)}`}>
                        {monitor.status}
                      </span>
                    </td>
                    <td className="p-4">{monitor.issueTo || "N/A"}</td>
                    <td className="p-4">
                      <Link href={`/stocks/monitors/${monitor._id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm mr-2">
                          View / Update
                        </button>
                      </Link>
                      {/* <Link href={`/stocks/monitors/edit/${monitor._id}`}>
                        <button className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded text-sm">
                          Edit
                        </button>
                      </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Import Modal - Moved outside the conditional rendering of monitors list */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Import Monitors</h2>
              
              <p className="mb-4 text-gray-300">
                Upload a JSON file containing monitor data. The file should contain an array of monitor objects.
              </p>
              
              <div className="mb-4">
                <label className="block mb-2">Select JSON File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportFileChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              
              {importProgress.message && (
                <div className={`mb-4 p-3 rounded ${
                  importProgress.status === "loading" ? "bg-blue-900 text-blue-300" :
                  importProgress.status === "success" ? "bg-green-900 text-green-300" :
                  importProgress.status === "error" ? "bg-red-900 text-red-300" : ""
                }`}>
                  {importProgress.status === "loading" && (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      {importProgress.message}
                    </div>
                  )}
                  {importProgress.status !== "loading" && importProgress.message}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importProgress.status === "loading"}
                  className={`px-4 py-2 rounded flex items-center ${
                    !importFile || importProgress.status === "loading" 
                      ? "bg-gray-500 cursor-not-allowed" 
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {importProgress.status === "loading" ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" /> Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'checkIn':
      return 'bg-green-900 text-green-300';
    case 'checkOut':
      return 'bg-blue-900 text-blue-300';
    case 'inRepair':
      return 'bg-yellow-900 text-yellow-300';
    case 'disposed':
      return 'bg-red-900 text-red-300';
    default:
      return 'bg-gray-900 text-gray-300';
  }
};