import React, { useMemo, useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";

// Debounce Hook
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Magnet Apply Button Icon
const Magnet = ({ width = 28, height = 28, strokeWidth = 2, stroke = "#ffffff" }) => {
  const controls = useAnimation();
  return (
    <div
      style={{ cursor: "pointer", userSelect: "none", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width} height={height} viewBox="0 0 24 24"
        fill="none" stroke={stroke} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"
        variants={{
          normal: { scale: 1, rotate: 0, y: 0 },
          animate: { scale: [1, 1.04, 1], rotate: [0, -8, 8, -8, 0], y: [0, -2, 0], transition: { duration: 0.6, ease: "easeInOut" } },
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

// Filter icon for mobile toggle
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// Chevron icon
const ChevronIcon = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function Filters({ filters, setFilters, applyFilters, rows }) {
  const { search, projectCode, itemCode, description, refStart, refEnd } = filters;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Debounced fields
  const debouncedSearch = useDebounce(search);
  const debouncedDescription = useDebounce(description);

  useEffect(() => {
    setFilters(f => ({ ...f, search: debouncedSearch, description: debouncedDescription }));
  }, [debouncedSearch, debouncedDescription, setFilters]);

  const itemCodes = useMemo(
    () => [...new Set(rows.map((r) => r.ItemCode || r.ITEM_CODE))].filter(Boolean),
    [rows]
  );
  const projectCodes = useMemo(
    () => [...new Set(rows.map((r) => r.ProjectCode || r.PROJECT_NO))].filter(Boolean),
    [rows]
  );

  const inputClass = "w-full px-3 py-2 md:py-1.5 rounded-full border border-gray-600/40 bg-[var(--color-card)] text-[var(--color-foreground)] text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all";

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
    setMobileOpen(false); // close panel after apply on mobile
  };

  return (
    <div className="w-full px-2 py-1.5">

      {/* ===== DESKTOP FILTER BAR (md and up) ===== */}
      <div className="hidden md:flex flex-row items-center justify-between w-full gap-4">
        {/* Logo/Title Section */}
        <a href="/" className="flex-shrink-0 group">
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent uppercase transition-all duration-300 group-hover:from-blue-300 group-hover:to-blue-500">
            PLANER CHECKER
          </h1>
        </a>

        {/* Filters Pill - The "Dynamic Center-Right" part */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/50 p-1 rounded-full backdrop-blur-md shadow-inner transition-all duration-300 hover:border-zinc-700/50 ml-auto">
            <input
              type="text"
              placeholder="🔍 Search"
              value={search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="bg-transparent border-none text-[var(--color-foreground)] text-xs h-8 px-3 w-32 focus:outline-none focus:ring-0 placeholder-gray-600 font-medium"
            />
            
            <div className="h-4 w-[1px] bg-zinc-800"></div>

            <select
              value={projectCode}
              onChange={(e) => setFilters(f => ({ ...f, projectCode: e.target.value }))}
              className="bg-transparent border-none text-[var(--color-foreground)] text-[11px] h-8 px-2 w-32 focus:outline-none focus:ring-0 cursor-pointer text-gray-400 font-medium"
            >
              <option value="" className="bg-zinc-900">Project Code</option>
              {projectCodes.map(pc => <option key={pc} value={pc} className="bg-zinc-900">{pc}</option>)}
            </select>

            <div className="h-4 w-[1px] bg-zinc-800"></div>

            <select
              value={itemCode}
              onChange={(e) => setFilters(f => ({ ...f, itemCode: e.target.value }))}
              className="bg-transparent border-none text-[var(--color-foreground)] text-[11px] h-8 px-2 w-32 focus:outline-none focus:ring-0 cursor-pointer text-gray-400 font-medium"
            >
              <option value="" className="bg-zinc-900">Item Code</option>
              {itemCodes.map(ic => <option key={ic} value={ic} className="bg-zinc-900">{ic}</option>)}
            </select>

            <div className="h-4 w-[1px] bg-zinc-800"></div>

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setFilters(f => ({ ...f, description: e.target.value }))}
              className="bg-transparent border-none text-[var(--color-foreground)] text-[11px] h-8 px-3 w-28 focus:outline-none focus:ring-0 placeholder-gray-600 font-medium"
            />

            <div className="h-4 w-[1px] bg-zinc-800"></div>

            <div className="flex items-center gap-1 px-2">
              <input
                type="number"
                placeholder="Start"
                value={refStart}
                onChange={(e) => setFilters(f => ({ ...f, refStart: e.target.value }))}
                className="bg-transparent border-none text-[var(--color-foreground)] text-[11px] h-8 w-14 focus:outline-none focus:ring-0 placeholder-gray-600 text-center font-medium"
              />
              <span className="text-zinc-700 text-[10px]">-</span>
              <input
                type="number"
                placeholder="End"
                value={refEnd}
                onChange={(e) => setFilters(f => ({ ...f, refEnd: e.target.value }))}
                className="bg-transparent border-none text-[var(--color-foreground)] text-[11px] h-8 w-14 focus:outline-none focus:ring-0 placeholder-gray-600 text-center font-medium"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full h-8 w-8 transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95 group/submit"
            >
              <Magnet stroke="#fff" width={14} height={14} />
            </button>
          </div>
        </form>
      </div>

      {/* ===== MOBILE FILTER BAR (below md) ===== */}
      <div className="md:hidden w-full">
        {/* Compact trigger row */}
        <div className="flex items-center gap-2">
          {/* Search always visible */}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className={inputClass + " flex-1"}
            />
            <button type="submit"
              className="flex-shrink-0 flex items-center justify-center bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-full h-9 w-9 shadow-md transition hover:opacity-90">
              <Magnet stroke="var(--color-primary-foreground)" width={16} height={16} />
            </button>
          </form>
          {/* Filter toggle button */}
          <button
            type="button"
            onClick={() => setMobileOpen(p => !p)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 h-9 rounded-full border text-sm font-medium transition-all duration-200
              ${mobileOpen
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-[var(--color-card)] border-gray-600/40 text-gray-400 hover:text-white"
              }`}
          >
            <FilterIcon />
            <ChevronIcon open={mobileOpen} />
          </button>
        </div>

        {/* Expandable filters panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[400px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <select value={projectCode} onChange={(e) => setFilters(f => ({ ...f, projectCode: e.target.value }))}
                className={inputClass}>
                <option value="">All Projects</option>
                {projectCodes.map(pc => <option key={pc} value={pc}>{pc}</option>)}
              </select>
              <select value={itemCode} onChange={(e) => setFilters(f => ({ ...f, itemCode: e.target.value }))}
                className={inputClass}>
                <option value="">All Items</option>
                {itemCodes.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Description" value={description}
              onChange={(e) => setFilters(f => ({ ...f, description: e.target.value }))}
              className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Ref B Start" value={refStart}
                onChange={(e) => setFilters(f => ({ ...f, refStart: e.target.value }))}
                className={inputClass} />
              <input type="number" placeholder="Ref B End" value={refEnd}
                onChange={(e) => setFilters(f => ({ ...f, refEnd: e.target.value }))}
                className={inputClass} />
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-2.5 rounded-full text-sm font-semibold shadow-md hover:opacity-90 transition">
              <Magnet stroke="var(--color-primary-foreground)" width={16} height={16} />
              Apply Filters
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
