import React, { useMemo, useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";

// Debounce Hook (New)
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Magnet component
const Magnet = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
}) => {
  const controls = useAnimation();
  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          normal: { scale: 1, rotate: 0, y: 0 },
          animate: {
            scale: [1, 1.04, 1],
            rotate: [0, -8, 8, -8, 0],
            y: [0, -2, 0],
            transition: { duration: 0.6, ease: "easeInOut" },
          },
        }}
        animate={controls}
      >
        <path d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15" />
        <path d="m5 8 4 4" />
        <path d="m12 15 4 4" />
      </motion.svg>
    </div>
  );
};

export default function Filters({ filters, setFilters, applyFilters, rows }) {
  const { search, projectCode, itemCode, description, refStart, refEnd } = filters;

  // ✅ Debounced fields
  const debouncedSearch = useDebounce(search);
  const debouncedDescription = useDebounce(description);

  // Send debounced values to parent filtering logic (but only when applyFilters is clicked)
  useEffect(() => {
    setFilters(f => ({ ...f, search: debouncedSearch, description: debouncedDescription }));
  }, [debouncedSearch, debouncedDescription, setFilters]);

  // ✅ Extract item codes once from rows
  const itemCodes = useMemo(
    () => [...new Set(rows.map((r) => r.ItemCode || r.ITEM_CODE))].filter(Boolean),
    [rows]
  );

  // ✅ Extract project codes once from rows
  const projectCodes = useMemo(
    () => [...new Set(rows.map((r) => r.ProjectCode || r.PROJECT_NO))].filter(Boolean),
    [rows]
  );

  return (
    <div className="py-0 px-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="flex justify-start items-center px-4 w-full min-w-0 gap-3"
      >
        <a href="/" className="shrink-0 mr-6">
          <h1 className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent uppercase whitespace-nowrap">PLANER CHECKER</h1>
        </a>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search"
          value={search}
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          className="flex-1 min-w-[100px] max-w-[200px] px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        {/* Project Code Dropdown */}
        <select
          value={projectCode}
          onChange={(e) => setFilters(f => ({ ...f, projectCode: e.target.value }))}
          className="flex-1 min-w-[120px] max-w-[180px] px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs outline-none transition-all focus:border-blue-500"
        >
          <option value="">All Project Codes</option>
          {projectCodes.map((pc) => (
            <option key={pc} value={pc}>
              {pc}
            </option>
          ))}
        </select>

        {/* Item Code Dropdown */}
        <select
          value={itemCode}
          onChange={(e) => setFilters(f => ({ ...f, itemCode: e.target.value }))}
          className="flex-1 min-w-[120px] max-w-[180px] px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs outline-none transition-all focus:border-blue-500"
        >
          <option value="">All Item Codes</option>
          {itemCodes.map((ic) => (
            <option key={ic} value={ic}>
              {ic}
            </option>
          ))}
        </select>

        {/* Description */}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setFilters(f => ({ ...f, description: e.target.value }))}
          className="flex-1 min-w-[100px] max-w-[200px] px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs transition-all focus:border-blue-500 outline-none"
        />

        {/* Ref Start */}
        <input
          type="number"
          placeholder="Ref B Start"
          value={refStart}
          onChange={(e) => setFilters(f => ({ ...f, refStart: e.target.value }))}
          className="w-24 px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs outline-none transition-all focus:border-blue-500"
        />

        {/* Ref End */}
        <input
          type="number"
          placeholder="Ref B End"
          value={refEnd}
          onChange={(e) => setFilters(f => ({ ...f, refEnd: e.target.value }))}
          className="w-24 px-3 py-1.5 rounded-full border border-gray-300 bg-[var(--background)] text-[var(--foreground)] text-xs outline-none transition-all focus:border-blue-500"
        />

        {/* Apply Button */}
        <button
          type="submit"
          className="shrink-0 flex items-center justify-center bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] p-1.5 rounded-full shadow-md transition-all hover:scale-110 active:scale-95"
        >
          <Magnet stroke="var(--primary-foreground)" width={20} height={20} />
        </button>
      </form>
    </div>
  );
}
