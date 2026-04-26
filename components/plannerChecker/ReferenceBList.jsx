import React, { useMemo } from "react";

export default function ReferenceBList({ rows, selectedRef, onSelectRef }) {
  // Extract unique ReferenceB values from current filtered rows
  const referenceBValues = useMemo(() => {
    const unique = new Set();
    rows.forEach((r) => {
      const ref = String(r.ReferenceB || "").trim();
      if (ref && ref !== "N/A" && ref !== "NA" && ref !== "0") {
        unique.add(ref);
      }
    });
    // Sort logically
    return [...unique].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [rows]);

  if (referenceBValues.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No ReferenceB values found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-[var(--card)] w-full  rounded-lg shadow border  border-[var(--border)]">
      <h3 className="text-xs font-semibold mb-1 text-[var(--foreground)]">
        Reference B List
      </h3>

      {/* Scrollable List Container */}
      <div className="max-h-12 overflow-y-auto scrollbar-hide pr-1">
        <ul className="grid grid-cols-4 gap-2">
          {/* ALL BUTTON */}
          <li
            onClick={() => onSelectRef(null)}
            className={`px-3 py-1 text-xs text-center rounded cursor-pointer transition ${selectedRef === null
                ? "bg-blue-600 text-white"
                : "bg-gray-50 hover:bg-blue-300 text-[var(--foreground)] dark:text-white dark:bg-gray-700 dark:hover:bg-blue-400"
              }`}
          >
          All
          </li>

          {/* Dynamic ReferenceB Values */}
          {referenceBValues.map((ref, i) => {
            const isActive = selectedRef === ref;
            return (
              <li
                key={i}
                onClick={() => onSelectRef(isActive ? null : ref)}
                className={`px-2 py-1 text-[10px] sm:text-xs text-center rounded cursor-pointer transition flex items-center justify-center min-h-[28px] leading-tight ${isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 hover:bg-blue-300 text-[var(--foreground)] dark:text-white dark:bg-gray-700 dark:hover:bg-blue-400"
                  }`}
              >
                {ref}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
