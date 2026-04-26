import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopItemsBarChart = ({ data }) => {
  return (
    <div className="bg-[#111114] p-2 rounded-xl border border-white/5 shadow-xl h-full flex flex-col">
      <h2 className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider shrink-0">Top 5 Items (Qty)</h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="name" fontSize={10} stroke="#666" />
            <YAxis fontSize={10} stroke="#666" />
            <Tooltip 
               contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px' }}
               itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="qty" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopItemsBarChart;
