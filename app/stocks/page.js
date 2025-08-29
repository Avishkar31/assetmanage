"use client";
import Link from "next/link";
import Sidebar from "components/Sidebar";
import DynamicSegmentChart from "@/components/DynamicSegmentChart";
import ManufacturerPieChart from "components/ManufacturerPieChart";

import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { FiDownload, FiPieChart, FiBarChart2 } from "react-icons/fi";
import { BiCube, BiDevices } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import withAuth from "hooks/withAuth";
import { exportAssets } from "utils/assetExport";
import { toast } from "react-hot-toast";

function Page() {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const reportsRef = useRef(null);
  const [assetCounts, setAssetCounts] = useState({
    all: 0,
    MISStock: 0,
    newPurchase: 0,
    inactive: 0,
    deployed: 0,
    todaysDeployed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [manufacturers, setManufacturers] = useState([]);
  const [chartKey, setChartKey] = useState(0);

  // Keep only one instance of each function
  const toggleDropdown = (setter) => {
    setter((prev) => !prev);
  };

  const handleClickOutside = (ref, setter) => (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setter(false);
    }
  };

  const handleExtractData = async (type) => {
    setIsExtracting(true);
    setIsReportsOpen(false);

    try {
      await exportAssets(type);
      toast.success(`${type} data exported successfully!`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error(`Failed to export ${type} data: ${err.message}`);
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const getMisStoreTotal = () => {
    try {
      return assetCounts.MISStock + assetCounts.newPurchase;
    } catch (err) {
      console.error("Error calculating MIS Store total:", err);
      return 0;
    }
  };

  useEffect(() => {
    if (isReportsOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside(reportsRef, setIsReportsOpen)
      );
    };
  }, [isReportsOpen]);

  useEffect(() => {
    async function fetchAssetData() {
      try {
        const url = selectedStatus
          ? `/api/asset/getAnalytics?status=${selectedStatus}`
          : "/api/asset/getAnalytics";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch asset data");
        }
        const data = await response.json();

        // Update all counts
        setAssetCounts({
          all: data.allAssetsCount || 0,
          MISStock: data.MISStockCount || 0,
          newPurchase: data.newPurchaseCount || 0,
          inactive: data.inactiveCount || 0,
          deployed: data.deployedCount || 0,
          todaysDeployed: data.todaysDeployedCount || 0
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssetData();
  }, [selectedStatus]);


  useEffect(() => {
    async function fetchManufacturersData() {
      try {
        const response = await fetch("/api/Manufacturer");

        if (!response.ok) {
          throw new Error("Failed to fetch manufacturers data");
        }

        const data = await response.json();
        setManufacturers(data.data || []);
        setChartKey(prevKey => prevKey + 1); // Force chart re-render when data changes
      } catch (err) {
        console.error("Error fetching manufacturers:", err);
        // Don't need to set error state here to avoid affecting the whole dashboard
      }
    }

    fetchManufacturersData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="bg-red-900/30 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const now = new Date();

  // Count assets checked out today
  const todaysDeployed = assetCounts.todaysDeployed || 0;

  // Calculate percentages
  const totalActiveAssets = assetCounts.MISStock + assetCounts.deployed;
  const MISStockPercentage = totalActiveAssets > 0 ? ((assetCounts.MISStock / totalActiveAssets) * 100).toFixed(1) : 0;
  const deployedPercentage = totalActiveAssets > 0 ? ((assetCounts.deployed / totalActiveAssets) * 100).toFixed(1) : 0;

  return (
    <main>
      {isExtracting && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-8 rounded-lg text-white text-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-lg">Extracting data, please wait...</p>
          </div>
        </div>
      )}
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">OVERVIEW</h1>
              <p className="text-gray-400">Welcome to the asset management dashboard</p>
            </div>
            <div className="flex items-center">
              <div className="relative" ref={reportsRef}>
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                  onClick={() => toggleDropdown(setIsReportsOpen)}
                >
                  <HiOutlineDocumentReport className="mr-2" size={18} />
                  Reports
                  <span className="ml-2">
                    {isReportsOpen ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </span>
                </button>
                {isReportsOpen && (
                  <ul className="absolute bg-gray-800 rounded-lg p-2 mt-2 right-0 w-64 top-full flex flex-col shadow-xl border border-gray-700 z-10">
                    <li className="my-1">
                      <button
                        onClick={() => handleExtractData("AllAsset")}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <FiDownload className="mr-2" size={16} />
                        Extract All Assets
                      </button>
                    </li>
                    <li className="my-1">
                      <button
                        onClick={() => handleExtractData("MISStock")}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <FiDownload className="mr-2" size={16} />
                        Extract MISStock Assets
                      </button>
                    </li>
                    <li className="my-1">
                      <button
                        onClick={() => handleExtractData("New Purchase")}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <FiDownload className="mr-2" size={16} />
                        Extract New Purchase
                      </button>
                    </li>
                    <li className="my-1">
                      <button
                        onClick={() => handleExtractData("Deployed")}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <FiDownload className="mr-2" size={16} />
                        Extract Deployed Assets
                      </button>
                    </li>
                    <li className="my-1">
                      <button
                        onClick={() => handleExtractData("TodaysAllocation")}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <FiDownload className="mr-2" size={16} />
                        Today's Hardware Allocation
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </header>

          {/* Asset Count Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Link
              href="./stocks/allasset"
              className="block bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 group-hover:text-white">Total</h3>
                  <p className="text-3xl font-bold mt-1 text-white">
                    {getMisStoreTotal().toLocaleString()}
                  </p>
                  {/* <span className="text-gray-400 text-sm">MISStock + New Purchase</span> */}
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <BiDevices className="text-blue-400 text-2xl" />
                </div>
              </div>
            </Link>

            <Link
              href="./stocks/allasset?status=MISStock"
              className="block bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-400 group-hover:text-green-300">MIS Stock</h3>
                  <p className="text-3xl font-bold mt-1 text-white">{assetCounts.MISStock.toLocaleString()}</p>
                  <span className="text-gray-400 text-sm">Ready For Allocation</span>
                </div>

                <div className="bg-green-500/20 p-3 rounded-full">
                  <BiCube className="text-green-400 text-2xl" />
                </div>
              </div>
            </Link>

            <Link
              href="./stocks/allasset?status=New Purchase"
              className="block bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-yellow-400 group-hover:text-yellow-300">New Purchase</h3>
                  <p className="text-3xl font-bold mt-1 text-white">{assetCounts.newPurchase.toLocaleString()}</p>
                  <span className="text-gray-400 text-sm">Not Deployed</span>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <FiBarChart2 className="text-yellow-400 text-2xl" />
                </div>
              </div>
            </Link>
          </div>

          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            

            <Link
              href="./stocks/allasset?status=deployed&date=today"
              className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-800 hover:border-gray-700 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-teal-400 group-hover:text-teal-300">
                    Today's Hardware Allocation
                  </h3>
                  <p className="text-3xl font-bold mt-1 text-white">
                    {todaysDeployed.toLocaleString()}
                  </p>
                  <span className="text-teal-500 text-sm">Last 24 hours</span>
                </div>
                <div className="bg-teal-500/20 p-3 rounded-full">
                  <FiPieChart className="text-teal-400 text-2xl" />
                </div>
              </div>
            </Link>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4 text-gray-200">Manufacturer Distribution</h2>
              <div className="w-full h-96">
                {/* Pass manufacturers data to the chart */}
                <ManufacturerPieChart
                  key={chartKey}
                  manufacturers={manufacturers}
                />
              </div>
              {manufacturers.length === 0 && !loading && (
                <p className="text-center text-gray-400 mt-4">No manufacturer data available</p>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Page);