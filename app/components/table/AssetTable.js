import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import React from "react";
import testData from "./testData";

import columnData from "./AssetTableColumn";
// Replace with your actual data source

function AssetTable({ assetData }) {
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const columns = React.useMemo(() => columnData, []);

  const filteredData = React.useMemo(() => {
    return assetData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  return (
    <div className="p-4 overflow-x-auto bg-gray-900 rounded-lg shadow-md">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-700 text-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider bg-gray-800 border-b border-gray-600"
                  style={{
                    minWidth: header.column.columnDef.minWidth,
                    whiteSpace: "nowrap"
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "flex items-center"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <span className="ml-2 text-gray-400">🔼</span>,
                        desc: <span className="ml-2 text-gray-400">🔽</span>
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-800">
          {table
            .getRowModel()
            .rows.slice(0, 10) // Limiting to 10 rows for simplicity
            .map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-700 transition duration-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                    style={{
                      minWidth: cell.column.columnDef.minWidth,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <nav className="flex items-center gap-x-1" aria-label="Pagination">
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Previous"
        >
          <svg
            className="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="sr-only">Previous</span>
        </button>
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            className="min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200 text-gray-600 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            aria-current="page"
          >
            1
          </button>
          <button
            type="button"
            className="min-h-[38px] min-w-[38px] flex justify-center items-center border border-transparent text-gray-600 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            2
          </button>
          <button
            type="button"
            className="min-h-[38px] min-w-[38px] flex justify-center items-center border border-transparent text-gray-600 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            3
          </button>
        </div>
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
          aria-label="Next"
        >
          <span className="sr-only">Next</span>
          <svg
            className="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default AssetTable;
