"use client";
import Link from "next/link";
import Sidebar from "components/Sidebar";
import SimpleRadialBarChart from "components/SimpleRadialBarChart";
import ManufacturerPieChart from "components/ManufacturerPieChart";
import StackedBarChart from "components/StackedBarChart";
import AssetTimeline from "components/AssetTimeline";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import withAuth from "hooks/withAuth";
import { exportAssets } from "utils/assetExport"; // Import the export utility

function Page() {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const reportsRef = useRef(null);
  const [allAssetsCount, setAllAssetsCount] = useState(null);
  const [inPoolCount, setInPoolCount] = useState(null);
  const [newPurchaseCount, setNewPurchaseCount] = useState(null);
  const [inactiveCount, setInactiveCount] = useState(null);
  const [deployedCount, setDeployedCount] = useState(null);
  const [todaysDeployedCount, setTodaysDeployedCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

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
      // Option 1: Use your existing exportAssets utility
      await exportAssets(type);

      // Option 2: Or implement the download logic directly here
      /*
    // Add query parameters based on the type selected
    let apiUrl = "/api/extract";

    // Map the UI type to the corresponding status parameter
    if (type !== "AllAsset") {
      const statusMapping = {
        Inpool: "inpool",
        NewPurchase: "new purchase",
        Deployed: "deployed",
        TodaysAllocation: "today"
      };

      // For TodaysAllocation, use a date parameter instead of status
      if (type === "TodaysAllocation") {
        const today = new Date();
        const formattedDate = `${today
          .getDate()
          .toString()
          .padStart(2, "0")}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getFullYear()}`;
        apiUrl = `${apiUrl}?checkOutDate=${formattedDate}`;
      } else {
        // For other types, use the status parameter
        apiUrl = `${apiUrl}?status=${statusMapping[type]}`;
      }
    }

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to extract data");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.toLowerCase()}_assets.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    */
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
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

        // Only update counts based on selected status
        if (!selectedStatus) {
          setAllAssetsCount(data.allAssetsCount);
          setInPoolCount(data.inPoolCount);
          setNewPurchaseCount(data.newPurchaseCount);
          setInactiveCount(data.inactiveCount);
          setDeployedCount(data.deployedCount);
          setTodaysDeployedCount(data.todaysDeployedCount);
        } else {
          // Reset all counts to 0 except selected status
          setAllAssetsCount(0);
          setInPoolCount(selectedStatus === "inpool" ? data.inPoolCount : 0);
          setNewPurchaseCount(
            selectedStatus === "newpurchase" ? data.newPurchaseCount : 0
          );
          setInactiveCount(0);
          setDeployedCount(
            selectedStatus === "deployed" ? data.deployedCount : 0
          );
          setTodaysDeployedCount(
            selectedStatus === "deployed" && data.todaysDeployedCount
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssetData();
  }, [selectedStatus]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const totalActiveAssets = inPoolCount + deployedCount;
  const inPoolPercentage = ((inPoolCount / totalActiveAssets) * 100).toFixed(2);
  const newPurchasePercentage = (
    (newPurchaseCount / totalActiveAssets) *
    100
  ).toFixed(2);
  const deployedPercentage = (
    (deployedCount / totalActiveAssets) *
    100
  ).toFixed(2);

  return (
    <main>
      {isExtracting && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-lg">Extracting data, please wait...</p>
          </div>
        </div>
      )}
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-5 overflow-y-auto">
          <header className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl">OVERVIEW</h1>
              <p className="text-gray-400">Welcome to store</p>
            </div>
            <div className="flex items-center">
              <div className={`relative flex items-center mr-5`}>
                <button className="text-white">
                  {/* Placeholder for search icon */}
                </button>
                {false && (
                  <>
                    <input
                      type="text"
                      className="border border-teal-500 p-1 rounded bg-gray-800 text-white ml-2"
                      placeholder="Search..."
                    />
                    <button className="text-white ml-2">✖</button>
                  </>
                )}
              </div>
              <div className="relative" ref={reportsRef}>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => toggleDropdown(setIsReportsOpen)}
                >
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
                  <ul className="absolute bg-gray-900 rounded-lg p-2 mt-2 right-1 w-56 top-full flex flex-col">
                    <li className="my-2">
                      <button
                        onClick={() => handleExtractData("AllAsset")}
                        className="w-full text-left text-gray-400 hover:text-white"
                      >
                        Extract All Asset
                      </button>
                    </li>
                    <li className="my-2">
                      <button
                        onClick={() => handleExtractData("Inpool")}
                        className="w-full text-left text-gray-400 hover:text-white"
                      >
                        Extract Inpool
                      </button>
                    </li>
                    <li className="my-2">
                      <button
                        onClick={() => handleExtractData("NewPurchase")}
                        className="w-full text-left text-gray-400 hover:text-white"
                      >
                        Extract New Purchase
                      </button>
                    </li>
                    <li className="my-2">
                      <button
                        onClick={() => handleExtractData("Deployed")}
                        className="w-full text-left text-gray-400 hover:text-white"
                      >
                        Extract Deployed
                      </button>
                    </li>
                    <li className="my-2">
                      <button
                        onClick={() => handleExtractData("TodaysAllocation")}
                        className="w-full text-left text-gray-400 hover:text-white"
                      >
                        Today's Hardware Allocation
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            <Link
              href="./stocks/allasset"
              passHref
              onClick={() => setSelectedStatus(null)}
            >
              <div className="block bg-gray-800 p-5 rounded-lg text-center text-gray-400 hover:text-white transition-colors">
                <h3 className="text-lg">All assets</h3>
                <p className="text-2xl">
                  {allAssetsCount !== null ? allAssetsCount : "N/A"}
                </p>
                <span className="text-teal-500">+12%</span>
              </div>
            </Link>
            <Link
              href="./stocks/allasset?status=inpool"
              passHref
              onClick={() => setSelectedStatus("inpool")}
            >
              <div className="block bg-gray-800 p-5 rounded-lg text-center text-gray-400 hover:text-white transition-colors">
                <h3 className="text-lg text-green-500 hover:text-green-400">
                  Inpool
                </h3>
                <p className="text-2xl">
                  {inPoolCount !== null ? inPoolCount.toLocaleString() : "N/A"}
                </p>
                <span className="text-teal-500">{inPoolPercentage}%</span>
              </div>
            </Link>
            <Link
              href="./stocks/allasset?status=newpurchase"
              passHref
              onClick={() => setSelectedStatus("newpurchase")}
            >
              <div className="bg-gray-800 p-5 rounded-lg text-center cursor-pointer hover:text-white">
                <h3 className="text-lg text-yellow-500">New purchase</h3>
                <p className="text-2xl">
                  {newPurchaseCount !== null ? newPurchaseCount : "N/A"}
                </p>
                <span className="text-teal-500">{newPurchasePercentage}%</span>
              </div>
            </Link>
          </div>
          <div className="flex justify-center gap-3 mt-5">
            <Link
              href="./stocks/allasset?status=deployed"
              passHref
              onClick={() => setSelectedStatus("deployed")}
            >
              <div className="bg-gray-800 p-5 rounded-lg text-center cursor-pointer hover:text-white w-64">
                <h3 className="text-lg text-purple-500">Deployed</h3>
                <p className="text-2xl">
                  {deployedCount !== null ? deployedCount : "N/A"}
                </p>
                <span className="text-teal-500">{deployedPercentage}%</span>
              </div>
            </Link>
            <Link
              href="./stocks/allasset?status=deployed&date=today"
              passHref
              onClick={() => setSelectedStatus("deployed")}
            >
              <div className="bg-gray-800 p-3 rounded-lg text-center cursor-pointer hover:text-white w-64">
                <h3 className="text-lg text-white-500">
                  Today's Hardware Allocation
                </h3>
                <p className="text-2xl">
                  {todaysDeployedCount !== null ? todaysDeployedCount : "N/A"}
                </p>
                <span className="text-teal-500">Last 24 hours</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Manufacturer Wise</h2>
              <div className="w-full max-w-2xl">
                <ManufacturerPieChart />
              </div>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-lg mb-3">Assets Department Wise</h2>
              <div>
                <SimpleRadialBarChart />
              </div>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg col-span-full flex flex-col items-center">
              <h2 className="text-lg mb-3">Category wise Assets</h2>
              <div>
                <StackedBarChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Page);
