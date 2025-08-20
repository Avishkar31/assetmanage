// app/stocks/monitors/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import AssetHistoryShow from "@/components/AssetHistoryShowMonitors";

export default function MonitorDetailPage({ params }) {
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [assetOwner, setAssetOwner] = useState("");
  // const [returnBy, setReturnBy] = useState("");
  const [returnTo, setReturnTo]= useState("");
  const [reassignMonitor, setReassignMonitor] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchMonitor();
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData.siemensId || userData.name || "Unknown User");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, [params.id]);

  const fetchMonitor = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/monitors?id=${params.id}`);
      if (!response.ok) throw new Error(`Failed to fetch monitor: ${response.status}`);
      const data = await response.json();
      setMonitor(data.data[0]);
    } catch (error) {
      console.error("Error fetching monitor:", error);
      setError("Error fetching monitor details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this monitor?")) return;

    try {
      const response = await fetch(`/api/monitors?id=${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Failed to delete monitor");
      router.push('/stocks/monitors');
    } catch (error) {
      console.error("Error deleting monitor:", error);
      setError("Error deleting monitor");
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();

    if (!assetOwner) {
      alert("Please enter recipient name");
      return;
    }

    try {
      const response = await fetch(`/api/monitors?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: currentUser,
          user: assetOwner,
          assetOwner: assetOwner,
          status: "deployed",
          action: "statusChange",
          previousStatus: monitor.status
        }),
      });

      if (!response.ok) throw new Error("Failed to deploy monitor");

      setShowDeployModal(false);
      setAssetOwner("");
      fetchMonitor();
    } catch (error) {
      console.error("Error deploying monitor:", error);
      setError("Error deploying monitor");
    }
  };

  const handleReturnToPool = async (e) => {
    e.preventDefault();

    if (!reassignMonitor && !returnTo) {
      alert("Please enter the name of the person returning the monitor");
      return;
    }

    if (reassignMonitor && !newAssignee) {
      alert("Please enter the name of the new assignee");
      return;
    }

    try {
      // If reassigning, deploy to new person right away
      if (reassignMonitor) {
        const response = await fetch(`/api/monitors?id=${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updatedBy: currentUser,
            user: newAssignee,
            assetOwner: newAssignee,
            status: "deployed",
            action: "reassigned",
            previousAssetOwner: monitor.assetOwner,
            note: `Reassigned from ${monitor.assetOwner} to ${newAssignee}`
          }),
        });

        if (!response.ok) throw new Error("Failed to reassign monitor");
      } else {
        // Return to MISStock with returnto information
        const response = await fetch(`/api/monitors?id=${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updatedBy: currentUser,
            user: "",
            assetOwner: returnTo,   // ✅ store the "Returned to" person in assetOwner
            status: "MISStock",
            action: "statusChange",
            previousAssetOwner: monitor.assetOwner,
            previousStatus: monitor.status,
            note: `Returned to MISStock by ${returnTo}`
          }),
        });

        if (!response.ok) throw new Error("Failed to return monitor to MISStock");
      }

      setShowReturnModal(false);
      setReturnTo("");
      setReassignMonitor(false);
      setNewAssignee("");
      fetchMonitor();
    } catch (error) {
      console.error("Error handling monitor return/reassign:", error);
      setError("Error processing monitor");
    }
  };

  const handleDispose = async () => {
    if (!confirm("Are you sure you want to mark this monitor as disposed?")) return;

    try {
      const response = await fetch(`/api/monitors?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: currentUser,
          status: "disposed",
          action: "statusChange",
          previousStatus: monitor.status
        }),
      });

      if (!response.ok) throw new Error("Failed to dispose monitor");
      fetchMonitor();
    } catch (error) {
      console.error("Error disposing monitor:", error);
      setError("Error disposing monitor");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading monitor details...</p>
        </div>
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="mb-6">
          <Link href="/stocks/monitors">
            <button className="flex items-center text-gray-400 hover:text-white">
              <ArrowLeft size={18} className="mr-2" /> Back to Monitors
            </button>
          </Link>
        </div>
        <div className="bg-red-600 p-4 rounded-lg">
          {error || "Monitor not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="mb-6">
        <Link href="/stocks/monitors">
          <button className="flex items-center text-gray-400 hover:text-white">
            <ArrowLeft size={18} className="mr-2" /> Back to Monitors
          </button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monitor Details</h1>
        <div className="flex space-x-2">
          <Link href={`/stocks/monitors/edit/${params.id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center">
              <Edit size={18} className="mr-2" /> Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center"
          >
            <Trash size={18} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Monitor Information</h2>
            <div className="space-y-2">
              <DetailRow label="Serial Number" value={monitor.serialNumber} />
              <DetailRow label="Manufacturer" value={monitor.manufacturer} />
              <DetailRow label="Model" value={monitor.model} />
              <DetailRow label="PR Number" value={monitor.prNumber} />
              <DetailRow label="PO Number" value={monitor.poNumber} />
              <DetailRow label="PR Requester" value={monitor.prRequester} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Status Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(monitor.status)}`}>
                  {monitor.status}
                </span>
              </div>
              <DetailRow label="Segment" value={monitor.segment?.name || "N/A"} />
              <DetailRow label="Issued To" value={monitor.assetOwner || "N/A"} />
              <DetailRow label="Created By" value={monitor.username || "N/A"} />
              <DetailRow
                label="Created At"
                value={monitor.createdAt ? new Date(monitor.createdAt).toLocaleDateString() : "N/A"}
              />
            </div>

            <div className="mt-6 flex space-x-2">
              {monitor.status === "MISStock" && (
                <button
                  onClick={() => setShowDeployModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center"
                >
                  <CheckCircle size={18} className="mr-2" /> Deploy Monitor
                </button>
              )}
              {monitor.status === "deployed" && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center"
                >
                  <XCircle size={18} className="mr-2" /> Return to Pool
                </button>
              )}
              {monitor.status !== "disposed" && (
                <button
                  onClick={handleDispose}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center"
                >
                  <Trash size={18} className="mr-2" /> Mark as Disposed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AssetHistoryShow history={monitor.assetHistory || []} />

      {showDeployModal && (
        <Modal
          title="Deploy Monitor"
          onClose={() => setShowDeployModal(false)}
        >
          <form onSubmit={handleDeploy}>
            <div className="mb-4">
              <label className="block mb-2">Asset Owner*</label>
              <input
                type="text"
                value={assetOwner}
                onChange={(e) => setAssetOwner(e.target.value)}
                required
                placeholder="Enter recipient name"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeployModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center"
              >
                <CheckCircle size={18} className="mr-2" /> Deploy
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showReturnModal && (
        <Modal
          title="Return Monitor to Pool"
          onClose={() => setShowReturnModal(false)}
        >
          <form onSubmit={handleReturnToPool}>
            <p className="mb-4">
              Currently assigned to: <strong>{monitor.assetOwner || "N/A"}</strong>
            </p>

            <div className="mb-4">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-medium">Do you want to reassign this monitor to another user?</label>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="no-reassign"
                  name="transferType"
                  checked={!reassignMonitor}
                  onChange={() => setReassignMonitor(false)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="no-reassign">
                  No, return to MISStock
                </label>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="yes-reassign"
                  name="transferType"
                  checked={reassignMonitor}
                  onChange={() => setReassignMonitor(true)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="yes-reassign">
                  Yes, reassign to another user
                </label>
              </div>

              {!reassignMonitor && (
                <div className="mt-4 ml-6">
                  <label className="block mb-2 ">Returned to*</label>
                  <input
                    type="text"
                    id="returnTo"
                    value={returnTo}
                    onChange={(e) => setReturnTo(e.target.value)}
                    required={!reassignMonitor}
                    placeholder="Enter name of person returning the monitor"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
              )}

              {reassignMonitor && (
                <div className="mt-4 ml-6">
                  <label className="block mb-2">New Assignee*</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    required={reassignMonitor}
                    placeholder="Enter new assignee name"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center"
              >
                {reassignMonitor ? (
                  <>
                    <CheckCircle size={18} className="mr-2" /> Reassign to User
                  </>
                ) : (
                  <>
                    <XCircle size={18} className="mr-2" /> Return to MISStock
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-700 pb-2">
    <span className="text-gray-400">{label}:</span>
    <span>{value}</span>
  </div>
);

const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'MISStock':
      return 'bg-green-900 text-green-300';
    case 'deployed':
      return 'bg-blue-900 text-blue-300';
    case 'disposed':
      return 'bg-red-900 text-red-300';
    default:
      return 'bg-gray-900 text-gray-300';
  }
};
