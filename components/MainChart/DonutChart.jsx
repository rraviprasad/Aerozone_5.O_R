import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PlannedOrderDonut = ({ plannedStats = {} }) => {
  const { percentage, completed, pending } = useMemo(() => {
    const completed = plannedStats.completed || 0;
    const pending = plannedStats.pending || 0;
    const total = completed + pending;

    return {
      completed,
      pending,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [plannedStats]);

  if (completed + pending === 0) {
    return (
      <div className="bg-[var(--color-background)] dark:bg-[var(--color-card)] rounded-[var(--radius)] p-6 w-full flex flex-col items-center border border-[var(--color-border)]">
        <p className="text-[var(--color-muted-foreground)] text-sm">
          No Planned Orders
        </p>
      </div>
    );
  }

  const data = {
    labels: ["YES", "NO"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: [
          "oklch(0.6723 0.1606 244.9955)", // completed (blue)
          "oklch(0.6188 0.2376 25.7658)",  // pending (orange)
        ],
        hoverBackgroundColor: [
          "oklch(0.6723 0.1606 244.9955)",
          "oklch(0.6188 0.2376 25.7658)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        padding: 6,
        bodySpacing: 2,
        boxWidth: 6,
        boxHeight: 6,
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
      },
    },
    elements: {
      arc: {
        borderRadius: 50,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 transition-all duration-300">

      <h2 className="text-lg font-bold text-gray-300 mb-4 text-center tracking-tight">
        Planned Orders
      </h2>

      <div className="relative flex justify-center items-center w-full max-w-[200px] aspect-square mx-auto">
        <Doughnut data={data} options={options} />

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <span className="text-2xl font-black text-white">
            {percentage}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
            Completed
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-[11px] font-medium text-gray-500 flex items-center gap-3">
          <span>Completed: <span className="text-white font-bold">{completed}</span></span>
          <span className="text-gray-700">•</span>
          <span>Pending: <span className="text-white font-bold">{pending}</span></span>
        </p>
      </div>
    </div>
  );
};

export default PlannedOrderDonut;
