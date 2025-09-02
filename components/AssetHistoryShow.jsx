'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, UserCircle, Activity, ChevronDown, ChevronUp, Package, Plus, Minus, Edit, RefreshCw } from "lucide-react";

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

const DetailedChangeItem = ({ fieldName, changeData }) => {
  const { from, to, type, accessoryName, changeType } = changeData;
  
  if (type === 'accessory_added') {
    return (
      <li className="text-gray-400 text-sm flex items-center py-1">
        <Plus size={14} className="text-green-400 mr-2 flex-shrink-0" />
        <span className="font-semibold text-green-400">Added:</span>
        <span className="ml-1 text-gray-300">{accessoryName}</span>
        <span className="ml-1 text-gray-400">(Qty: {to})</span>
      </li>
    );
  }
  
  if (type === 'accessory_removed') {
    return (
      <li className="text-gray-400 text-sm flex items-center py-1">
        <Minus size={14} className="text-red-400 mr-2 flex-shrink-0" />
        <span className="font-semibold text-red-400">Removed:</span>
        <span className="ml-1 text-gray-300">{accessoryName}</span>
        <span className="ml-1 text-gray-400">(was Qty: {from})</span>
      </li>
    );
  }
  
  if (type === 'accessory_modified') {
    return (
      <li className="text-gray-400 text-sm flex items-center py-1">
        <Edit size={14} className="text-blue-400 mr-2 flex-shrink-0" />
        <span className="font-semibold text-blue-400">Modified:</span>
        <span className="ml-1 text-gray-300">{accessoryName}:</span>
        <span className="ml-1 line-through text-red-400">{from}</span>
        <span className="mx-1 text-gray-500">→</span>
        <span className="text-green-400">{to}</span>
      </li>
    );
  }
  
  // Regular field changes
  const displayFrom = from === null || from === undefined || from === '' ? "N/A" : String(from);
  const displayTo = to === null || to === undefined || to === '' ? "N/A" : String(to);
  
  return (
    <li className="text-gray-400 text-sm flex items-start py-1">
      <RefreshCw size={14} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <span className="font-semibold text-gray-300">{formatFieldName(fieldName)}:</span>
        <div className="mt-1 flex items-center flex-wrap">
          <span className="bg-red-900/30 px-2 py-1 rounded text-red-400 line-through text-xs mr-2">
            {displayFrom}
          </span>
          <span className="text-gray-500 mx-1">→</span>
          <span className="bg-green-900/30 px-2 py-1 rounded text-green-400 text-xs">
            {displayTo}
          </span>
        </div>
      </div>
    </li>
  );
};

