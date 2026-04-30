import React from "react";
import { Skeleton } from "@mui/material";

const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showSearch = true,
  showPagination = true,
}) => {
  return (
    <div className="bg-white border-2 border-bordercolor rounded-md p-6 w-full space-y-5">
      
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {showSearch && (
          <div className="w-full md:w-[300px]">
            <Skeleton variant="rounded" height={44} />
          </div>
        )}
      </div>

      {/* TABLE */}
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

      {/* PAGINATION */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={120} height={20} />

          <div className="flex items-center gap-2">
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