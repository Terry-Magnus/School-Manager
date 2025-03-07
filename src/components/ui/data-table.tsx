import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: (row: T) => React.ReactNode; // Optional prop to render custom action buttons
}

const DataTable = <T,>({ data, columns, actions }: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 p-2 text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              {actions && (
                <th className="border border-gray-300 p-2">Actions</th>
              )}
              {/* Render Actions header */}
            </tr>
          ))}
        </thead>

        <tbody>
          {data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-gray-300 p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {actions && (
                  <td className="border border-gray-300 p-2">
                    {actions(row.original)}{" "}
                    {/* Render action buttons for each row */}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr className="hover:bg-gray-100">
              <td
                className="border border-gray-300 p-2 text-center"
                colSpan={table.getHeaderGroups()[0]?.headers.length || 1} // Dynamically span all columns
              >
                No data available...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
