import React from "react";
import PropTypes from "prop-types";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Search } from "@mui/icons-material";
import CustomInput from "./CustomInput";
import EmptyState from "./EmptyState";
import TableSkeleton from "./TableSkeleton";
import SearchIcon from "@mui/icons-material/Search";


const CustomTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  loadingText = "Cargando...",
  emptyTitle = "Sin registros",
  emptyDescription = "No hay datos aún.",

  // SEARCH
  searchPlaceholder = "Buscar...",
  searchIcon = <Search />,
  searchInputProps = {},

  // FILTROS TIPO PILLS (GENÉRICO)
  // filters = [], // [{ label: "All", value: "all", filterFn: (row) => boolean }]
  // activeFilter,
  // onFilterChange,

  showColumnFilters = false,
  showPagination = true,

  className = "",
}) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);

  // Aplicar filtro de pills activo usando la función del filtro
  // const filteredData = React.useMemo(() => {
  //   if (!activeFilter || activeFilter === "all") return data;

  //   const activeFilterObj = filters.find((f) => f.value === activeFilter);
  //   if (!activeFilterObj?.filterFn) return data;

  //   return data.filter((item) => activeFilterObj.filterFn(item));
  // }, [data, activeFilter, filters]);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return (<TableSkeleton />);

  if (!data.length)
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        type="search"
      />
    );

  return (
    <div className={`bg-white border-2 border-bordercolor rounded-md p-6 w-full space-y-5 ${className}`}>
      {/* HEADER SUPERIOR */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* SEARCH */}
        <div className="w-full md:w-[300px]">
          {/* <CustomInput
            {...searchInputProps}
            name="search"
            placeholder={searchPlaceholder}
            icon={searchIcon}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            backgroundColor="#f9fafb"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "44px",
                fontSize: "14px",
                borderRadius: "10px",
              },
            }}
          /> */}

          <label className="border-2 border-bordercolor bg-background flex items-center bg-gray-100 px-4 py-2.5 rounded-xl w-full max-w-xl cursor-text focus-within:ring-2 focus-within:ring-blue-500">
            <SearchIcon className="text-gray-400" />

            <input
              {...searchInputProps}
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </label>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="bg-black text-white px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {/* SORT ICON */}
                      {/* {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted()] ?? (
                          <span className="opacity-20">↑</span>
                        )} */}


                      {{
                        asc: <span className="text-white">↑</span>,
                        desc: <span className="text-white">↓</span>,
                      }[header.column.getIsSorted()] ?? (
                          <span className="text-gray font-bold">↑</span>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}

            {/* COLUMN FILTERS */}
            {showColumnFilters && (
              <tr>
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <th key={header.id} className="px-6 pb-3">
                    {header.column.getCanFilter() && (
                      <input
                        value={header.column.getFilterValue() ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder="Filtrar..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {/* BODY */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-gray-700">
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

      {/* PAGINACIÓN PRO */}
      {showPagination && (
        <div className="flex items-center justify-between">
          {/* INFO */}
          <span className="text-sm text-gray-400">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          {/* CONTROLES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Anterior
            </button>

            {/* NÚMEROS */}
            {Array.from({ length: table.getPageCount() }).map((_, i) => {
              const isActive =
                i === table.getState().pagination.pageIndex;

              return (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`
                    w-8 h-8 rounded-md text-sm
                    ${isActive
                      ? "bg-[#000] text-white"
                      : "border hover:bg-gray-100"
                    }
                  `}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CustomTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,

  searchPlaceholder: PropTypes.string,
  searchIcon: PropTypes.element,
  searchInputProps: PropTypes.object,

  filters: PropTypes.array,
  activeFilter: PropTypes.any,
  onFilterChange: PropTypes.func,

  showColumnFilters: PropTypes.bool,
  showPagination: PropTypes.bool,
  className: PropTypes.string,
};

export default CustomTable;