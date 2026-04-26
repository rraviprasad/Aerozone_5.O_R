import React, { useEffect, useState } from "react";
import UploadForm from "../components/MainChart/UploadForm";
import DataTable from "../components/MainChart/DataTable";
import PieCharts from "../components/MainChart/PieChart";
import LineChart from "../components/MainChart/LineChart";
import Filters from "../components/MainChart/Filter";
import BarChart from "../components/MainChart/BarChart";

// Navbar is now global in App.jsx


// ThemeToggle component



const MainChart = ({ setDataLoading }) => {
  const [rows, setRows] = useState([]);
  const [indentRows, setIndentRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredIndentRows, setFilteredIndentRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);


  const [filters, setFilters] = useState({
    search: "",
    projectCode: "",
    itemCode: "",
    description: "",
  });

  // 🔹 Fetch data ONCE
  useEffect(() => {
    const fetchData = async () => {
      if (setDataLoading) setDataLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          fetch("/api/data/get-data"),
          fetch("/api/data/get-indent")
        ]);

        if (!res1.ok || !res2.ok) throw new Error("Backend Error");

        const excelData = await res1.json();
        const indentData = await res2.json();

        // Check for empty data or quota error response that might come as JSON
        if (excelData.error || indentData.error) throw new Error("API Error");

        setRows(excelData);
        setFilteredRows(excelData);

        setIndentRows(indentData);
        setFilteredIndentRows(indentData);
      } catch (err) {
        console.warn("Backend Error:", err);
        setRows([]);
        setFilteredRows([]);
        setIndentRows([]);
        setFilteredIndentRows([]);
      } finally {
        if (setDataLoading) setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Strict Exact-Match Filtering Logic (Search, ProjectCode, ItemCode, Description)
  const applyFilters = () => {
    const { search, projectCode, itemCode, description } = filters;

    // ✅ Normalize helper (trim + lowercase + remove spaces)
    const normalize = (v) =>
      String(v ?? "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .trim();

    // ✅ Split search terms by comma or space, normalize them
    const searchTerms = String(search || "")
      .split(/[, ]+/)
      .map((s) => normalize(s))
      .filter(Boolean);

    // ✅ Define searchable fields
    const searchableFields = [
      "ProjectCode",
      "ItemCode",
      "Description",
      "ItemShortDescription",
      "ITEM_DESCRIPTION",
    ];

    const filterFn = (row) => {
      // ✅ Exact ItemCode match
      if (itemCode) {
        const rowItem = normalize(row.ItemCode);
        if (rowItem !== normalize(itemCode)) return false;
      }

      // ✅ Exact ProjectCode match
      if (projectCode) {
        const rowProject = normalize(row.ProjectCode || row.PROJECT_NO);
        if (rowProject !== normalize(projectCode)) return false;
      }

      // ✅ Exact Description match
      if (description) {
        const rowDesc = normalize(
          row.Description ||
          row.ItemShortDescription ||
          row.ITEM_DESCRIPTION ||
          ""
        );
        if (rowDesc !== normalize(description)) return false;
      }

      // ✅ Search field: all terms must exactly match some field (case-insensitive)
      if (searchTerms.length > 0) {
        for (const term of searchTerms) {
          let matched = false;

          for (const key of searchableFields) {
            if (!(key in row)) continue;
            const value = row[key];
            if (value == null) continue;

            const text = normalize(value);
            if (text.includes(term)) {
              matched = true;
              break;
            }
          }

          // If any term doesn’t match → reject this row
          if (!matched) return false;
        }
      }

      return true;
    };

    // ✅ Apply filter
    setFilteredRows(rows.filter(filterFn));
    setFilteredIndentRows(indentRows.filter(filterFn));
  };




  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowUploadModal(false);
          }
        }}
      >
        <div className="bg-[var(--color-card)] rounded-[var(--radius)] shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 scale-100">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 bg-[var(--color-secondary)] rounded-full w-8 h-8 flex items-center justify-center text-[var(--color-secondary-foreground)] transition-transform duration-200 hover:scale-[1.05]"
              onClick={() => setShowUploadModal(false)}
            >
              ×
            </button>
            <div >
              <UploadForm setLoading={setLoading} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300 flex flex-col pt-1 px-2 sm:px-4 pb-2 relative" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Navbar is now global in App.jsx */}
      {renderUploadModal()}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[60]">
          <div className="w-16 h-16 border-4 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></div>
          <span className="ml-4 text-white text-xl">Processing data...</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="mb-1 shrink-0">
        <Filters
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          rows={rows}
        />
      </div>

      {/* ===== CHARTS ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-2 shrink-0" style={{ height: '300px' }}>

        {/* Bar Chart - Stock Summary */}
        <div className="bg-[var(--card)] rounded-[var(--radius)] shadow-lg p-1 border border-white/5 lg:col-span-3 h-full overflow-hidden">
          <BarChart rows={filteredRows} />
        </div>

        {/* Pie Charts */}
        <div className="bg-[var(--card)] rounded-[var(--radius)] shadow-lg p-1 border border-white/5 lg:col-span-5 h-full overflow-hidden">
          <PieCharts rows={filteredRows} indentRows={filteredIndentRows} />
        </div>

        {/* Line Chart */}
        <div className="bg-[var(--card)] rounded-[var(--radius)] shadow-lg p-1 border border-white/5 lg:col-span-4 h-full overflow-hidden">
          <LineChart indentRows={filteredIndentRows} />
        </div>

      </div>

      {/* ===== DATA TABLE ===== */}
      <div className="bg-[var(--card)] rounded-[var(--radius)] border border-white/5 shadow-lg p-2 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="w-full flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <DataTable rows={filteredRows} indentRows={filteredIndentRows} onUploadClick={() => setShowUploadModal(true)} />
        </div>
      </div>

    </div>
  );
};

export default MainChart;
