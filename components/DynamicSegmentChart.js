"use client";
import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { FiRefreshCw } from "react-icons/fi"; 


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const DynamicSegmentChart = () => {
  const [segmentData, setSegmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSegmentStats();
  }, []);

  const fetchSegmentStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/segment-stats");
      const data = await response.json();
      if (data.success) {
        setSegmentData(data.data);
      } else {
        console.error("Failed to fetch segment stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching segment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate colors dynamically based on the number of segments
  const generateColors = (count) => {
    const baseColors = [
      [255, 99, 135],   // Red
      [54, 162, 236],   // Blue
      [255, 206, 120],   // Yellow
      [75, 192, 200],   // Teal
      [153, 102, 255],  // Purple
      [255, 159, 64],   // Orange
      [255, 99, 255],   // Pink
      [54, 235, 162],   // Mint
      [255, 255, 86],   // Light Yellow
      [75, 75, 192]     // Indigo
    ];
    
    const bgColors = [];
    const borderColors = [];
    
    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      const [r, g, b] = baseColors[colorIndex];
      bgColors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
      borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    
    return { bgColors, borderColors };
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!segmentData.length) return null;
    
    const labels = segmentData.map(item => item.department);
    const values = segmentData.map(item => item.count);
    const { bgColors, borderColors } = generateColors(segmentData.length);
    
    return {
      labels,
      datasets: [
        {
          label: 'Members per Segment',
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: {
          color: "#FFFFFF",
          backdropColor: "rgba(0, 0, 0, 0)"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        pointLabels: {
          color: "#FFFFFF",
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#FFFFFF",
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} members`;
          }
        }
      },
      title: {
        display: true,
        text: 'Segment Distribution',
        color: "#FFFFFF",
        font: {
          size: 18
        }
      }
    }
  };

  return (
                <div className="flex flex-col justify-center items-center">
          <div className="w-full max-w-lg rounded-lg shadow-lg">
            <div className="flex justify-between items-center">  
              <button 
                onClick={fetchSegmentStats} 
                className="bg-teal-600 px-3 py-1 rounded btransition-colors"
              >
                <FiRefreshCw />
              </button>
            </div>
        
            {loading ? (
              <div className="h-96 flex justify-center items-center">
                <p className="text-white">Loading segment data...</p>
              </div>
            ) : segmentData.length === 0 ? (
              <div className="h-96 flex justify-center items-center">
                <p className="text-white">No segment data available. Please add segments first.</p>
              </div>
            ) : (
              <div className="relative h-72">
                <PolarArea data={chartData} options={options} />
              </div>
            )}
          </div>
        </div>
  );
};

export default DynamicSegmentChart;