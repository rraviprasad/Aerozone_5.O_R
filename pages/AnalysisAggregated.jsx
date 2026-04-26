
import React, { useEffect, useState } from 'react'
import DataTable2 from '../components/AnalysisAggregated/DataTable';
import Filters from '../components/AnalysisAggregated/Filter22';
import TypeCubeScene from '../components/AnalysisAggregated/Typecubescence';
import PieCharts from '../components/AnalysisAggregated/PieChart';
import RateSummary from '../components/AnalysisAggregated/RateSummary';
import YearTotalQty from '../components/AnalysisAggregated/YearTotalQty';
import SupplierPieChart from '../components/AnalysisAggregated/SupplierPieChart';




const ZoomIcon = ({ width = 18, height = 18, stroke = "#fff" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);


const Analysis2 = ({ setDataLoading }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedRef, setSelectedRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [zoomActive, setZoomActive] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    itemCode: "",
    projectCode: "",
    description: "",
    refStart: "",
    refEnd: "",
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";

    const fetchData = async () => {
      if (setDataLoading) setDataLoading(true);
      try {
        setLoading(true);

        if (!isReload) {
          const cachedData = localStorage.getItem("analysisData");
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setRows(parsed);
            setFilteredRows(parsed);
            setLoading(false);
            if (setDataLoading) setDataLoading(false);
            return;
          }
        }

        const res = await fetch("/api/data/analysistwo");
        const data = await res.json();

        localStorage.setItem("analysisData", JSON.stringify(data));
        setRows(data);
        setFilteredRows(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
        if (setDataLoading) setDataLoading(false);
      }
    };
    fetchData();
  }, []);


  const findRowValue = (row, keys) => {
    for (const key of keys) {
      if (row[key] != null && row[key] !== "") {
        return row[key];
      }
    }
    return null;
  };

  const applyFilters = () => {
    const { search, itemCode, description, refStart, refEnd, projectCode } = filters;

    const searchTerms = String(search || "")
      .split(/[, ]+/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const start = parseFloat(refStart);
    const end = parseFloat(refEnd);
    const refFilterActive = !isNaN(start) || !isNaN(end);

    const searchableFields = [
      "ProjectCode",
      "ItemCode",
      "ItemShortDescription",
      "Description",
      "ReferenceB",
      "REF_B",
      "Reference B",
      "Reference_B",
      "REFB",
      "Reference"
    ];

    const escapeRegExp = (str) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const filterRow = (row) => {
      if (!row) return false;
      if (itemCode && String(row.ItemCode || "").trim() !== itemCode.trim()) {
        return false;
      }
      if (projectCode && String(row.ProjectCode).trim() !== projectCode.trim()) {
        return false;
      }

      if (description) {
        const desc = (
          row.ItemShortDescription ||
          row.Description ||
          ""
        ).toLowerCase();

        if (!desc.includes(description.toLowerCase())) return false;
      }

      if (refFilterActive) {
        const refStr = findRowValue(row, [
          "ReferenceB",
          "REF_B",
          "Reference B",
          "Reference_B",
          "REFB",
          "Reference"
        ]);

        const refVal = refStr
          ? parseFloat(String(refStr).replace(/[^0-9.\-]/g, ""))
          : NaN;

        if (isNaN(refVal)) return false;
        if (!isNaN(start) && refVal < start) return false;
        if (!isNaN(end) && refVal > end) return false;
      }

      // Split into OR groups
const searchGroups = String(search || "")
  .split(",")
  .map(group =>
    group
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(t => t.toLowerCase())
  )
  .filter(group => group.length);

      // AND Multi Search on specific fields only
if (searchGroups.length) {

  const rowSearchString = [
    row.ProjectCode,
    row.ItemCode,
    row.Type,
    row.ItemShortDescription,
    row.Description,
    row.ReferenceB,
    row.REF_B,
    row.SupplierName
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesAnyGroup = searchGroups.some(group =>
    group.every(term =>
      rowSearchString.includes(term)
    )
  );

  if (!matchesAnyGroup) return false;
}

      return true;
    };

    setFilteredRows(rows.filter(filterRow));
  };


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveComponent(null);
    }
  };


  const renderZoomedComponent = () => {
    if (!activeComponent) return null;

    const components = {

      dataTable: <DataTable2 rows={filteredRows} />,
    };

    // Special handling for dataTable to show full width
    if (activeComponent === 'dataTable') {
      return (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative w-[98vw] h-[92vh] drop-shadow-2xl">
            <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-[1px] clip-angled h-full">
              <div className="bg-[#111111] clip-angled w-full h-full overflow-auto relative">

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 bg-purple-600 clip-angled w-10 h-10 flex items-center justify-center text-white transition-transform duration-200 hover:scale-[1.05]"
                  onClick={() => setActiveComponent(null)}
                >
                  ×
                </button>

                {/* ✅ Force full width & height */}
                <div className="w-full h-full overflow-auto p-6">
                  <DataTable2
                    rows={filteredRows}

                    fullView={true}   // <--- add this prop
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative max-w-2xl w-full max-h-[90vh] drop-shadow-2xl">
          <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-[1px] clip-angled h-full">
            <div className="bg-[#111111] clip-angled p-6 w-full h-full overflow-auto transform transition-all duration-300 scale-100">
              <div className="relative">
                <button
                  className="absolute -top-2 -right-2 bg-purple-600 clip-angled w-8 h-8 flex items-center justify-center text-white transition-transform duration-200 hover:scale-[1.05]"
                  onClick={() => setActiveComponent(null)}
                >
                  ×
                </button>
                {components[activeComponent]}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-6 text-purple-400">Loading Orbit Data…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  return (
    <div
      className={`dark bg-black text-[var(--color-foreground)] transition-colors duration-300 relative ${activeComponent ? 'overflow-hidden' : ''} min-h-screen`}
      style={{
        "--primary": "oklch(0.55 0.25 295)", // Purple override
        "--color-primary": "oklch(0.55 0.25 295)"
      }}
    >


      {renderZoomedComponent()}

      {/* ── Main content: fills viewport below navbar ── */}
      <div
        className={`pt-1 px-2 sm:px-3 lg:px-3 pb-1 transition-all duration-300 ${activeComponent ? 'blur-sm' : ''} flex flex-col`}
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* Filter Bar */}
        <div className="mb-1 shrink-0">
          <Filters
            title="Analysis 2"
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            rows={rows}
          />
        </div>

        {/* Title + Cube row */}
        

        {/* Charts row — grows to fill available space, no scroll */}
        <div className="flex justify-center gap-3 mb-2 shrink-0" style={{ height: '220px' }}>
          {/* Pie + Project breakdown */}
          <div className="w-fit">
            <PieCharts rows={filteredRows} />
          </div>
           <div className="h-[100%] w-[200px]">
            <TypeCubeScene rows={filteredRows} />
          </div>

          {/* Rate + Year summaries stacked */}
          <div className="flex flex-col gap-2 w-[200px] shrink-0 overflow-hidden">
            <RateSummary rows={filteredRows} />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <YearTotalQty rows={filteredRows} />
            </div>
          </div>

          {/* Supplier pie */}
          <div className="shrink-0">
            <SupplierPieChart rows={filteredRows} />
          </div>
        </div>

        {/* DataTable — takes remaining height */}
        <div className="flex-1 min-h-0 bg-[var(--color-muted)] p-1.5 rounded-[var(--radius)] shadow-md relative flex flex-col overflow-hidden">
          {/* Zoom Button */}
          <div className="flex justify-end absolute top-2 right-2 z-10">
            <button
              className="p-1.5 bg-purple-600 rounded-[var(--radius)] text-white transition-transform duration-200 hover:scale-[1.05]"
              title="Zoom Table"
              onClick={() => setActiveComponent("dataTable")}
            >
              <ZoomIcon width={14} height={14} />
            </button>
          </div>

          <div className="w-full h-full">
            <DataTable2
              rows={filteredRows}
              fullView={activeComponent === "dataTable"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis2
