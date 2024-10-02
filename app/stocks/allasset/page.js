"use client";
import React, { useEffect, useState } from "react";
import AssetTable from "@/components/table/AssetTable";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function AllAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch(`/api/asset/getAll`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
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
    fetchAssets();
  }, []);

  if (loading) return <p>Loading assets...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  console.log("assets", assets);
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-5 bg-gray-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
          <h1 className="text-2xl text-white mb-4 md:mb-0">All Assets</h1>
          <Link href="/stocks/addasset">
            <button className="w-full md:w-28 h-10 bg-teal-600 text-white rounded-lg border-none cursor-pointer hover:bg-teal-700 transition duration-300">
              Add Asset
            </button>
          </Link>
        </header>

        <div className="bg-gray-800 p-3 rounded-lg">
          {/* Set the table container to full width, but ensure no horizontal overflow */}
          <div className="w-full md:w-1/2 overflow-x-auto">
            <AssetTable assetData={assets} />
          </div>
        </div>
      </div>
    </div>
  );
}
