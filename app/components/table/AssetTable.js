import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import React from "react";
import testData from "./testData";

//custom sorting logic for one of our enum columns
const sortStatusFn = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ["single", "complicated", "relationship"];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

function AssetTable() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState([]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "SerialNumber",
        cell: (info) => info.getValue()
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.lastName,
        id: "manufacturer",
        cell: (info) => info.getValue(),
        header: () => <span>Manufacturer</span>,
        sortUndefined: "manufacturer", //force undefined values to the end
        sortDescFirst: false //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "type",
        header: () => "Type"
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "category",
        header: () => <span>Category</span>,
        sortUndefined: "last" //force undefined values to the end
      },
      {
        accessorKey: "status",
        header: "Status",
        sortingFn: sortStatusFn //use our custom sorting function for this enum column
      },
      {
        accessorKey: "progress",
        header: "Profile Progress"
        // enableSorting: false, //disable sorting for this column
      },
      {
        accessorKey: "rank",
        header: "Rank",
        invertSorting: true //invert the sorting order (golf score-like where smaller is better)
      },
      {
        accessorKey: "createdAt",
        header: "Created At"
        // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
      }
    ],
    []
  );

  const [data, setData] = React.useState(testData);
  const refreshData = () => setData(testData); //stress test with 100k rows

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting
    }
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  });

  //access sorting state from the table instance
  console.log(table.getState().sorting);

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
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
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;
