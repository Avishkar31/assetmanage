import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const StackedBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/segments");
        if (!response.ok) {
          throw new Error("Failed to fetch segments data");
        }
        const segmentsData = await response.json();

        // Transform the data to match the chart format
        const formattedData = segmentsData.map((segment) => ({
          name: segment.name,
          Monitor: segment.assets?.Monitor || 0,
          Laptop: segment.assets?.Laptop || 0,
          Desktop: segment.assets?.Desktop || 0
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="Monitor" stackId="a" fill="#8dd1e1" />
        <Bar dataKey="Laptop" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Desktop" stackId="a" fill="#a4de6c" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
