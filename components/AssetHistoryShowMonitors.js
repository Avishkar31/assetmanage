// components/AssetHistoryShowMonitors.js
import React from "react";
import { Calendar, Clock, UserCircle, Activity } from "lucide-react";

const AssetHistoryItem = ({ entry }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Use updatedBy to show who performed the action
  const displayName = entry.updatedBy 
    ? entry.updatedBy.split("@")[0] 
    : "N/A";

  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Improved action description logic
  const getActionDescription = (entry) => {
    const status = entry.status || "";
    const recipient = entry.user || "";
    
    switch (entry.action) {
      case "created":
        return `Created new monitor with status: ${status}`;
      case "checkIn":
        return `Checked in monitor (${status})`;
      case "checkOut":
        return recipient ? `Checked out monitor to ${recipient}` : `Checked out monitor`;
      case "statusChange":
        if (status === "deployed" && recipient) {
          return `Deployed monitor to ${recipient}`;
        } else if (status === "inpool") {
          return `Returned monitor to pool`;
        } else {
          return `Changed status to ${status}`;
        }
      case "updated":
        return `Updated monitor information`;
      case "bulkUpdate":
        return `Updated in bulk import`;
      default:
        return `${entry.action || "Updated"} monitor (${status})`;
    }
  };

  const actionDescription = getActionDescription(entry);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-200 text-sm md:text-base">
      <div className="flex items-start">
        <div className="bg-blue-600 p-2 rounded-full mr-3">
          <Activity size={20} className="text-white" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex items-center">
              <UserCircle size={18} className="text-blue-400 mr-1" />
              <span className="font-medium text-blue-300">{capitalizedName}</span>
            </div>
            <div className="text-xs text-gray-400 flex items-center flex-wrap">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(entry.date)}</span>
              <Clock size={14} className="ml-2 mr-1" />
              <span>{formatTime(entry.date)}</span>
            </div>
          </div>

          <p className="mt-2 text-gray-300">{actionDescription}</p>

          {entry.previousStatus && (
            <div className="mt-1 text-sm text-gray-400">
              Previous status: <span className="text-gray-300">{entry.previousStatus}</span>
            </div>
          )}

          {entry.previousIssueTo && (
            <div className="mt-1 text-sm text-gray-400">
              Previous recipient: <span className="text-gray-300">{entry.previousIssueTo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetHistoryShowMonitors = ({ history }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium text-gray-200">Asset History</h3>
        <div className="ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {history.length} {history.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-1 bg-gray-900 p-4 rounded-lg shadow-md">
        {history.length > 0 ? (
          history.map((entry, index) => <AssetHistoryItem key={index} entry={entry} />)
        ) : (
          <div className="text-center p-6">
            <Activity size={32} className="text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No history available for this monitor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetHistoryShowMonitors;