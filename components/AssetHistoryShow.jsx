'use client';

import { useState, useEffect } from 'react'; 
import { Calendar, Clock, UserCircle, Activity, ChevronDown, ChevronUp, Package, Plus, Minus, Edit } from "lucide-react";

// Move utility functions outside (they don't need to be inside components)
const getSiemensId = (entry) =>
  entry.updatedBy ? entry.updatedBy.split("@")[0] : "Unknown";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getAssetOwner = (storedUserData) => {
  if (storedUserData.user) return storedUserData.user;
};

const formatFieldName = (fieldName) => {
  if (!fieldName) return "Unknown Field";

  if (fieldName.startsWith('accessories.')) {
    return fieldName.replace('accessories.', '');
  }

  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const ChangeDetail = ({ change }) => {
  const { field, oldValue, newValue, changeType } = change;
  const formattedField = formatFieldName(field);

  if (field.startsWith('accessories.')) {
    const accessoryName = field.replace('accessories.', '');

    if (changeType === 'added') {
      return (
        <li className="text-gray-400 text-sm flex items-center">
          <Plus size={14} className="text-green-400 mr-2" />
          <span className="font-semibold text-green-400">Added:</span>
          <span className="ml-1">{accessoryName} (Qty: {newValue})</span>
        </li>
      );
    } else if (changeType === 'removed') {
      return (
        <li className="text-gray-400 text-sm flex items-center">
          <Minus size={14} className="text-red-400 mr-2" />
          <span className="font-semibold text-red-400">Removed:</span>
          <span className="ml-1">{accessoryName} (was Qty: {oldValue})</span>
        </li>
      );
    } else if (changeType === 'modified') {
      return (
        <li className="text-gray-400 text-sm flex items-center">
          <Edit size={14} className="text-blue-400 mr-2" />
          <span className="font-semibold text-blue-400">Modified:</span>
          <span className="ml-1">{accessoryName}: </span>
          <span className="line-through text-red-400">{oldValue}</span>
          <span className="mx-1">→</span>
          <span className="text-green-400">{newValue}</span>
        </li>
      );
    }
  }

  const displayOldValue = oldValue === null || oldValue === undefined ? "N/A" : (typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue));
  const displayNewValue = newValue === null || newValue === undefined ? "N/A" : (typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue));

  return (
    <li className="text-gray-400 text-sm">
      <span className="font-semibold text-gray-300">{formattedField}:</span>{" "}
      <span className="line-through text-red-400">{displayOldValue}</span> {"→"} <span className="text-green-400">{displayNewValue}</span>
    </li>
  );
};

const AssetHistoryItem = ({ entry, storedUserData }) => {
  const [showDetails, setShowDetails] = useState(false);

  const isAccessoriesUpdate = entry.action === "update" &&
    entry.changes &&
    Array.isArray(entry.changes) &&
    entry.changes.every(change => change.field?.startsWith("accessories."));

  const getActionIcon = () => {
    switch (entry.action) {
      case "created":
        return <Activity size={20} className="text-white" />;
      case "checkIn":
        return <Activity size={20} className="text-white" />;
      case "checkOut":
        return <Activity size={20} className="text-white" />;
      case "disposed":
        return <Activity size={20} className="text-white" />;
      case "update":
        return isAccessoriesUpdate ?
          <Package size={20} className="text-white" /> :
          <Activity size={20} className="text-white" />;
      default:
        return <Activity size={20} className="text-white" />;
    }
  };

  const getBorderColor = () => {
    switch (entry.action) {
      case "created":
        return "border-green-500";
      case "checkIn":
        return "border-yellow-500";
      case "checkOut":
        return "border-purple-500";
      case "disposed":
        return "border-red-500";
      case "update":
        return isAccessoriesUpdate ? "border-orange-500" : "border-blue-500";
      default:
        return "border-blue-500";
    }
  };

  const getIconBgColor = () => {
    switch (entry.action) {
      case "created":
        return "bg-green-600";
      case "checkIn":
        return "bg-yellow-600";
      case "checkOut":
        return "bg-purple-600";
      case "disposed":
        return "bg-red-600";
      case "update":
        return isAccessoriesUpdate ? "bg-orange-600" : "bg-blue-600";
      default:
        return "bg-blue-600";
    }
  };

  const getActorInfo = () => {
    const actor = getSiemensId(entry);
    const user = getAssetOwner(entry);
    let info = <span className="text-blue-400">{actor}</span>;

    switch (entry.action) {
      case "created":
        info = <>{info} created the asset</>;
        if (entry.status) {
          info = <>{info} with status <span className="font-semibold">{entry.status}</span></>;
        }
        if (user) {
          info = <>{info} for <span className="text-teal-300">{user}</span></>;
        }
        break;
      case "checkIn":
        info = (
          <>
            checkIn the asset (Status:{" "}
            <span className="text-teal-300">{entry.status}</span>)
            {entry.assetOwner && (
              <> on user <span className="text-purple-300">{user}</span></>
            )}
          </>
        );
        break;
      case "checkOut":
        info = <> checkOut the asset</>;
        if (user) {
          info = <>{info} to <span className="text-teal-300">{user}</span></>;
        }
        break;
      case "disposed":
        info = <span className="text-red-400">{actor}</span>;
        info = <>{info} disposed the asset</>;
        break;
      case "update":
        if (isAccessoriesUpdate) {
          info = <>{info} updated accessories</>;
          const addedCount = entry.changes.filter(c => c.changeType === 'added').length;
          const removedCount = entry.changes.filter(c => c.changeType === 'removed').length;
          const modifiedCount = entry.changes.filter(c => c.changeType === 'modified').length;

          const changesSummary = [];
          if (addedCount > 0) changesSummary.push(`${addedCount} added`);
          if (removedCount > 0) changesSummary.push(`${removedCount} removed`);
          if (modifiedCount > 0) changesSummary.push(`${modifiedCount} modified`);

          if (changesSummary.length > 0) {
            info = (
              <>
                {info}
                <span className="text-xs text-gray-400 ml-1">
                  ({changesSummary.join(', ')})
                </span>
              </>
            );
          }
        } else {
          info = <>{info} updated the asset</>;
          if (entry.changes && Array.isArray(entry.changes) && entry.changes.length > 0) {
            info = (
              <>
                {info}
                <span className="text-xs text-gray-400 ml-1">
                  ({entry.changes.length} field{entry.changes.length !== 1 ? 's' : ''} modified)
                </span>
              </>
            );
          }
        }
        break;
      default:
        info = <>{info} performed {entry.action} on the asset</>;
    }
    return info;
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 mb-3 border-l-4 ${getBorderColor()} shadow-md text-sm md:text-base`}>
      <div className="flex items-start">
        <div className={`${getIconBgColor()} p-2 rounded-full mr-3`}>
          {getActionIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex items-center">
              <UserCircle size={18} className="text-blue-400 mr-1" />
              <span className="font-medium text-blue-300">
                {getSiemensId(entry)}
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center flex-wrap">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(entry.date)}</span>
              <Clock size={14} className="ml-2 mr-1" />
              <span>{formatTime(entry.date)}</span>
            </div>
          </div>

          <p className="mt-2 text-gray-300">{getActorInfo()}</p>

          {entry.previousAssetOwner && (
            <div className="mt-1 text-sm text-gray-400">
              Previous owner: <span className="text-gray-300">{entry.previousAssetOwner}</span>
            </div>
          )}

          {entry.action === "update" && entry.changes && Array.isArray(entry.changes) && entry.changes.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-blue-400 hover:text-blue-300 focus:outline-none text-sm"
              >
                {showDetails ? (
                  <>
                    <ChevronUp size={16} className="mr-1" /> Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    {isAccessoriesUpdate ? "Show Accessory Changes" : "Show Details"}
                  </>
                )}
              </button>
              {showDetails && (
                <div className="mt-2 pl-4 border-l border-gray-600">
                  {isAccessoriesUpdate ? (
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                        <Package size={14} className="mr-1" />
                        Accessory Changes:
                      </h4>
                      <ul className="space-y-1">
                        {entry.changes.map((change, idx) => (
                          <ChangeDetail key={idx} change={change} />
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {entry.changes.map((change, idx) => (
                        <ChangeDetail key={idx} change={change} />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {isAccessoriesUpdate && (
            <div className="mt-2 text-xs text-gray-500 italic">
              Accessories configuration updated
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ SOLUTION: Move hooks inside the main component
const AssetHistoryShow = ({ history }) => {
  // ✅ Hooks are now inside the component function
  const [storedUserData, setStoredUserData] = useState(null);

  useEffect(() => {
    // Runs only on client, so localStorage is available
    const user = localStorage.getItem("user");
    if (user) {
      setStoredUserData(JSON.parse(user));
      console.log("Stored User Data:", JSON.parse(user));
    }
  }, []);

  // Sort history by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium text-gray-200">Asset History</h3>
        <div className="ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {history.length} {history.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-1 bg-gray-900 p-4 rounded-lg shadow-md">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((entry, index) => (
            <AssetHistoryItem 
              key={index} 
              entry={entry} 
              storedUserData={storedUserData} 
            />
          ))
        ) : (
          <div className="text-center p-6">
            <Activity size={32} className="text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">
              No history available for this asset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetHistoryShow;