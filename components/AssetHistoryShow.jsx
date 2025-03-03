import React from "react";
import { Calendar, Clock, UserCircle, Activity } from "lucide-react";

const AssetHistoryItem = ({ entry }) => {
  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Format time separately
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Extract username from email
  const displayName = entry.user ? entry.user.split("@")[0] : "N/A";
  const capitalizedName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Get appropriate action description
  const getActionDescription = (action, status) => {
    switch (action) {
      case "checkIn":
        return `checked in asset (${status})`;
      case "checkOut":
        return `checked out asset`;
      default:
        return `changed status to ${status}`;
    }
  };

  const actionDescription = getActionDescription(entry.action, entry.status);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start">
        <div className="bg-blue-600 p-2 rounded-full mr-3">
          <Activity size={20} className="text-white" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <UserCircle size={18} className="text-blue-400 mr-1" />
              <span className="font-medium text-blue-300">
                {capitalizedName}
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(entry.date)}</span>
              <Clock size={14} className="ml-2 mr-1" />
              <span>{formatTime(entry.date)}</span>
            </div>
          </div>

          <p className="mt-2 text-gray-300">{actionDescription}</p>

          {entry.previousIssueTo && entry.issueTo && (
            <div className="mt-1 text-sm text-gray-400">
              From{" "}
              <span className="text-gray-300">{entry.previousIssueTo}</span> to{" "}
              <span className="text-gray-300">{entry.issueTo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetHistoryShow = ({ history }) => {
  console.log("his", history);
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium text-gray-200">Asset History</h3>
        <div className="ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {history.length} {history.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {history.length > 0 ? (
        <div className="space-y-1">
          {history.map((entry, index) => (
            <AssetHistoryItem key={index} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Activity size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">No history available for this asset.</p>
        </div>
      )}
    </div>
  );
};

export default AssetHistoryShow;
