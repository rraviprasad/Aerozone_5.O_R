import { useMemo, useState } from "react";
import { parseRobustDate } from "../../src/utils/dateUtils";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnalysisComboChart({ data = [] }) {
  const [selectedYear, setSelectedYear] = useState(null);

  /* -------------------- Get Available Years -------------------- */
  const years = useMemo(() => {
    const yearSet = new Set();

    data.forEach((row) => {
      const d = parseRobustDate(row.PlannedReceiptDate);
      if (!d) return;
      yearSet.add(d.getFullYear());
    });

    const sortedYears = Array.from(yearSet).sort((a, b) => b - a);

    // auto-select latest year
    if (!selectedYear && sortedYears.length) {
      setSelectedYear(sortedYears[0]);
    }

    return sortedYears;
  }, [data, selectedYear]);

  /* -------------------- Chart Data (Year Filtered) -------------------- */
  const chartData = useMemo(() => {
    if (!selectedYear) return [];

    const dayMap = new Map();

    data.forEach((row) => {
      const dateObj = parseRobustDate(row.PlannedReceiptDate);
      if (!dateObj) return;
      if (dateObj.getFullYear() !== selectedYear) return;

      const dayKey = dateObj.toISOString().split("T")[0];

      const qty = Number(row.OrderedLineQuantity) || 0;
      const value = Number(row.OrderLineValue) || 0;
      const customer = row.CustomerName || "Unknown";

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          date: dayKey,
          totalQuantity: 0,
          totalValue: 0,
          customers: new Set(),
        });
      }

      const entry = dayMap.get(dayKey);
      entry.totalQuantity += qty;
      entry.totalValue += value;
      entry.customers.add(customer);
    });

    return Array.from(dayMap.values())
      .map((d) => ({
        ...d,
        rate:
          d.totalQuantity > 0
            ? Number((d.totalValue / d.totalQuantity).toFixed(3))
            : null,
        customers: Array.from(d.customers),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, selectedYear]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs text-zinc-100 space-y-1">
        <div className="text-zinc-400">
          {new Date(label).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>

        <div> Quantity: <b>{data.totalQuantity}</b></div>
        <div> Value: <b>{data.totalValue.toLocaleString()}</b></div>

        {data.rate !== null && (
          <div>Rate: <b>{data.rate}</b></div>
        )}

        <div>
          Project{data.customers.length > 1 ? "s" : ""}:
          <div className="text-zinc-300">
            {data.customers.join(", ")}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="w-full h-60 bg-black border border-zinc-800 p-3 rounded-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="h-4 w-1 bg-zinc-500 mr-2"></span>
          <h3 className="text-sm font-semibold text-zinc-100 tracking-wide">
            ORDER VALUE VS QUANTITY
          </h3>
        </div>

        {/* Year Toggle */}
        <div className="flex gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2 py-1 text-xs rounded-md border transition
                ${selectedYear === year
                  ? "bg-zinc-100 text-black border-zinc-100"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:text-zinc-100"
                }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px] w-full mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              stroke="#52525b"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleString("en-US", { month: "short" })
              }
              minTickGap={40}
              tick={{ fill: "#d4d4d8", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
            />

            <YAxis
              yAxisId="left"
              tick={{ fill: "#d4d4d8", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              label={{
                value: "Order Value",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#a1a1aa", fontSize: 11 },
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#d4d4d8", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              label={{
                value: "Order Quantity",
                angle: 90,
                offset: -2,
                position: "insideRight",
                style: { fill: "#a1a1aa", fontSize: 11 },
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />


            <Legend wrapperStyle={{ fontSize: "11px", color: "#e4e4e7" }} />

            <Bar
              yAxisId="right"
              dataKey="totalQuantity"
              name="Order Quantity"
              barSize={26}
              fill="#a1a1aa"
              radius={[4, 4, 0, 0]}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalValue"
              name="Order Value"
              stroke="#fafafa"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
