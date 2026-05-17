import React from "react";
import { Skeleton } from "@mui/material";

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

const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showSearch = true,
  showPagination = true,
  loadingText = "Cargando...",
  mobileBreakpoint = "lg",
}) => {
  const breakpointValue = resolveBreakpoint(mobileBreakpoint);
  const isMobileView = useBelowBreakpoint(breakpointValue);

  return (
    <div className="bg-white border-2 border-bordercolor rounded-md p-6 w-full space-y-5">
      <p className="text-sm font-medium text-gray-400">{loadingText}</p>
      
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {showSearch && (
          <div className="w-full md:w-[300px]">
            <Skeleton variant="rounded" height={44} />
          </div>
        )}
      </div>

      {/* TABLE DESKTOP */}
      {!isMobileView && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton variant="text" width="60%" height={20} />
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t border-gray-100">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <Skeleton variant="text" width="80%" height={18} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      {isMobileView && (
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-3">
                {Array.from({ length: Math.max(2, Math.min(columns, 4)) }).map(
                  (_, j) => (
                    <div
                      key={j}
                      className="flex items-start justify-between gap-4"
                    >
                      <Skeleton variant="text" width="30%" height={18} />
                      <Skeleton variant="text" width="50%" height={18} />
                    </div>
                  )
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
                  <Skeleton variant="rounded" width={36} height={36} />
                  <Skeleton variant="rounded" width={36} height={36} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {showPagination && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Skeleton variant="text" width={120} height={20} />

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={32} height={32} />
            <Skeleton variant="rounded" width={32} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;