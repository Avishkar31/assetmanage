"use client";
import React, { useEffect, useState } from "react";
import AssetTable from "@/components/table/AssetTable";

export default function AllAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/assets`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch assets");
        }
        const data = await res.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    // fetchAssets();
  }, []);

  // if (loading) return <p>Loading assets...</p>;
  // if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <AssetTable />
    </div>
  );
}
