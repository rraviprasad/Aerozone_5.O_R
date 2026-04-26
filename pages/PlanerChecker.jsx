// src/pages/PlannerChecker.tsx
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import Filters from "../components/plannerChecker/Filter2";
import * as XLSX from "xlsx";
import DonutChart from "../components/plannerChecker/DonutChart";
import DonutChart2 from "../components/plannerChecker/DonutChart2";
import Uploadfrom2 from "../components/plannerChecker/Uploadfrom2";
import DataTable2 from "../components/plannerChecker/DataTable2";
import Rawmaterial from "../components/plannerChecker/Rawmaterial";
import Baught from "../components/plannerChecker/Baught";
import ReferenceBList from "../components/plannerChecker/ReferenceBList";
import ReceiptBarChart from "../components/plannerChecker/ReciptBarchart";
import ItemInsightsPopup from "../components/plannerChecker/ItemInsightsPopup";
import ProjectNumber from "../components/plannerChecker/ProjectNumber";
import RMSupplier from "../components/plannerChecker/RMSupplier";
import BOISupplier from "../components/plannerChecker/BOISupplier";

// ZoomIcon component
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
    <circle cx="11" cy="11" r="9"></circle>
    <path d="m21 21-4.35-4.35"></path>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);



const PlannerChecker = ({ setDataLoading }) => {
  // State management
  const [rows, setRows] = useState([]);
  const [indentRows, setIndentRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredIndentRows, setFilteredIndentRows] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRef, setSelectedRef] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showItemInsights, setShowItemInsights] = useState(false);
  const [prismRows, setPrismRows] = useState(null);


  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    itemCode: "",
    description: "",
    refStart: "",
    refEnd: "",
  });

  // Animation effect
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAnimationKey((prevKey) => prevKey + 1);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      if (setDataLoading) setDataLoading(true);
      try {
        const [dataRes, indentRes] = await Promise.all([
          fetch("/api/data/get-data"),
          fetch("/api/data/get-indent")
        ]);

        if (!dataRes.ok || !indentRes.ok) {
          console.error("API error:", dataRes.status, indentRes.status);
          return;
        }

        const data = await dataRes.json();
        const indentData = await indentRes.json();

        setRows(Array.isArray(data) ? data : []);
        setFilteredRows(Array.isArray(data) ? data : []);
        setIndentRows(Array.isArray(indentData) ? indentData : []);
        setFilteredIndentRows(Array.isArray(indentData) ? indentData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        if (setDataLoading) setDataLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchPrismData = async () => {
      try {
        const res = await fetch("/api/data/prism");
        const data = await res.json();

        const processed = Array.isArray(data)
          ? data.map(row => ({
            ...row,
            Difference: (Number(row.RequiredQty) || 0) - (Number(row.OrderedQty) || 0),
            OrderStatus:
              (Number(row.RequiredQty) || 0) - (Number(row.OrderedQty) || 0) <= 5
                ? "YES"
                : "NO",
          }))
          : [];

        setPrismRows(processed);
      } catch (err) {
        console.error("PRISM API error:", err);
        setPrismRows([]); // SAFE FALLBACK
      }
    };

    fetchPrismData();
  }, []);



  // Handle component click
  const handleComponentClick = (componentName) => {
    setActiveComponent(componentName);
  };

  // Handle backdrop click to close zoomed view
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveComponent(null);
    }
  };

  // Process uploaded Excel
  const processExcel = async (file) => {
    if (!file) {
      alert("Please upload an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1️⃣ UPLOAD TO BACKEND
      const uploadRes = await fetch("/api/data/upload-excel", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to backend");
      }

      const result = await uploadRes.json();
      console.log("Upload Success:", result);

      // 2️⃣ REFETCH FRESH DATA (Update the UI with new records)
      const [dataRes, indentRes] = await Promise.all([
        fetch("/api/data/get-data"),
        fetch("/api/data/get-indent")
      ]);

      if (dataRes.ok && indentRes.ok) {
        const data = await dataRes.json();
        const indentData = await indentRes.json();
        
        setRows(Array.isArray(data) ? data : []);
        setFilteredRows(Array.isArray(data) ? data : []);
        setIndentRows(Array.isArray(indentData) ? indentData : []);
        setFilteredIndentRows(Array.isArray(indentData) ? indentData : []);
      }

      setShowUploadModal(false);
      alert(`✅ Data updated! ${result.saved} records saved.`);
      
    } catch (err) {
      console.error("Error processing Excel:", err);
      alert("❌ Error updating data. Check console for details.");
    }
  };

  //unique Item code for Rawmaterial and Baught components
  const uniqueItemCount = new Set(
    filteredRows
      .filter(row => String(row.Category
      ).trim().toUpperCase() === "RM")
      .map(row => row.ItemCode)
  ).size;

  const uniqueBOICount = new Set(
    filteredRows
      .filter(row => String(row.Category
      ).trim().toUpperCase() === "BOI")
      .map(row => row.ItemCode)
  ).size;

  // Group suppliers for each RM ItemCode
  const suppliersByRM = useMemo(() => {
    return filteredRows
      .filter(row => String(row.Category
      ).trim().toUpperCase() === "RM")
      .reduce((acc, row) => {
        (acc[row.ItemCode] ??= new Set()).add(row.SupplierName);
        return acc;
      }, {});
  }, [filteredRows]);

  const suppliersByBOI = useMemo(() => {
    return filteredRows
      .filter(row => String(row.Category
      ).trim().toUpperCase() === "BOI")
      .reduce((acc, row) => {
        (acc[row.ItemCode] ??= new Set()).add(row.SupplierName);
        return acc;
      }, {});
  }, [filteredRows]);

  // Filter helper functions
  const normalizeKey = (k = "") => String(k).replace(/\s|_|-/g, "").toLowerCase();

  const findRowValue = (row = {}, candidates = []) => {
    // Direct key matches
    for (const c of candidates) {
      if (row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== "") {
        return String(row[c]).trim();
      }
    }

    // Fallback: match by normalized key
    const map = {};
    Object.keys(row).forEach((k) => {
      map[normalizeKey(k)] = k;
    });

    for (const c of candidates) {
      const nk = normalizeKey(c);
      if (map[nk]) return String(row[map[nk]]).trim();
    }

    return "";
  };


  // ── Planned Orders donut: computed directly from filteredRows ──────────────
  // "Completed" = unique ItemCodes that have at least one PO with OrderedQty > 0
  const plannedStats = useMemo(() => {
    if (!filteredRows.length) return { total: 0, completed: 0, pending: 0 };

    const allItems   = new Set(filteredRows.map(r => String(r.ItemCode || "").trim()).filter(Boolean));
    const ordered    = new Set(
      filteredRows
        .filter(r => (Number(r.OrderedQty) || Number(r.OrderedLineQuantity) || 0) > 0)
        .map(r => String(r.ItemCode || "").trim())
        .filter(Boolean)
    );
    const total     = allItems.size;
    const completed = ordered.size;
    return { total, completed, pending: total - completed };
  }, [filteredRows]);

  // ── Order Status donut: computed directly from filteredRows ─────────────────
  // "Ordered/Received" = item has TotalPOLineDeliveredQuantity > 0 (actual delivery data)
  // Fallback checks: PurchaseOrderLineStatus closed/complete
  const orderStats = useMemo(() => {
    if (!filteredRows.length) return { completed: 0, pending: 0 };

    // Group by ItemCode — sum delivered qty across all PO lines for each item
    const deliveredByItem = {};
    const orderedByItem   = {};
    const statusByItem    = {};

    filteredRows.forEach(r => {
      const key = String(r.ItemCode || "").trim();
      if (!key) return;

      // Use InventoryQuantity (On Hand) as receipt signal — it reflects actual stock received
      deliveredByItem[key] = (deliveredByItem[key] || 0) +
        (Number(r.InventoryQuantity) || Number(r.Delivery) || Number(r.TotalPOLineDeliveredQuantity) || 0);

      orderedByItem[key] = (orderedByItem[key] || 0) +
        (Number(r.OrderedQty) || Number(r.OrderedLineQuantity) || 0);

      // Keep track of line status (use the "best" status seen for this item)
      const ls = String(r.PurchaseOrderLineStatus || "").trim().toLowerCase();
      if (ls === "closed" || ls === "complete" || ls === "completed") {
        statusByItem[key] = "done";
      }
    });

    let completed = 0, pending = 0;
    const allItems = new Set(
      filteredRows.map(r => String(r.ItemCode || "").trim()).filter(Boolean)
    );

    allItems.forEach(key => {
      const delivered = deliveredByItem[key] || 0;
      const ordered   = orderedByItem[key]   || 0;
      const isDone    = statusByItem[key] === "done";

      // Ordered = has delivery recorded OR PO line is explicitly closed/completed
      if (delivered > 0 || isDone || (ordered > 0 && delivered >= ordered)) {
        completed++;
      } else {
        pending++;
      }
    });

    return { completed, pending };
  }, [filteredRows]);



  // Apply filters
  const applyFilters = () => {
    const { search, projectCode, itemCode, description, refStart, refEnd } = filters;

    const start = parseFloat(refStart);
    const end = parseFloat(refEnd);
    const refFilterActive = !isNaN(start) || !isNaN(end);

    const searchTerms = String(search || "")
      .split(/[, ]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const searchableFields = [
      "ProjectCode", "ProjectNo", "ItemCode", "Description", "ItemShortDescription",
      "ReferenceB", "REF_B", "Reference B", "Reference_B", "REFB", "Reference"
    ];

    const findRowValue = (row, keys) => {
      for (const key of keys) {
        if (row[key] != null && row[key] !== "") return row[key];
      }
      return null;
    };

    const filterFn = (row) => {
      if (!row) return false;

      // 1. Item Code
      if (itemCode && String(row.ItemCode || "").trim() !== itemCode.trim()) return false;

      // 2. Project Selection / Code
      const rowProj = String(row.ProjectCode || row.PROJECT_NO || row.ProjectNo || "").trim();
      if (selectedProject && rowProj !== selectedProject) return false;
      if (projectCode && rowProj !== projectCode.trim()) return false;

      // 3. Description
      if (description) {
        const rowDesc = (row.ItemShortDescription || row.Description || "").toLowerCase();
        if (!rowDesc.includes(description.toLowerCase())) return false;
      }

      // 4. Ref B Range / Selection
      const rawRefStr = findRowValue(row, ["ReferenceB", "REF_B", "Reference B", "Reference_B", "REFB", "Reference"]);
      if (selectedRef && rawRefStr !== selectedRef) return false;

      if (refFilterActive) {
        const refVal = rawRefStr ? parseFloat(String(rawRefStr).replace(/[^0-9.\-]/g, "")) : NaN;
        if (isNaN(refVal)) return false;
        if (!isNaN(start) && refVal < start) return false;
        if (!isNaN(end) && refVal > end) return false;
      }

      // 5. General Search
      if (searchTerms.length > 0) {
        const rowString = searchableFields
          .map(key => String(row[key] || "").toLowerCase())
          .join(" ");
        if (!searchTerms.every(term => rowString.includes(term))) return false;
      }

      return true;
    };

    setFilteredRows(rows.filter(filterFn));
    setFilteredIndentRows(indentRows.filter(filterFn));
  };


  // Zoomed component renderer
  const renderZoomedComponent = () => {
    if (!activeComponent) return null;

    const components = {
      refBCards: <ReferenceBList
        rows={filteredRows}
        selectedRef={selectedRef}
        onSelectRef={(ref) => {
          setSelectedRef(ref);
          setTimeout(() => applyFilters(), 0);
        }}
      />
      ,

      donutChart: <DonutChart rows={filteredRows} />,
      donutChart2: <DonutChart2 filteredRows={filteredRows} filteredIndentRows={filteredIndentRows} />,
      rawMaterial: <Rawmaterial
        value={`${filteredRows.length} Items`}
        label="Raw Materials"
        bgColor="bg-[var(--color-card)]"
        valueColor="text-[var(--color-primary)]"
        labelColor="text-[var(--color-muted-foreground)]"
      />,
      baught: <Baught
        value={`${filteredRows.length} Items`}
        label="Business Operations Index"
        bgColor="bg-[var(--color-card)]"
        valueColor="text-[var(--color-primary)]"
        labelColor="text-[var(--color-muted-foreground)]"
      />,
      yashgraph: <ReceiptBarChart rows={filteredRows} />,
      dataTable: <DataTable2 rows={filteredRows} indentRows={filteredIndentRows} />,

    };

    // Special handling for dataTable to show full width
    if (activeComponent === 'dataTable') {
      return (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-[var(--color-card)] rounded-[var(--radius)] shadow-2xl w-[98vw] h-[92vh] overflow-auto relative">

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-[var(--color-secondary)] rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-secondary-foreground)] transition-transform duration-200 hover:scale-[1.05]"
              onClick={() => setActiveComponent(null)}
            >
              ×
            </button>

            {/* ✅ Force full width & height */}
            <div className="w-full h-full overflow-auto p-6">
              <DataTable2
                rows={filteredRows}
                indentRows={filteredIndentRows}
                fullView={true}   // <--- add this prop
              />
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
        <div className="bg-[var(--color-card)] rounded-[var(--radius)] shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto transform transition-all duration-300 scale-100">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 bg-[var(--color-secondary)] rounded-full w-8 h-8 flex items-center justify-center text-[var(--color-secondary-foreground)] transition-transform duration-200 hover:scale-[1.05]"
              onClick={() => setActiveComponent(null)}
            >
              ×
            </button>
            {components[activeComponent]}
          </div>
        </div>
      </div>
    );
  };

  // Upload Modal Component
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
            <div className="mt-4">
              <Uploadfrom2 onUpload={processExcel} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300 relative ${activeComponent ? 'overflow-hidden' : ''} min-h-screen`}>

      {/* Zoomed Component Overlay */}
      {renderZoomedComponent()}

      {/* Upload Modal */}
      {renderUploadModal()}

      <ItemInsightsPopup
        rows={filteredRows}
        indentRows={filteredIndentRows}
        isOpen={showItemInsights}
        onClose={() => setShowItemInsights(false)}
      />




      {/* Fixed Filter Bar */}
      <div className={`sticky top-0 z-30 w-full py-1.5 bg-[var(--color-background)]/95 backdrop-blur-sm shadow-sm ${activeComponent ? 'blur-sm' : ''}`}>
        <div className="flex justify-start items-center px-2 w-full">
          <Filters
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            rows={rows}
          />
        </div>
      </div>


      {/* Main Content with Top Padding for Fixed Filter */}
      <div className={`px-6 transition-all duration-300 ${activeComponent ? 'blur-sm' : ''}`}>
          {/* Metrics Cards Section */}
          <div className="mt-2">
            {/* Single Row with All Components */}
            <div className="flex flex-row justify-between items-start gap-2 w-full mb-1">
              {/* Rawmaterial and Baught Components */}
              <div className="flex flex-col gap-1 ">
                <div className="flex flex-row gap-2 w-full">
                  <div className="transform transition-transform w-full duration-200 hover:scale-[1]">
                    <Rawmaterial
                      value={`${uniqueItemCount} `}
                      bgColor="bg-[var(--color-card)]"
                      valueColor="text-[var(--color-primary)]"
                      labelColor="text-[var(--color-muted-foreground)]"
                    />
                  </div>
                  <div className="transform transition-transform w-full duration-200 hover:scale-[1]">
                    <Baught
                      value={`${uniqueBOICount} `}
                      bgColor="bg-[var(--color-card)]"
                      valueColor="text-[var(--color-primary)]"
                      labelColor="text-[var(--color-muted-foreground)]"
                    />
                  </div>
                </div>
                <div className="transform transition-transform w-full duration-200 hover:scale-[1.02]">
                  {/* ReferenceBList Section */}
                  <div >
                    <ReferenceBList
                      rows={filteredRows}
                      selectedRef={selectedRef}
                      onSelectRef={(ref) => {
                        setSelectedRef(ref);
                        // Apply filters again after selection change`
                        setTimeout(() => applyFilters(), 0);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Supplier Name Component with RMSupplier and BOISupplier */}
              <div className="bg-[var(--color-card)] min-h-[140px] max-h-48 overflow-hidden p-3 rounded-[var(--radius)] font-semibold shadow border border-[var(--color-border)] text-center align-middle w-[70%] transform transition-transform duration-200 hover:scale-[1.02]">
                <h1 className="text-xs mb-1">Supplier Name</h1>
                <div className="flex flex-row gap-1 justify-center h-full overflow-y-auto scrollbar-hide">
                  <div className="w-[60%] h-full" >
                    <RMSupplier
                      value={`${filteredRows.length} `}
                      suppliers={suppliersByRM}
                    />
                  </div>
                  <div className="w-[60%] h-full">
                    <BOISupplier
                      value={`${filteredRows.length} `}
                      suppliers={suppliersByBOI}
                    />
                  </div>
                </div>
              </div>

              {/* Donut Charts */}
              <div className="flex flex-row gap-2 w-[40%]">
                <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                  <DonutChart plannedStats={plannedStats} />
                </div>

                <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                  <DonutChart2 orderStats={orderStats} />
                </div>
              </div>

            </div>

            {/* Split Layout - Left Half: ReferenceBList, ProjectNumber & ReceiptBarChart, Right Half: DataTable2 */}
            <div className="flex justify-between  items-start gap-2 mb-5">
              {/* Left Half - ReferenceBList, ProjectNumber and ReceiptBarChart */}
              <div className="w-[25%] flex flex-col right-3 ">

                <div>
                  <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <ProjectNumber
                      values={[...new Set(rows.map(row => row.ProjectCode || row.ProjectNo))]} 
                      selectedProject={selectedProject}
                      onSelectProject={(project) => {
                        setSelectedProject(prev => prev === project ? null : project);
                        setTimeout(() => applyFilters(), 0);
                      }}
                    />
                  </div>
                </div>
                {/* ReceiptBarChart Component - Added Here */}
                <div className="mt-1 z-10 transform transition-transform duration-200 hover:scale-[1.02]">
                  <ReceiptBarChart rows={filteredRows} />
                </div>

              </div>

              {/* Right Half - DataTable2 */}
              <div className="w-[75%]  ">
                <div className="bg-[var(--color-card)] p-4 rounded-[var(--radius)] shadow-md relative h-full">
                  <DataTable2
                    rows={filteredRows}
                    indentRows={filteredIndentRows}
                    fullView={activeComponent === 'dataTable'}
                    extraButtons={
                      <>
                        <button
                          onClick={() => setShowItemInsights(true)}
                          className="h-9 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2 rounded-[var(--radius)] shadow-lg transition-transform duration-200 hover:scale-[1.05]"
                        >
                          Item Insights
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] w-9 h-9 flex items-center justify-center rounded-[var(--radius)] shadow-lg transition-transform duration-200 hover:scale-[1.05]"
                          title="Upload Excel File"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </button>
                        <button
                          className="bg-[var(--color-primary)] rounded-[var(--radius)] text-[var(--color-primary-foreground)] shadow-lg transition-transform duration-200 hover:scale-[1.05] h-9 w-9 flex items-center justify-center"
                          title="Zoom Table"
                          onClick={() => setActiveComponent('dataTable')}
                        >
                          <ZoomIcon width={18} height={18} />
                        </button>
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PlannerChecker;
