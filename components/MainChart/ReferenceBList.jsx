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
    return [...unique];
  }, [rows]);

  if (referenceBValues.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No ReferenceB values found.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-2">
      <h3 className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-black mb-3 shrink-0 opacity-80">
        Reference B List
      </h3>

      {/* Scrollable List Container */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <ul className="grid grid-cols-3 gap-2 pr-2">
          {/* ALL BUTTON */}
          <li
            key="all"
            onClick={() => onSelectRef(null)}
            className={`px-3 py-1.5 text-xs text-center rounded-lg cursor-pointer transition-all duration-200 border ${selectedRef === null
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
              : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 text-gray-300 hover:border-blue-500/50"
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
                className={`px-3 py-1.5 text-xs text-center rounded-lg cursor-pointer transition-all duration-200 border truncate ${isActive
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                  : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 text-gray-300 hover:border-blue-500/50"
                  }`}
                title={ref}
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
