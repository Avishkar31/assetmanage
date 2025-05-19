import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import columnData from "./AssetTableColumn";

function AssetTable({ assetData, filterStatus }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const columns = useMemo(() => columnData, []);
  const statusFilteredData = useMemo(() => {
    return filterStatus
      ? assetData.filter((item) => item.status === filterStatus)
      : assetData;
  }, [assetData, filterStatus]);

  const filterRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const table = useReactTable({
    columns,
    data: statusFilteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
    },
    manualPagination: false,
    debugTable: false,
  });

  // Handle row click to navigate to detail view
  const handleRowClick = (row) => {
    window.location.href = `/stocks/view?SerialNumber=${row.original.serialNumber}`;
  };

  const handleColumnFilter = (columnId, value) => {
    if (value) {
      setColumnFilters(prev => {
        const existing = prev.find(filter => filter.id === columnId);
        if (existing) {
          return prev.map(filter => 
            filter.id === columnId ? { ...filter, value } : filter
          );
        }
        return [...prev, { id: columnId, value }];
      });
      
      setActiveFilters(prev => ({ ...prev, [columnId]: value }));
    } else {
      setColumnFilters(prev => prev.filter(filter => filter.id !== columnId));
      setActiveFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[columnId];
        return newFilters;
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setActiveFilters({});
  };

  // Calculate pagination information
  const totalItems = table.getFilteredRowModel().rows.length;
  const pageCount = Math.ceil(totalItems / pagination.pageSize) || 1;
  const currentPage = pagination.pageIndex + 1;
  const startItem = totalItems === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endItem = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems);

  return (
    <div className="bg-gradient-to-b from-[#1e2433] to-[#1a1e2b] rounded-lg shadow-lg w-full border border-gray-700/50">
      {/* Search and filter controls */}
      <div className="p-4 border-b border-gray-700/70">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assets..."
              value={globalFilter || ""}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-600/70 rounded-md bg-gray-800/80 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {Object.keys(activeFilters).length > 0 && (
              <button 
                onClick={clearAllFilters}
                className="px-3 py-2 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1"
              >
                <span>Clear All</span>
                <span className="sr-only">Clear all filters</span>
              </button>
            )}
            
            <div className="relative ml-auto sm:ml-0" ref={filterRef}>
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/80 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors"
              >
                <Filter size={14} />
                <span>Filters</span>
                {Object.keys(activeFilters).length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-gray-800 border border-gray-700 rounded-md shadow-xl z-20">
                  <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-sm text-gray-300">Filter by column</h3>
                    {Object.keys(activeFilters).length > 0 && (
                      <button 
                        onClick={clearAllFilters}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {table.getAllColumns()
                      .filter(column => column.getCanFilter())
                      .map(column => (
                        <div key={column.id} className="p-3 border-b border-gray-700/50">
                          <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            {column.columnDef.header}
                          </label>
                          <input
                            type="text"
                            value={activeFilters[column.id] || ""}
                            onChange={e => handleColumnFilter(column.id, e.target.value)}
                            placeholder={`Filter ${column.columnDef.header}...`}
                            className="w-full px-3 py-1.5 text-sm bg-gray-700/50 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Active filters display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([columnId, value]) => {
              const columnName = table.getColumn(columnId)?.columnDef?.header || columnId;
              return (
                <div key={columnId} className="inline-flex items-center bg-blue-900/40 hover:bg-blue-900/60 text-blue-100 text-xs rounded-full px-3 py-1 border border-blue-500/30 transition-colors">
                  <span className="mr-1 font-medium">{columnName}:</span>
                  <span>{value}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColumnFilter(columnId, "");
                    }}
                    className="ml-2 hover:text-white"
                    aria-label={`Remove ${columnName} filter`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-700 bg-[#1e2433]/80"
                    style={{
                      width: header.column.columnDef.size || "auto",
                      minWidth: header.column.columnDef.minWidth || 
                        (header.column.id === 'actions' ? '80px' : '100px'),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center hover:text-white transition-colors"
                            : "flex items-center"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="inline-block ml-1">
                        {{
                          asc: <ChevronUp className="h-3 w-3" />,
                          desc: <ChevronDown className="h-3 w-3" />
                        }[header.column.getIsSorted()] ?? (
                          header.column.getCanSort() ? 
                            <ChevronDown className="h-3 w-3 opacity-20" /> : 
                            null
                        )}
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-800/60 cursor-pointer border-b border-gray-800/70 transition-colors"
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Determine if this column should wrap text
                    const shouldWrap = ['description', 'notes', 'comments'].includes(cell.column.id);
                    
                    return (
                      <td
                        key={cell.id}
                        className={`px-4 py-2.5 text-xs text-gray-300 ${
                          shouldWrap ? 'break-words' : 'whitespace-nowrap'
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination UI */}
      <div className="px-4 py-3 border-t border-gray-700/70 bg-[#1a1e2b] rounded-b-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            {totalItems > 0 ? (
              <span>
                Showing <span className="font-medium text-gray-300">{startItem}</span> to{" "}
                <span className="font-medium text-gray-300">{endItem}</span> of{" "}
                <span className="font-medium text-gray-300">{totalItems}</span> results
              </span>
            ) : (
              <span>No results</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              aria-label="Rows per page"
            >
              {[10, 20, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per page
                </option>
              ))}
            </select>
            
            <div className="flex items-center rounded-md overflow-hidden border border-gray-700">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                aria-label="First page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
              
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="px-3 py-1.5 bg-gray-800 text-xs font-medium text-gray-300 border-l border-r border-gray-700">
                {currentPage} / {pageCount}
              </div>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage() || pageCount <= 1}
                className="p-1.5 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                aria-label="Last page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetTable;