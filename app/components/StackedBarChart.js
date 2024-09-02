import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Team A", Mouse: 400, Keyboard: 240, Monitor: 240, Laptop: 400, Desktop: 300 },
  { name: "Team B", Mouse: 300, Keyboard: 139, Monitor: 221, Laptop: 300, Desktop: 400 },
  { name: "Team C", Mouse: 200, Keyboard: 980, Monitor: 229, Laptop: 200, Desktop: 200 },
  { name: "Team D", Mouse: 278, Keyboard: 390, Monitor: 200, Laptop: 278, Desktop: 100 },
  { name: "Team E", Mouse: 189, Keyboard: 480, Monitor: 218, Laptop: 189, Desktop: 300 },
];

const StackedBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Mouse" stackId="a" fill="#8884d8" />
        <Bar dataKey="Keyboard" stackId="a" fill="#83a6ed" />
        <Bar dataKey="Monitor" stackId="a" fill="#8dd1e1" />
        <Bar dataKey="Laptop" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Desktop" stackId="a" fill="#a4de6c" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
