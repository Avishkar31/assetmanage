import React from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const SimpleRadialBarChart = () => {
  const data = {
    labels: ["LCS", "NX", "T&I", "BOM", "Solid Edge", "Comos"],
    datasets: [
      {
        label: "Laptops per Team",
        data: [31, 26, 16, 8, 9, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart scales properly
    scales: {
      r: {
        ticks: {
          color: "#FFFFFF", // Customize the tick color
          backdropColor: "rgba(0, 0, 0, 0)" // Remove the tick background
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)" // Customize the grid line color
        }
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF", // Customize the legend text color
          font: {
            size: 12 // Adjusted legend text size for better fit
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)", // Customize tooltip background
        titleColor: "#FFFFFF", // Customize tooltip title color
        bodyColor: "#FFFFFF" // Customize tooltip text color
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="relative h-96">
          <PolarArea data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SimpleRadialBarChart;
