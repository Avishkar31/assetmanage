import { FaEdit, FaTrash } from "react-icons/fa";
const columnData = [
  {
    accessorKey: "nodeName",
    header: "Node Name",
    minWidth: 150,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
    minWidth: 150,
    cell: (info) => info.getValue()
  },
  // ... other columns ...

  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "type",
    header: "Type",
    minWidth: 100,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "model",
    header: "Model",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "expires",
    header: "Expiration Date",
    minWidth: 150,
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    accessorKey: "category",
    header: "Category",
    minWidth: 100,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "status",
    header: "Status",
    minWidth: 100,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "department",
    header: "Department",
    minWidth: 130,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "issueTo",
    header: "Issued To",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "defaultLocation",
    header: "Default Location",
    minWidth: 150,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "costCenter",
    header: "Cost Center",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    minWidth: 150,
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    accessorKey: "assetOwner",
    header: "Asset Owner",
    minWidth: 130,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "condition",
    header: "Condition",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "storeLocation",
    header: "Store Location",
    minWidth: 130,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "killdiskDate",
    header: "Killdisk Date",
    minWidth: 150,
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    accessorKey: "attachedFile",
    header: "Attached File",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "disposedDate",
    header: "Disposed Date",
    minWidth: 150,
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
    minWidth: 120,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "order",
    header: "Order",
    minWidth: 100,
    cell: (info) => info.getValue()
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    minWidth: 150,
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    accessorKey: "Checkin",
    header: "Checkin / Checkout",
    minWidth: 150,
    cell: (info) => {
      const rowData = info.row.original;  
      const status = rowData.status;  
      const navigateToCheckAsset=()=>{
        //@avishkar
        // navigate
        // .../stock?SerialNumber="rowData.serilnumner"
      }
      return (
        <button
          className={`${
            info.getValue() === "Checkin"
              ? "bg-green-600 hover:bg-green-800"
              : "bg-red-600 hover:bg-red-800"
          } text-white p-2 rounded-lg shadow-sm transition duration-300`}
          onClick={navigateToCheckAsset}
        >
          {status === "Deployed" ? "Checkin" : "Checkout"}
        </button>
      );
    },
  },  
  {
    accessorKey: "action",
    header: "Action",
    minWidth: 150,
    cell: () => (
      <div className="flex space-x-2 justify-center">
        <button className="bg-gray-600 text-white p-2 rounded-lg shadow-sm hover:bg-gray-900 transition duration-300">
          <FaEdit className="w-5 h-5" />
        </button>
        <button className="bg-red-900 text-white p-2 rounded-lg shadow-sm hover:bg-red-700 transition duration-300">
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    )
  }
];
export default columnData