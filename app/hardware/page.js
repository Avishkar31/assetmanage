"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import AssetTable from "components/table/AssetTable";

export default function HardwareAllocation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/hardware/search?query=${searchQuery}&status=${filterStatus}`);
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error("Error searching hardware:", error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-6">Hardware Allocation Search</h1>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by serial number, asset tag, or employee ID..."
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-teal-500"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-teal-600 rounded flex items-center gap-2 hover:bg-teal-700 transition-colors"
          >
            <FaSearch />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full">
        {assets.length > 0 ? (
          <AssetTable assetData={assets} filterStatus={filterStatus} />
        ) : searchQuery && !loading ? (
          <div className="text-center text-gray-400 py-8">
            No results found for your search
          </div>
        ) : null}
      </div>
    </div>
  );
}

