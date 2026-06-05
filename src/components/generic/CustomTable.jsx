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
import EmptyState from "./EmptyState";
import TableSkeleton from "./TableSkeleton";
import { Pagination } from "@mui/material";

const BREAKPOINT_MAP = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const resolveBreakpoint = (value) => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (!value) {
    return BREAKPOINT_MAP.lg;
  }

  return BREAKPOINT_MAP[value] || value;
};

const useBelowBreakpoint = (breakpoint) => {
  const [isBelow, setIsBelow] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint})`);

    const updateMatch = (event) => setIsBelow(event.matches);

    setIsBelow(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }

    mediaQuery.addListener(updateMatch);
    return () => mediaQuery.removeListener(updateMatch);
  }, [breakpoint]);

  return isBelow;
};

const CustomTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  loadingText = "Cargando...",
  emptyTitle = "Sin registros",
  emptyDescription = "No hay datos aún.",
  mobileBreakpoint = "lg",
  groupBy = null,

  // SEARCH
  searchPlaceholder = "Buscar...",
  searchIcon = <Search />,
  searchInputProps = {},
  toolbarRight = null,

  // FILTROS TIPO PILLS (GENÉRICO)
  // filters = [], // [{ label: "All", value: "all", filterFn: (row) => boolean }]
  // activeFilter,
  // onFilterChange,

  showColumnFilters = false,
  showPagination = true,
  getRowClassName,

  className = "",
}) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);
  const breakpointValue = resolveBreakpoint(mobileBreakpoint);
  const isMobileView = useBelowBreakpoint(breakpointValue);

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

  const rows = table.getRowModel().rows;
  const groupedCountRows = table.getPrePaginationRowModel().rows;
  const groupedRows = React.useMemo(() => {
    if (!groupBy?.getKey) {
      return rows.map((row) => ({ row, isGroupStart: false, groupLabel: "", groupCount: 0 }));
    }

    const counts = new Map();

    groupedCountRows.forEach((row) => {
      const key = groupBy.getKey(row.original, row) ?? "";
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    let previousGroupKey = null;

    return rows.map((row) => {
      const groupKey = groupBy.getKey(row.original, row) ?? "";
      const groupLabel = groupBy.getLabel ? groupBy.getLabel(row.original, row) : String(groupKey);
      const groupCount = counts.get(groupKey) || 0;
      const isGroupStart = previousGroupKey !== groupKey;

      previousGroupKey = groupKey;

      return {
        row,
        isGroupStart,
        groupLabel,
        groupCount,
      };
    });
  }, [groupBy, groupedCountRows, rows]);

  const getColumnLabel = (column) => {
    const header = column.columnDef.header;

    if (typeof header === "string" || typeof header === "number") {
      return header;
    }

    if (column.columnDef?.meta?.label) {
      return column.columnDef.meta.label;
    }

    if (column.id === "actions") {
      return "Acciones";
    }

    return column.id;
  };

  const hasNoData = !data.length;
  const hasNoFilteredRows = data.length > 0 && rows.length === 0;

  if (loading) {
    return <TableSkeleton loadingText={loadingText} mobileBreakpoint={mobileBreakpoint} />;
  }

  return (
    <div
      className={`border-bordercolor w-full space-y-5 rounded-md border-2 bg-white p-6 ${className}`}
    >
      {/* {title ? <h3 className="text-lg font-bold text-gray-800">{title}</h3> : null} */}

      {/* HEADER SUPERIOR */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* SEARCH */}
        <div className="w-full md:w-75">
          <label className="border-bordercolor flex w-full max-w-xl cursor-text items-center rounded-xl border-2 bg-gray-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-gray-400">{searchIcon}</span>

            <input
              {...searchInputProps}
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="ml-3 w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </label>
        </div>

        {toolbarRight && <div className="w-full md:w-auto">{toolbarRight}</div>}
      </div>

      {/* TABLA DESKTOP */}
      {!isMobileView && (
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
                      className="cursor-pointer bg-black px-6 py-4 text-left font-semibold tracking-wider text-white uppercase select-none"
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}

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
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder="Filtrar..."
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:ring-2 focus:ring-gray-200 focus:outline-none"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            {/* BODY */}
            <tbody>
              {hasNoData ? (
                <tr>
                  <td colSpan={table.getVisibleLeafColumns().length} className="px-6 py-10">
                    <EmptyState title={emptyTitle} description={emptyDescription} type="search" />
                  </td>
                </tr>
              ) : hasNoFilteredRows ? (
                <tr>
                  <td colSpan={table.getVisibleLeafColumns().length} className="px-6 py-10">
                    <EmptyState title={emptyTitle} description={emptyDescription} type="search" />
                  </td>
                </tr>
              ) : (
                groupedRows.map(({ row, isGroupStart, groupLabel, groupCount }) => {
                  const rowClassName = getRowClassName
                    ? getRowClassName(row, { isGroupStart, groupLabel, groupCount })
                    : "";

                  return (
                    <React.Fragment key={row.id}>
                      {groupBy?.getKey && isGroupStart && (
                        <tr className="bg-gray-50">
                          <td
                            colSpan={table.getVisibleLeafColumns().length}
                            className="border-t-4 border-black px-6 py-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                                {groupLabel}
                              </span>
                              {/* <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"> */}
                              <span className="text-xs font-semibold text-gray-900">
                                {groupCount} elementos
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr
                        className={`border-t border-gray-100 transition hover:bg-gray-50 ${rowClassName}`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-5 py-3 wrap-anywhere text-gray-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TARJETAS MOBILE */}
      {isMobileView && (
        <div className="space-y-3">
          {hasNoData || hasNoFilteredRows ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8">
              <EmptyState title={emptyTitle} description={emptyDescription} type="search" />
            </div>
          ) : (
            groupedRows.map(({ row, isGroupStart, groupLabel, groupCount }) => {
              const rowClassName = getRowClassName
                ? getRowClassName(row, { isGroupStart, groupLabel, groupCount })
                : "";

              return (
                <React.Fragment key={row.id}>
                  {groupBy?.getKey && isGroupStart && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                          {groupLabel}
                        </span>
                        {/* <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"> */}
                        <span className="text-xs font-semibold text-gray-900">
                          {groupCount} elementos
                        </span>
                      </div>
                    </div>
                  )}

                  <article
                    className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${rowClassName}`}
                  >
                    <div className="space-y-3">
                      {row.getVisibleCells().map((cell) => {
                        const isActionsCell = cell.column.id === "actions";

                        if (isActionsCell) {
                          return (
                            <div
                              key={cell.id}
                              className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          );
                        }

                        return (
                          <div key={cell.id} className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                              {getColumnLabel(cell.column)}
                            </span>

                            <div className="max-w-[60%] text-right text-sm font-medium text-gray-700">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </React.Fragment>
              );
            })
          )}
        </div>
      )}

      {/* PAGINACIÓN PRO */}
      {showPagination && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* INFO */}
          <span className="text-sm text-gray-400">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          {/* CONTROLES */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Anterior
            </button>

            {/* PAGINACIÓN */}
            {showPagination && table.getPageCount() > 0 && (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* <span className="text-sm text-gray-400">
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span> */}

                <Pagination
                  count={table.getPageCount()}
                  page={table.getState().pagination.pageIndex + 1}
                  onChange={(_, page) => table.setPageIndex(page - 1)}
                  siblingCount={1}
                  boundaryCount={1}
                  shape="rounded"
                  size={isMobileView ? "small" : "medium"}
                  showFirstButton={!isMobileView}
                  showLastButton={!isMobileView}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#000 !important",
                      color: "#fff",
                    },
                  }}
                />
              </div>
            )}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-40"
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
  mobileBreakpoint: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  searchPlaceholder: PropTypes.string,
  searchIcon: PropTypes.element,
  searchInputProps: PropTypes.object,
  toolbarRight: PropTypes.node,

  filters: PropTypes.array,
  activeFilter: PropTypes.any,
  onFilterChange: PropTypes.func,
  groupBy: PropTypes.shape({
    getKey: PropTypes.func.isRequired,
    getLabel: PropTypes.func,
  }),

  showColumnFilters: PropTypes.bool,
  showPagination: PropTypes.bool,
  getRowClassName: PropTypes.func,
  className: PropTypes.string,
};

export default CustomTable;
