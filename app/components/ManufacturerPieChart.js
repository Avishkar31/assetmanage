import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ManufacturerPieChart = () => {
  const data = {
    labels: ["Dell", "HP", "Apple", "Microsoft"],
    datasets: [
      {
        label: "Laptops by Manufacturer",
        data: [40, 30, 20, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF", // Customize the legend text color
          font: {
            size: 14 // Customize the legend text size
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)", // Customize tooltip background
        titleColor: "#FFFFFF", // Customize tooltip title color
        bodyColor: "#FFFFFF", // Customize tooltip text color
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default ManufacturerPieChart;
