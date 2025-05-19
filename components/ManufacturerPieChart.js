// components/ManufacturerPieChart.js
"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ManufacturerPieChart = ({ manufacturers = [] }) => {
  // Generate dynamic colors based on the number of manufacturers
  const generateColors = (count) => {
    const backgroundColors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(199, 199, 199, 0.7)",
      "rgba(83, 102, 255, 0.7)",
      "rgba(255, 128, 0, 0.7)",
      "rgba(0, 128, 255, 0.7)",
      "rgba(128, 0, 255, 0.7)",
      "rgba(255, 0, 128, 0.7)",
    ];
    
    const borderColors = backgroundColors.map(color => 
      color.replace("0.7", "1")
    );
    
    // If we have more manufacturers than colors, cycle through colors
    const bgColors = [];
    const bdColors = [];
    
    for (let i = 0; i < count; i++) {
      bgColors.push(backgroundColors[i % backgroundColors.length]);
      bdColors.push(borderColors[i % borderColors.length]);
    }
    
    return { bgColors, bdColors };
  };

  // Prepare data for the chart
  const prepareChartData = () => {
    if (!manufacturers.length) {
      return {
        labels: ["No Data"],
        datasets: [{
          data: [1],
          backgroundColor: ["rgba(200, 200, 200, 0.7)"],
          borderColor: ["rgba(200, 200, 200, 1)"],
          borderWidth: 1
        }]
      };
    }

    // Limit to top 10 manufacturers if there are too many
    const maxDisplayed = 10;
    let displayedManufacturers = manufacturers;
    let otherCount = 0;
    
    if (manufacturers.length > maxDisplayed) {
      displayedManufacturers = manufacturers.slice(0, maxDisplayed);
      otherCount = manufacturers.length - maxDisplayed;
    }
    
    const labels = displayedManufacturers.map(m => m.name);
    const data = displayedManufacturers.map(() => 1); // Each manufacturer counts as 1
    
    if (otherCount > 0) {
      labels.push(`Others (${otherCount})`);
      data.push(otherCount);
    }
    
    const { bgColors, bdColors } = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: "Manufacturers",
          data,
          backgroundColor: bgColors,
          borderColor: bdColors,
          borderWidth: 1
        }
      ]
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF",
          font: {
            size: 12
          },
          padding: 10
        }
      },
      title: {
        display: true,
        text: "Manufacturer Distribution",
        color: "#FFFFFF",
        font: {
          size: 16
        },
        padding: {
          bottom: 10
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF"
      }
    }
  };

  return (
    <div>
      <div className="h-64 flex justify-center items-center">
        <Pie data={chartData} options={options} />
      </div>
      <div className="mt-3 text-center text-xs text-gray-400">
        Total: {manufacturers.length} manufacturers
      </div>
    </div>
  );
};

export default ManufacturerPieChart;