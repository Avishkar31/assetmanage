import { FaEdit, FaTrash } from "react-icons/fa";

import { useNavigate } from "react-router-dom"; 
const columnData = [
  {
    accessorKey: "nodeName",
    header: "Node Name",
    minWidth: 150,
    cell: (info) => info.getValue() || "-",
    // Enable filtering
    enableColumnFilter: true,
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
    minWidth: 150,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    minWidth: 100,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "model",
    header: "Model",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "expires",
    header: "Expiration Date",
    minWidth: 150,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return "-";
      }
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    minWidth: 100,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    minWidth: 100,
    cell: (info) => {
      const status = info.getValue();
      if (!status) return "-";
      
      // Add color coding for status
      let bgColor = "bg-gray-600";
      if (status === "Deployed") bgColor = "bg-green-600";
      else if (status === "Available") bgColor = "bg-blue-600";
      else if (status === "Maintenance") bgColor = "bg-yellow-600";
      else if (status === "Disposed") bgColor = "bg-red-600";
      
      return (
        <span className={`${bgColor} text-white text-xs px-2 py-1 rounded-full`}>
          {status}
        </span>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "department",
    header: "Department",
    minWidth: 130,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "issueTo",
    header: "Issued To",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "defaultLocation",
    header: "Default Location",
    minWidth: 150,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "costCenter",
    header: "Cost Center",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    minWidth: 150,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return "-";
      }
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "assetOwner",
    header: "Asset Owner",
    minWidth: 130,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "condition",
    header: "Condition",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "storeLocation",
    header: "Store Location",
    minWidth: 130,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "killdiskDate",
    header: "Killdisk Date",
    minWidth: 150,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return "-";
      }
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "attachedFile",
    header: "Attached File",
    minWidth: 120,
    cell: (info) => {
      const file = info.getValue();
      if (!file) return "-";
      return (
        <a 
          href={file} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
          onClick={(e) => e.stopPropagation()}
        >
          View File
        </a>
      );
    },
    enableColumnFilter: false, // Filtering not useful for file links
  },
  {
    accessorKey: "disposedDate",
    header: "Disposed Date",
    minWidth: 150,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return "-";
      }
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
    minWidth: 120,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "order",
    header: "Order",
    minWidth: 100,
    cell: (info) => info.getValue() || "-",
    enableColumnFilter: true,
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    minWidth: 150,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return "-";
      }
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "Checkin",
    header: "Checkin / Checkout",
    minWidth: 150,
    cell: (info) => {
      const rowData = info.row.original;
      const { serialNumber, status } = rowData;

      const navigateToCheckAsset = (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        const targetUrl =
          status === "Deployed"
            ? `/stocks/checkin?SerialNumber=${serialNumber}`
            : `/stocks/checkout?SerialNumber=${serialNumber}`;

        window.location.href = targetUrl;
      };

      return (
        <button
          className={`${
            status === "Deployed"
              ? "bg-green-600 hover:bg-green-800"
              : "bg-blue-600 hover:bg-blue-800"
          } text-white px-3 py-1 text-sm rounded-lg shadow-sm transition duration-300`}
          onClick={(e) => navigateToCheckAsset(e)}
        >
          {status === "Deployed" ? "Checkin" : "Checkout"}
        </button>
      );
    },
    enableColumnFilter: false, // Not filterable
    enableSorting: false, // Not sortable
  },
  {
    accessorKey: "action",
    header: "Action",
    minWidth: 150,
    cell: (info) => {
      const rowData = info.row.original;
      const { serialNumber } = rowData;
      
      const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/stocks/edit?SerialNumber=${serialNumber}`;
      };
      
      const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this asset?")) {
          // Add your delete logic here
          console.log("Delete asset:", serialNumber);
        }
      };
      
      return (
        <div className="flex space-x-2 justify-center">
          <button 
            className="bg-gray-600 text-white p-2 rounded-lg shadow-sm hover:bg-gray-900 transition duration-300"
            onClick={handleEdit}
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button 
            className="bg-red-900 text-white p-2 rounded-lg shadow-sm hover:bg-red-700 transition duration-300"
            onClick={handleDelete}
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      );
    },
    enableColumnFilter: false, // Not filterable
    enableSorting: false, // Not sortable
  }
];

export default columnData;