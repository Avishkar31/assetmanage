import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import React from "react";
import testData from "./testData"; // Replace with your actual data source

function AssetTable() {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [sorting, setSorting] = React.useState([]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "nodeName",
        header: "Node Name", // Custom header for nodeName
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "serialNumber",
        header: "Serial Number", // Custom header for serialNumber
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "manufacturer",
        header: "Manufacturer", // Custom header for manufacturer
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "type",
        header: "Type", // Custom header for type
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "model",
        header: "Model", // Custom header for model
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "expires",
        header: "Expiration Date", // Custom header for expires
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      },
      {
        accessorKey: "category",
        header: "Category", // Custom header for category
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "status",
        header: "Status", // Custom header for status
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "department",
        header: "Department", // Custom header for department
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "issueTo",
        header: "Issued To", // Custom header for issueTo
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "note",
        header: "Notes", // Custom header for note
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "defaultLocation",
        header: "Default Location", // Custom header for defaultLocation
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "costCenter",
        header: "Cost Center", // Custom header for costCenter
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "receivedDate",
        header: "Received Date", // Custom header for receivedDate
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      },
      {
        accessorKey: "assetOwner",
        header: "Asset Owner", // Custom header for assetOwner
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "condition",
        header: "Condition", // Custom header for condition
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "storeLocation",
        header: "Store Location", // Custom header for storeLocation
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "killdiskDate",
        header: "Killdisk Date", // Custom header for killdiskDate
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      },
      {
        accessorKey: "attachedFile",
        header: "Attached File", // Custom header for attachedFile
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "disposedDate",
        header: "Disposed Date", // Custom header for disposedDate
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      },
      {
        accessorKey: "poNumber",
        header: "PO Number", // Custom header for poNumber
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "order",
        header: "Order", // Custom header for order
        cell: (info) => info.getValue()
      },
      {
        accessorKey: "purchaseDate",
        header: "Purchase Date", // Custom header for purchaseDate
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: () => (
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-2 py-1 rounded">
              Update
            </button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </div>
        )
      }
    ],
    []
  );

  const [data, setData] = React.useState(testData); // Use your actual data here

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽"
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10) // Limiting to 10 rows for simplicity
            .map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;
