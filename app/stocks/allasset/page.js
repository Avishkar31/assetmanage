"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import AssetTable from "components/table/AssetTable";
import Sidebar from "components/Sidebar";
import Link from "next/link";

export default function AllAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const status = searchParams.get("status"); // Extract status from URL search params

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true); // Ensure loading state is set when fetching
      try {
        const queryParam = status ? `?status=${status}` : ""; // Add status query if available
        const res = await fetch(`/api/asset/getAll${queryParam}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch assets");
        }
        const tblData = await res.json();
        setAssets(tblData.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssets(); // Fetch assets whenever the status changes
  }, [status]); // Re-fetch when status changes

  if (loading) return <p>Loading assets...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
  <Sidebar />
  <div className="flex-1 p-4 md:p-6 overflow-hidden">
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">All Assets</h1>
       
      </div>
      <Link href="/stocks/addasset">
        <button className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 text-white rounded-lg border border-teal-500/30 hover:bg-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Asset
        </button>
      </Link>
    </header>

    {/* Card container with internal scroll */}
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="overflow-x-auto">
        <AssetTable assetData={assets} filterStatus={status || ""} />
      </div>
    </div>
  </div>
</div>
  );
}