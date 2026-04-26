import React, { useMemo } from "react";

const RateSummary = ({ rows = [] }) => {

  const stats = useMemo(() => {
    if (!rows.length) return null;

    const rates = rows
      .map(r => {
        const qty = Number(r.OrderedLineQuantity) || 0;
        const value = Number(r.OrderLineValue) || 0;
        if (qty <= 0) return null;
        return value / qty;
      })
      .filter(r => r && isFinite(r));

    if (!rates.length) return null;

    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const highest = Math.max(...rates);
    const lowest = Math.min(...rates);

    return { avg, highest, lowest };
  }, [rows]);

  const format = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);

  if (!stats) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-sm text-gray-400">
        No rate data available
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 w-full shrink-0">

      {/* Average */}
      <div className="mb-1.5">
        <div className="text-sm text-gray-400">Average Rate</div>
        <div className="text-lg font-bold text-emerald-400 leading-tight">
          {format(stats.avg)}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border)] my-1"></div>

      {/* High Low */}
      <div className="flex justify-between text-xs">

        <div>
          <div className="text-gray-400 text-[12px]">Highest</div>
          <div className="font-semibold text-red-400 text-[12px]">
            {format(stats.highest)}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-[12px]">Lowest</div>
          <div className="font-semibold text-blue-400 text-[12px]">
            {format(stats.lowest)}
          </div>
        </div>

      </div>

    </div>
  );
};

export default RateSummary;
