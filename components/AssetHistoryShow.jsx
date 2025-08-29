// import React, { useEffect, useState } from "react";
// import { Calendar, Clock, UserCircle, Activity } from "lucide-react";

// const AssetHistoryItem = ({ entry }) => {
//   const [userRole, setUserRole] = useState("");

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//    const storedUserData = JSON.parse(localStorage.getItem('user'));
//     console.log("Stored User Data:", storedUserData);

//   const capitalizedName =
//     displayName.charAt(0).toUpperCase() + displayName.slice(1);

//   const getActionDescription = (entry) => {
//     const recipient = entry.user;
//     const action = entry.action;

//     switch (action) {
//       case "created":
//         return `Created asset${recipient ? ` and issued to ${recipient}` : ""}`;
//       case "checkIn":
//         return `Checked in asset ${recipient}`;
//       case "checkOut":
//         return `Checked out asset ${recipient}`;
//       default:
//         return `Changed status to ${entry.status}`;
//     }
//   };

//   const actionDescription = getActionDescription(entry);

//   return (
//     <div className="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-200 text-sm md:text-base">
//       <div className="flex items-start">
//         <div className="bg-blue-600 p-2 rounded-full mr-3">
//           <Activity size={20} className="text-white" />
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-start flex-wrap">
//             <div className="flex items-center">
//               <UserCircle size={18} className="text-blue-400 mr-1" />
//               <span className="font-medium text-blue-300">
//                 {capitalizedName}
//               </span>
//             </div>
//             <div className="text-xs text-gray-400 flex items-center flex-wrap">
//               <Calendar size={14} className="mr-1" />
//               <span>{formatDate(entry.date)}</span>
//               <Clock size={14} className="ml-2 mr-1" />
//               <span>{formatTime(entry.date)}</span>
//             </div>
//           </div>

//           <p className="mt-2 text-gray-300">{actionDescription}</p>

//           {entry.previousAssetOwner && (
//             <div className="mt-1 text-sm text-gray-400">
//               Previous recipient:{" "}
//               <span className="text-gray-300">{entry.previousAssetOwner}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AssetHistoryShow = ({ history }) => {
//   return (
//     <div className="mt-6">
//       <div className="flex items-center mb-4">
//         <h3 className="text-xl font-medium text-gray-200">Asset History</h3>
//         <div className="ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
//           {history.length} {history.length === 1 ? "entry" : "entries"}
//         </div>
//       </div>

//       <div className="max-h-[400px] overflow-y-auto space-y-1 bg-gray-900 p-4 rounded-lg shadow-md">
//         {history.length > 0 ? (
//           history.map((entry, index) => (
//             <AssetHistoryItem key={index} entry={entry} />
//           ))
//         ) : (
//           <div className="text-center p-6">
//             <Activity size={32} className="text-gray-500 mx-auto mb-2" />
//             <p className="text-gray-400">
//               No history available for this asset.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetHistoryShow;


import React from "react";
import { Calendar, Clock, UserCircle, Activity } from "lucide-react";

// Utility: Capitalize
const capitalize = (s) => !s ? "" : s.charAt(0).toUpperCase() + s.slice(1);

// Utility: Get actor's Siemens ID or fallback
const getSiemensId = (entry) => {
  // Priority: updatedBy > user.siemensId > user (string) > "System" > "Unknown"
  if (entry.updatedBy && entry.updatedBy !== "system") {
    return entry.updatedBy.split("@")[0];
  }
  if (typeof entry.user === "object" && entry.user?.siemensId) {
    return entry.user.siemensId.split("@")[0];
  }
  if (typeof entry.user === "string" && entry.user !== "system") {
    return entry.user.split("@")[0];
  }
  if ((entry.updatedBy && entry.updatedBy === "system") || entry.user === "system") {
    return "System";
  }
  return "Unknown";
};

// Format date and time
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

// Asset owner name extraction utility
const getAssetOwner = (entry) => {
  // Try user, newAssignee, or user.fullName
  if (entry.user && typeof entry.user === "string") return entry.user;
  if (entry.newAssignee) return entry.newAssignee;
  if (typeof entry.user === "object" && entry.user?.fullName) return entry.user.fullName;
  return undefined;
};

// The action description builder for each type of action/event
const getActionDescription = (entry) => {
  const actor = getSiemensId(entry);
  const user = getAssetOwner(entry);
  const changes =
    entry.changes && typeof entry.changes === "object" && Object.keys(entry.changes).length > 0
      ? Object.entries(entry.changes)
        .map(
          ([field, value]) =>
            `${capitalize(field)}: ${typeof value === "string" ? value : JSON.stringify(value)}`
        )
        .join(", ")
      : null;

  switch (entry.action) {
    case "created":
      return (
        <span>
          <span className="text-blue-400">{actor}</span> created the asset
          {entry.status && <> with status <span className="font-semibold">{entry.status}</span></>}
          {user && <> for <span className="text-teal-300">{user}</span></>}
        </span>
      );
    case "checkIn":
      return (
        <span>
          Checkin the asset and ownership transferred to <span className="text-teal-300">{user || "Unknown"}</span>
        </span>
      );
    case "checkOut":
      return (
        <span>
          Checkout the asset and ownership transferred to <span className="text-teal-300">{user || "Unknown"}</span>
        </span>
      );
    case "update":
      return (
        <span>
          updated asset{changes && <>: <span className="font-semibold">{changes}</span></>}
        </span>
      );
    case "disposed":
      return (
        <span>
          <span className="text-red-400">{actor}</span> disposed the asset.
        </span>
      );
  }
};

const AssetHistoryItem = ({ entry }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-blue-500 shadow-md text-sm md:text-base">
      <div className="flex items-start">
        <div className="bg-blue-600 p-2 rounded-full mr-3">
          <Activity size={20} className="text-white" />
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

          <p className="mt-2 text-gray-300">{getActionDescription(entry)}</p>

          {entry.previousAssetOwner && (
            <div className="mt-1 text-sm text-gray-400">
              Previous owner: <span className="text-gray-300">{entry.previousAssetOwner}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetHistoryShow = ({ history }) => {
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
          history.map((entry, index) => (
            <AssetHistoryItem key={index} entry={entry} />
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