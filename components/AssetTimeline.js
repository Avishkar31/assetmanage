import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { date: "2024-01-01", event: "Acquisition", value: 100 },
  { date: "2024-01-08", event: "Deployment", value: 80 },
  { date: "2024-01-15", event: "Maintenance", value: 60 },
  { date: "2024-01-22", event: "Upgrade", value: 90 },
  { date: "2024-01-29", event: "Audit", value: 70 },
  { date: "2024-02-05", event: "Disposal", value: 0 }
];

const AssetTimeline = () => {
  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#ccc" }}
            tickFormatter={(tick) =>
              new Date(tick).toLocaleDateString("en-US", {
                week: "numeric",
                month: "short",
                day: "numeric"
              })
            }
          />
          <YAxis tick={{ fill: "#ccc" }} />
          <Tooltip
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                week: "numeric",
                month: "short",
                day: "numeric"
              })
            }
          />
          <Line
            type="linear"
            dataKey="value"
            stroke="#4a90e2"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetTimeline;
