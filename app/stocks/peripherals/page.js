// app/stocks/peripherals/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Filter, RefreshCw, Download, Upload, Trash, Edit, Minus } from "lucide-react";
// Import icons from react-icons/hi2 instead of hi to avoid the error
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { BsHeadphones } from 'react-icons/bs';
import { FiCamera } from 'react-icons/fi';
import { BsKeyboard } from 'react-icons/bs';
import { BsMouse } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

export default function PeripheralsPage() {
  const [peripherals, setPeripherals] = useState([]);
  const [filteredPeripherals, setFilteredPeripherals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPeripheral, setSelectedPeripheral] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState({ status: "", message: "" });
  const fileInputRef = useRef(null);
  const [exportFormat, setExportFormat] = useState("json");
  const [importFormat, setImportFormat] = useState("json");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Form states for adding/updating peripherals
  const [formData, setFormData] = useState({
    type: "keyboard",
    name: "",
    count: 0,
    notes: "",
    action: "add"
  });
  
  const router = useRouter();
  
  useEffect(() => {
    fetchPeripherals();
  }, []);
  
  useEffect(() => {
    if (peripherals.length > 0) {
      filterPeripherals();
    }
  }, [peripherals, searchTerm, selectedType]);
  
  const fetchPeripherals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/peripherals');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setPeripherals(data);
      setFilteredPeripherals(data);
    } catch (error) {
      console.error("Error fetching peripherals:", error);
      setError("Error fetching peripherals: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const filterPeripherals = () => {
    let filtered = [...peripherals];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(peripheral => 
        peripheral.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(peripheral => peripheral.type === selectedType);
    }
    
    setFilteredPeripherals(filtered);
  };
  
  const handleAddPeripheral = async (e) => {
    e.preventDefault();

    try {
      // Get current user
      let username = "Unknown User";
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          username = userData.siemensId || userData.email || userData.name || "Unknown User";
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      const response = await fetch('/api/peripherals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          name: formData.name,
          count: parseInt(formData.count) || 0,
          performedBy: username,
          notes: formData.notes || "Initial inventory"
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      // Reset form and close modal
      setFormData({
        type: "keyboard",
        name: "",
        count: 0,
        notes: "",
        action: "add"
      });
      setShowAddModal(false);
      
      // Refresh peripherals list
      fetchPeripherals();
      
    } catch (error) {
      console.error("Error adding peripheral:", error);
      setError("Error adding peripheral: " + error.message);
    }
  };
  
  const handleUpdatePeripheral = async (e) => {
    e.preventDefault();

    if (!selectedPeripheral) return;

    try {
      // Get current user
      let username = "Unknown User";
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          username = userData.siemensId || userData.email || userData.name || "Unknown User";
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      let newCount = selectedPeripheral.count;
      const quantity = parseInt(formData.count) || 0;
      
      if (formData.action === "add") {
        newCount += quantity;
      } else {
        newCount = Math.max(0, newCount - quantity);
      }
      
      const response = await fetch('/api/peripherals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPeripheral._id,
          count: newCount,
          performedBy: username,
          notes: formData.notes || `${formData.action === "add" ? "Added" : "Removed"} ${quantity} items`
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      // Reset form and close modal
      setFormData({
        type: "keyboard",
        name: "",
        count: 0,
        notes: "",
        action: "add"
      });
      setShowUpdateModal(false);
      setSelectedPeripheral(null);
      
      // Refresh peripherals list
      fetchPeripherals();
      
    } catch (error) {
      console.error("Error updating peripheral:", error);
      setError("Error updating peripheral: " + error.message);
    }
  };
  
  const handleDeletePeripheral = async (id) => {
    if (!confirm("Are you sure you want to delete this peripheral? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/peripherals?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      // Refresh peripherals list
      fetchPeripherals();
      
    } catch (error) {
      console.error("Error deleting peripheral:", error);
      setError("Error deleting peripheral: " + error.message);
    }
  };
  
  const handleShowHistory = async (peripheral) => {
    setSelectedPeripheral(peripheral);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      const response = await fetch(`/api/peripherals/history?peripheralId=${peripheral._id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      setError("Error fetching history: " + error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Function to convert JSON to CSV
  const convertToCSV = (data) => {
    if (data.length === 0) return '';

    // Extract headers from first object
    const headers = Object.keys(data[0]).filter(key => 
      // Filter out complex objects, keep only simple values
      typeof data[0][key] !== 'object' || data[0][key] === null
    );

    // Create CSV header row
    let csvRows = [headers.join(',')];

    // Add data rows
    for (const item of data) {
      const values = headers.map(header => {
        const value = item[header];
        // Handle special characters and ensure proper CSV format
        const valueStr = value === null || value === undefined ? '' : String(value);
        return `"${valueStr.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  // Function to parse CSV to JSON
  const parseCSV = (csvText) => {
    // Split by line
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    // Get headers from first line and clean them
    const headers = lines[0].split(',').map(header => 
      header.trim().replace(/^"(.*)"$/, '$1')
    );

    // Parse data rows
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV values properly (considering quoted values with commas)
      let values = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuote && j < line.length - 1 && line[j+1] === '"') {
            // Double quotes inside quoted value
            currentValue += '"';
            j++; // Skip next quote
          } else {
            // Toggle quote state
            inQuote = !inQuote;
          }
        } else if (char === ',' && !inQuote) {
          // End of value
          values.push(currentValue);
          currentValue = '';
        } else {
          // Regular character
          currentValue += char;
        }
      }
      
      // Don't forget the last value
      values.push(currentValue);
      
      // Create object
      const obj = {};
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes
        
        // Try to determine the type
        if (!isNaN(value) && value.trim() !== '') {
          // It's a number
          obj[header] = Number(value);
        } else if (value === 'true') {
          obj[header] = true;
        } else if (value === 'false') {
          obj[header] = false;
        } else {
          // It's a string or empty
          obj[header] = value || '';
        }
      });
      
      result.push(obj);
    }
    
    return result;
  };
  
  const handleExport = () => {
    try {
      setImportProgress({ status: "loading", message: `Preparing ${exportFormat.toUpperCase()} export...` });
      
      let fileData, fileType, fileName;
      
      if (exportFormat === 'json') {
        // Prepare JSON data
        fileData = JSON.stringify(filteredPeripherals, null, 2);
        fileType = 'application/json';
        fileName = `peripherals-export-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Prepare CSV data
        const csvData = convertToCSV(filteredPeripherals.map(p => ({
          type: p.type,
          name: p.name,
          count: p.count,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })));
        fileData = csvData;
        fileType = 'text/csv';
        fileName = `peripherals-export-${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      // Create blob and download
      const blob = new Blob([fileData], { type: fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setImportProgress({ status: "success", message: `${exportFormat.toUpperCase()} export complete! File download started.` });
      setTimeout(() => {
        setImportProgress({ status: "", message: "" });
        setExportModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error(`Error exporting peripherals as ${exportFormat}:`, error);
      setImportProgress({ status: "error", message: `Export failed: ${error.message}` });
    }
  };
  
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
      // Auto-detect format based on file extension
      if (file.name.toLowerCase().endsWith('.csv')) {
        setImportFormat('csv');
      } else {
        setImportFormat('json');
      }
    }
  };
  
  const handleImport = async () => {
    if (!importFile) {
      setImportProgress({ status: "error", message: "Please select a file to import" });
      return;
    }
    
    setImportProgress({ status: "loading", message: `Importing ${importFormat.toUpperCase()} data...` });
    
    try {
      // Get current user
      let username = "Unknown User";
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          username = userData.siemensId || userData.email || userData.name || "Unknown User";
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          let importedPeripherals;
          
          if (importFormat === 'json') {
            // Parse JSON data
            importedPeripherals = JSON.parse(e.target.result);
          } else {
            // Parse CSV data
            importedPeripherals = parseCSV(e.target.result);
          }
          
          if (!Array.isArray(importedPeripherals)) {
            throw new Error("Invalid data format. Expected an array of peripherals.");
          }
          
          let created = 0;
          let updated = 0;
          let errors = [];
          
          // Process each peripheral
          for (const peripheral of importedPeripherals) {
            try {
              // Ensure the peripheral has required fields
              if (!peripheral.type || !peripheral.name) {
                throw new Error("Missing required fields (type or name)");
              }
              
              // Check if peripheral exists
              const existingPeripherals = await fetch('/api/peripherals');
              const existingData = await existingPeripherals.json();
              const existing = existingData.find(p => 
                p.type === peripheral.type && p.name === peripheral.name
              );
              
              if (existing) {
                // Update existing peripheral
                const response = await fetch('/api/peripherals', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: existing._id,
                    count: peripheral.count || 0,
                    performedBy: username,
                    notes: "Updated via import"
                  }),
                });
                
                if (response.ok) {
                  updated++;
                } else {
                  const errorData = await response.json();
                  throw new Error(errorData.error || `Failed with status: ${response.status}`);
                }
              } else {
                // Create new peripheral
                const response = await fetch('/api/peripherals', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    type: peripheral.type,
                    name: peripheral.name,
                    count: peripheral.count || 0,
                    performedBy: username,
                    notes: "Created via import"
                  }),
                });
                
                if (response.ok) {
                  created++;
                } else {
                  const errorData = await response.json();
                  throw new Error(errorData.error || `Failed with status: ${response.status}`);
                }
              }
            } catch (error) {
              console.error(`Error processing peripheral ${peripheral.name}:`, error);
              errors.push(`${peripheral.name}: ${error.message}`);
            }
          }
          
          setImportProgress({ 
            status: "success", 
            message: `Import successful: ${created} created, ${updated} updated${
              errors.length > 0 ? `, ${errors.length} errors` : ''
            }` 
          });
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setImportFile(null);
          
          // Refresh the peripherals list
          fetchPeripherals();
          
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
      console.error("Error importing peripherals:", error);
      setImportProgress({ status: "error", message: "Import failed: " + error.message });
    }
  };
  
  const getPeripheralIcon = (type) => {
    switch (type) {
      case 'keyboard':
        return <BsKeyboard className="text-blue-400 w-6 h-6" />;
      case 'mouse':
        return <BsMouse className="text-green-400 w-6 h-6" />;
      case 'headset':
        return <BsHeadphones className="text-yellow-400 w-6 h-6" />;
      case 'webcam':
        return <FiCamera className="text-purple-400 w-6 h-6" />;
      default:
        return <BsThreeDots className="text-gray-400 w-6 h-6" />;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Peripherals Inventory</h1>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-2" /> Add New
          </button>
          
          <button 
            onClick={() => setExportModalOpen(true)}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search peripherals..."
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white"
            >
              <option value="">All Types</option>
              <option value="keyboard">Keyboards</option>
              <option value="mouse">Mice</option>
              <option value="headset">Headsets</option>
              <option value="webcam">Webcams</option>
              <option value="other">Other</option>
            </select>
            
            <button 
              onClick={fetchPeripherals}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex items-center"
            >
              <RefreshCw size={18} className="mr-2" /> Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Peripherals List */}
      <div className="bg-gray-800 rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading peripherals...</p>
          </div>
        ) : filteredPeripherals.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 mb-4">No peripherals found. Try adjusting your filters or add a new peripheral.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded"
            >
              Add Peripheral
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4">Type</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Inventory Count</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeripherals.map((peripheral) => (
                  <tr key={peripheral._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-4 flex items-center">
                      {getPeripheralIcon(peripheral.type)}
                      <span className="ml-2 capitalize">{peripheral.type}</span>
                    </td>
                    <td className="p-4">{peripheral.name}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        peripheral.count > 10 ? 'text-green-400' : 
                        peripheral.count > 5 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {peripheral.count}
                      </span>
                    </td>
                    <td className="p-4">{new Date(peripheral.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedPeripheral(peripheral);
                          setShowUpdateModal(true);
                          setFormData(prev => ({...prev, action: "add"}));
                        }}
                        className="bg-green-600 hover:bg-green-700 p-1 rounded text-white"
                        title="Add inventory"
                      >
                        <Plus size={16} />
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedPeripheral(peripheral);
                          setShowUpdateModal(true);
                          setFormData(prev => ({...prev, action: "remove"}));
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-white"
                        title="Remove inventory"
                        disabled={peripheral.count === 0}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleShowHistory(peripheral)}
                        className="bg-blue-600 hover:bg-blue-700 p-1 rounded text-white"
                        title="View history"
                      >
                        <RefreshCw size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleDeletePeripheral(peripheral._id)}
                        className="bg-red-600 hover:bg-red-700 p-1 rounded text-white"
                        title="Delete peripheral"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Peripheral Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Peripheral</h2>
              
              <form onSubmit={handleAddPeripheral}>
                <div className="mb-4">
                  <label className="block mb-2">Type*</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  >
                    <option value="keyboard">Keyboard</option>
                    <option value="mouse">Mouse</option>
                    <option value="headset">Headset</option>
                    <option value="webcam">Webcam</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Name*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., Logitech MX Keys"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Initial Count</label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData({...formData, count: e.target.value})}
                    min="0"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Serial Number/ Note</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Serial number or other notes"
                    className="w-full p-2 rounded bg-gray-700 text-white h-24 resize-none"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded flex items-center"
                  >
                    <Plus size={18} className="mr-2" /> Add Peripheral
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Peripheral Modal */}
      {showUpdateModal && selectedPeripheral && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {formData.action === "add" ? "Add to" : "Remove from"} Inventory
              </h2>
              
              <div className="mb-4 flex items-center">
                <div className="mr-3">
                  {getPeripheralIcon(selectedPeripheral.type)}
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedPeripheral.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{selectedPeripheral.type}</p>
                </div>
              </div>
              
              <div className="mb-4 p-3 bg-gray-700 rounded">
                <p className="text-sm text-gray-400">Current Inventory</p>
                <p className="text-lg font-bold">{selectedPeripheral.count} units</p>
              </div>
              
              <form onSubmit={handleUpdatePeripheral}>
                <div className="mb-4">
                  <label className="block mb-2">
                    {formData.action === "add" ? "Add Quantity*" : "Remove Quantity*"}
                  </label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData({...formData, count: e.target.value})}
                    required
                    min="1"
                    max={formData.action === "remove" ? selectedPeripheral.count : undefined}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Reason for this inventory update"
                    className="w-full p-2 rounded bg-gray-700 text-white h-24 resize-none"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedPeripheral(null);
                      setFormData({
                        type: "keyboard",
                        name: "",
                        count: 0,
                        notes: "",
                        action: "add"
                      });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded flex items-center ${
                      formData.action === "add" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    {formData.action === "add" ? (
                      <>
                        <Plus size={18} className="mr-2" /> Add to Inventory
                      </>
                    ) : (
                      <>
                        <Minus size={18} className="mr-2" /> Remove from Inventory
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* History Modal */}
      {showHistoryModal && selectedPeripheral && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3">
                    {getPeripheralIcon(selectedPeripheral.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPeripheral.name} - History</h2>
                    <p className="text-sm text-gray-400 capitalize">{selectedPeripheral.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowHistoryModal(false);
                    setSelectedPeripheral(null);
                    setHistory([]);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              {historyLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-6 w-6 border-3 border-teal-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p>Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center p-8 text-gray-400">
                  <p>No history available for this peripheral.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                  
                  {history.map((entry) => (
                    <div key={entry._id} className="mb-6 ml-10 relative">
                      <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                      
                      <div className="bg-gray-700 p-4 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`text-sm px-2 py-0.5 rounded ${
                              entry.action === 'add' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {entry.action === 'add' ? 'Added' : 'Removed'}
                            </span>
                            <span className="ml-2 font-bold">{entry.quantity} {entry.quantity === 1 ? 'item' : 'items'}</span>
                          </div>
                          
                          <span className="text-sm text-gray-400">
                            {new Date(entry.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="text-sm flex gap-4 mb-2">
                          <div>
                            <span className="text-gray-400">Previous Count:</span> {entry.previousCount}
                          </div>
                          <div>
                            <span className="text-gray-400">New Count:</span> {entry.newCount}
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div className="text-sm mt-2 p-2 bg-gray-800 rounded">
                            {entry.notes}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-2">
                          Updated by: {entry.performedBy || (typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("user") || "{}").siemensId || "Unknown User") : "Unknown User")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Export Peripherals</h2>
              
              <p className="mb-4 text-gray-300">
                Choose a format to export your peripherals data.
              </p>
              
              <div className="mb-6">
                <label className="block mb-2">Export Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                      className="mr-2"
                    />
                    JSON
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="mr-2"
                    />
                    CSV
                  </label>
                </div>
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
                  onClick={() => setExportModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center"
                >
                  <Download size={18} className="mr-2" /> Export as {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Import Peripherals</h2>
              
              <p className="mb-4 text-gray-300">
                Upload a file containing peripherals data.
              </p>
              
              <div className="mb-4">
                <label className="block mb-2">Select File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleImportFileChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: JSON, CSV
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2">File Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importFormat"
                      value="json"
                      checked={importFormat === 'json'}
                      onChange={() => setImportFormat('json')}
                      className="mr-2"
                    />
                    JSON
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importFormat"
                      value="csv"
                      checked={importFormat === 'csv'}
                      onChange={() => setImportFormat('csv')}
                      className="mr-2"
                    />
                    CSV
                  </label>
                </div>
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