const AssetHistoryItem = ({ entry }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Extract detailed changes
  const detailedChanges = entry.detailedChanges || {};
  const changedFields = entry.changedFields || [];
  
  // Check if this is an accessories update
  const isAccessoriesUpdate = changedFields.includes('accessories') || 
    Object.keys(detailedChanges).some(key => key.startsWith('accessories.'));
  
  // Count different types of changes
  const accessoryChanges = Object.entries(detailedChanges).filter(([key]) => key.startsWith('accessories.'));
  const fieldChanges = Object.entries(detailedChanges).filter(([key]) => !key.startsWith('accessories.'));
  
  const addedCount = accessoryChanges.filter(([_, data]) => data.type === 'accessory_added').length;
  const removedCount = accessoryChanges.filter(([_, data]) => data.type === 'accessory_removed').length;
  const modifiedAccessoriesCount = accessoryChanges.filter(([_, data]) => data.type === 'accessory_modified').length;
  const modifiedFieldsCount = fieldChanges.length;

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
        return isAccessoriesUpdate && fieldChanges.length === 0 ?
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
        return isAccessoriesUpdate && fieldChanges.length === 0 ? "border-orange-500" : "border-blue-500";
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
        return isAccessoriesUpdate && fieldChanges.length === 0 ? "bg-orange-600" : "bg-blue-600";
      default:
        return "bg-blue-600";
    }
  };

  const getActorInfo = () => {
    const actor = getSiemensId(entry);
    let info = <span className="text-blue-400">{actor}</span>;

    switch (entry.action) {
      case "created":
        info = <>{info} created the asset</>;
        if (entry.status) {
          info = <>{info} with status <span className="font-semibold text-teal-300">{entry.status}</span></>;
        }
        if (entry.assetOwner) {
          info = <>{info} assigned to <span className="text-teal-300">{entry.assetOwner}</span></>;
        }
        break;
      case "checkIn":
        info = (
          <>
            {info} returned ownership to{" "}
            <span className="text-purple-300">{entry.assetOwner}</span>
            {" "}with status{" "}
            <span className="text-teal-300">{entry.status}</span>
          </>
        );
        break;
      case "checkOut":
        info = (
          <>
            {info} transferred ownership to{" "}
            <span className="text-teal-300">{entry.assetOwner}</span>
            {" "} with status <span className="text-green-400">{entry.status}</span>
          </>
        );
        break;
      case "disposed":
        info = <>{info} disposed the asset</>;
        break;
      case "update":
        if (isAccessoriesUpdate && fieldChanges.length === 0) {
          // Only accessories changes
          info = <>{info} updated accessories</>;
          const changesSummary = [];
          if (addedCount > 0) changesSummary.push(`${addedCount} added`);
          if (removedCount > 0) changesSummary.push(`${removedCount} removed`);
          if (modifiedAccessoriesCount > 0) changesSummary.push(`${modifiedAccessoriesCount} modified`);

          if (changesSummary.length > 0) {
            info = (
              <>
                {info}
                <span className="text-xs text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
                  {changesSummary.join(', ')}
                </span>
              </>
            );
          }
        } else if (fieldChanges.length > 0 && accessoryChanges.length === 0) {
          // Only field changes
          info = <>{info} updated asset fields</>;
          if (modifiedFieldsCount > 0) {
            const fieldNames = fieldChanges.map(([key]) => formatFieldName(key));
            info = (
              <>
                {info}
                <span className="text-xs text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
                  {fieldNames.join(', ')}
                </span>
              </>
            );
          }
        } else {
          // Mixed changes
          info = <>{info} updated the asset</>;
          const changesSummary = [];
          if (modifiedFieldsCount > 0) changesSummary.push(`${modifiedFieldsCount} fields`);
          if (addedCount > 0) changesSummary.push(`${addedCount} accessories added`);
          if (removedCount > 0) changesSummary.push(`${removedCount} accessories removed`);
          if (modifiedAccessoriesCount > 0) changesSummary.push(`${modifiedAccessoriesCount} accessories modified`);

          if (changesSummary.length > 0) {
            info = (
              <>
                {info}
                <span className="text-xs text-gray-400 ml-2 bg-gray-800 px-2 py-1 rounded">
                  {changesSummary.join(', ')}
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

  const totalChanges = Object.keys(detailedChanges).length;

  return (
    <div className={`bg-gray-800 rounded-lg p-4 mb-3 border-l-4 ${getBorderColor()} shadow-md text-sm md:text-base`}>
      <div className="flex items-start">
        <div className={`${getIconBgColor()} p-2 rounded-full mr-3 flex-shrink-0`}>
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

          {/* Show details button if there are changes to display */}
          {entry.action === "update" && totalChanges > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-blue-400 hover:text-blue-300 focus:outline-none text-sm transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp size={16} className="mr-1" /> Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Show Details
                    <span className="ml-1 text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
                      {totalChanges} change{totalChanges !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </button>
              
              {showDetails && (
                <div className="mt-3 pl-4 border-l-2 border-gray-600">
                  {/* Accessories Changes Section */}
                  {accessoryChanges.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-orange-300 mb-2 flex items-center">
                        <Package size={14} className="mr-1" />
                        Accessory Changes ({accessoryChanges.length}):
                      </h4>
                      <ul className="space-y-1 bg-gray-900/50 rounded p-2">
                        {accessoryChanges.map(([fieldName, changeData], idx) => (
                          <DetailedChangeItem key={`accessory-${idx}`} fieldName={fieldName} changeData={changeData} />
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Field Changes Section */}
                  {fieldChanges.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center">
                        <Edit size={14} className="mr-1" />
                        Field Changes ({fieldChanges.length}):
                      </h4>
                      <ul className="space-y-1 bg-gray-900/50 rounded p-2">
                        {fieldChanges.map(([fieldName, changeData], idx) => (
                          <DetailedChangeItem key={`field-${idx}`} fieldName={fieldName} changeData={changeData} />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fallback message if no detailed changes but we know something changed */}
          {entry.action === "update" && totalChanges === 0 && changedFields.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 italic bg-gray-900/30 p-2 rounded">
              Fields modified: {changedFields.map(formatFieldName).join(', ')}
              <br />
              <span className="text-yellow-400">Note: Detailed change information not available for this entry.</span>
            </div>
          )}

          {/* Show update note */}
          {entry.action === "update" && (
            <div className="mt-2 text-xs text-gray-500 italic">
              {isAccessoriesUpdate && fieldChanges.length === 0 
                ? "Accessories configuration updated" 
                : fieldChanges.length > 0 && accessoryChanges.length === 0
                ? "Asset information updated"
                : "Asset and accessories updated"
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetHistoryShow = ({ history }) => {
  const [storedUserData, setStoredUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setStoredUserData(JSON.parse(user));
    }
  }, []);

  // Sort history by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Debug logging
  useEffect(() => {
    if (history.length > 0) {
      console.log("Asset History Sample Entry:", history[0]);
      if (history[0].detailedChanges) {
        console.log("Detailed Changes:", history[0].detailedChanges);
      }
    }
  }, [history]);

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium text-gray-200">Asset History</h3>
        <div className="ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {history.length} {history.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto space-y-1 bg-gray-900 p-4 rounded-lg shadow-md">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((entry, index) => (
            <AssetHistoryItem
              key={`history-${index}-${entry.date}`}
              entry={entry}
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