import React, { useEffect, useState, useMemo } from 'react'
import DataTable2 from '../components/Analysis/DataTable';
import Filters from '../components/Analysis/Filter22';
import ProjectPieChart from '../components/Analysis3/ProjectPieChart';
import TopItemsBarChart from '../components/Analysis3/TopItemsBarChart';

const Analysis3 = ({ setDataLoading }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchData = async () => {
      if (setDataLoading) setDataLoading(true);
      try {
        setLoading(true);
        const res = await fetch("/api/data/analysis");
        const data = await res.json();
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

  const applyFilters = () => {
    const { search, itemCode, description, refStart, refEnd, projectCode } = filters;
    const start = parseFloat(refStart);
    const end = parseFloat(refEnd);
    const refFilterActive = !isNaN(start) || !isNaN(end);

    const filtered = rows.filter(row => {
      if (!row) return false;
      if (itemCode && String(row.ItemCode || "").trim() !== itemCode.trim()) return false;
      if (projectCode && String(row.ProjectCode || "").trim() !== projectCode.trim()) return false;
      
      if (description) {
        const desc = (row.ItemShortDescription || row.Description || "").toLowerCase();
        if (!desc.includes(description.toLowerCase())) return false;
      }

      if (refFilterActive) {
        const refVal = parseFloat(String(row.ReferenceB || row.REF_B || "").replace(/[^0-9.\-]/g, ""));
        if (isNaN(refVal)) return false;
        if (!isNaN(start) && refVal < start) return false;
        if (!isNaN(end) && refVal > end) return false;
      }

      if (search) {
        const s = search.toLowerCase();
        const rowStr = `${row.ProjectCode || ""} ${row.ItemCode || ""} ${row.Description || ""}`.toLowerCase();
        if (!rowStr.includes(s)) return false;
      }
      return true;
    });

    setFilteredRows(filtered);
  };

  // 🥧 Pie Chart Data (Project Distribution)
  const projectStats = useMemo(() => {
    const counts = {};
    filteredRows.forEach(r => {
      const pc = r.ProjectCode || "Unknown";
      counts[pc] = (counts[pc] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 5);
  }, [filteredRows]);

  // 📊 Bar Chart Data (Top 5 Items)
  const topItems = useMemo(() => {
    const items = {};
    filteredRows.forEach(r => {
      const ic = r.ItemCode || "N/A";
      items[ic] = (items[ic] || 0) + (Number(r.OrderedLineQuantity) || 0);
    });
    return Object.entries(items)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredRows]);


  if (loading) return <div className="p-10 text-cyan-400">Loading Project Analysis...</div>;

  return (
    <div className="dark bg-[#0a0a0c] text-white flex flex-col pt-1 px-2 md:px-3 pb-1" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Filters */}
      <div className="mb-1 shrink-0">
        <Filters title="Analysis 3" filters={filters} setFilters={setFilters} applyFilters={applyFilters} rows={rows} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 shrink-0" style={{ height: '220px' }}>
        <div className="h-full min-h-0"><ProjectPieChart data={projectStats} /></div>
        <div className="h-full min-h-0"><TopItemsBarChart data={topItems} /></div>
      </div>

      {/* Main Table */}
      <div className="bg-[#111114] rounded-xl border border-white/5 shadow-xl flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="p-2 border-b border-white/5 flex justify-between items-center shrink-0">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Detailed Project Metrics</h3>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">
            {filteredRows.length} Rows
          </span>
        </div>
        <div className="w-full flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <DataTable2 rows={filteredRows} />
        </div>
      </div>
    </div>
  );
};

export default Analysis3;
