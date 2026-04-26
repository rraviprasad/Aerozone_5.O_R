import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectBar = ({ project, qty, value, maxQty }) => {
  const percent = maxQty > 0 ? (qty / maxQty) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-2 group">

      {/* Project Name */}
      <div className="w-20 text-[11px] font-semibold text-[var(--foreground)] truncate">
        {project}
      </div>

      {/* Bar Area */}
      <div className="flex-1 relative h-5 bg-zinc-700/30 rounded-md overflow-hidden">

        {/* Filled Bar */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-md transition-all duration-700 group-hover:brightness-110"
          style={{ width: `${percent}%` }}
        />

        {/* Quantity Text */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white pointer-events-none">
          {qty}
        </div>
      </div>

      {/* Value */}
      <div className="w-20 text-right text-[11px] font-semibold text-[var(--foreground)]">
        {value}
      </div>
    </div>
  );
};


/* ---------------- Main Component ---------------- */

export default function PieCharts({ rows = [], singleChart = false }) {

  /* ---- Group By Project ---- */
  const projectMetrics = {};
  rows.forEach((row) => {
    const project = row.ProjectCode || "Unknown";

    if (!projectMetrics[project]) {
      projectMetrics[project] = { qty: 0, value: 0 };
    }

    projectMetrics[project].qty += Number(row.OrderedLineQuantity) || 0;
    projectMetrics[project].value += Number(row.OrderLineValue) || 0;
  });

  /* ---- Chart Data ---- */
  const projectOrderQty = {};
  Object.entries(projectMetrics).forEach(([project, data]) => {
    projectOrderQty[project] = data.qty;
  });

  const buildChartData = (dataObj, label) => ({
    labels: Object.keys(dataObj),
    datasets: [
      {
        label,
        data: Object.values(dataObj),
        backgroundColor: [
          "#4ade80", "#60a5fa", "#f87171", "#facc15",
          "#a78bfa", "#fb923c", "#22d3ee", "#2dd4bf",
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  /* ---- Formatters ---- */
  const formatNumber = (num) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);

  /* ---- Single Chart Mode ---- */
  if (singleChart) {
    return (
      <div className="relative h-full flex justify-center items-center">
        <Pie
          data={buildChartData(projectOrderQty, "Order Qty")}
          options={chartOptions}
        />
      </div>
    );
  }

  /* ---- Full Layout ---- */
  return (
    <div className="w-full h-full flex gap-2 px-1">

      {/* PIE CHART CARD */}
      <div className="bg-[var(--card)] w-[250px] shrink-0 rounded-lg border border-[var(--border)] p-2 flex flex-col hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-1">
          <div className="h-4 w-1 bg-[var(--primary)] mr-1.5 rounded-sm"></div>
          <h2 className="text-[11px] font-semibold text-[var(--foreground)] leading-tight">
            PROJECT DIST.
          </h2>
        </div>

        <div className="relative flex-1 min-h-0 flex justify-center items-center">
          <Pie
            data={buildChartData(projectOrderQty, "Order Qty")}
            options={chartOptions}
          />
        </div>
      </div>

      {/* PROJECT SCROLLABLE BAR PANEL */}
      <div className="bg-[var(--card)] w-[400px] border border-[var(--border)] rounded-lg flex flex-col overflow-hidden">

  {/* Header */}
  <div className="px-3 py-2 sticky top-0 bg-[var(--card)] border-b border-[var(--border)] z-10">
    <div className="text-xs font-semibold tracking-wide text-[var(--foreground)]">
      PROJECT BREAKDOWN
    </div>
  </div>

  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
    {(() => {
      const values = Object.values(projectMetrics);
      const maxQty = values.length
        ? Math.max(...values.map(p => p.qty))
        : 0;

      return Object.entries(projectMetrics)
        .sort((a, b) => b[1].qty - a[1].qty)
        .map(([project, data]) => (
          <ProjectBar
            key={project}
            project={project}
            qty={data.qty}
            value={formatCurrency(data.value)}
            maxQty={maxQty}
          />
        ));
    })()}
  </div>
</div>

    </div>
  );
}
