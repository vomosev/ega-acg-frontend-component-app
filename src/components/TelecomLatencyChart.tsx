"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "12:00", latency: 8 },
  { time: "12:05", latency: 6 },
  { time: "12:10", latency: 5 },
  { time: "12:15", latency: 7 },
  { time: "12:20", latency: 4 },
];

export default function TelecomLatencyChart() {

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">

      <h3 className="font-bold text-[#5871A7] mb-4">
        Live Latency Analytics
      </h3>

      <div className="h-[180px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <XAxis dataKey="time" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="latency"
              stroke="#5871A7"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}
