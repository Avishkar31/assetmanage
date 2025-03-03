import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import React from "react";
import columnData from "./AssetTableColumn";

function AssetTable({ assetData, filterStatus }) {
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;
  const columns = React.useMemo(() => columnData, []);

  const filteredData = React.useMemo(() => {
    const filteredByStatus = filterStatus
      ? assetData.filter((item) => item.status === filterStatus)
      : assetData;

    return filteredByStatus.filter((item) =>
      Object.keys(item).some((key) => 
        item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, assetData, filterStatus]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleRowNavigations = (rowData) => {
    const currentIndex = filteredData.findIndex(
      (item) => item.serialNumber === rowData.original.serialNumber
    );
    
    // Calculate next page if current item is last in page
    if ((currentIndex + 1) % itemsPerPage === 0) {
      setCurrentPage(Math.floor(currentIndex / itemsPerPage) + 2);
    }

    window.location.href = `/stocks/view?SerialNumber=${rowData.original.serialNumber}`;
  };

  const table = useReactTable({
    columns,
    data: currentItems,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-md">
      <div className="mb-6 " style={{ width: "40%" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800 table-auto">
          <thead className="bg-gray-700 text-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider bg-gray-800 border-b border-gray-600"
                    style={{
                      minWidth: header.column.columnDef.minWidth || "150px",
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-700 transition duration-300"
                onClick={() => handleRowNavigations(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap"
                    style={{
                      minWidth: cell.column.columnDef.minWidth || "150px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav
        className="flex items-center gap-x-1 mt-4 justify-center"
        aria-label="Pagination"
      >
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50"
          aria-label="Previous"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-transparent text-gray-600 py-2 px-3 text-sm rounded-lg ${currentPage === index + 1 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center text-sm rounded-lg border border-transparent text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          aria-label="Next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
