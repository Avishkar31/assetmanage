// app/api/monitors/export/route.js
import dbConnect from "@/lib/dbConnect";
import Monitor from "@/models/Monitor";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect(); // Fixed: Changed from connectdb() to dbConnect()
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const team = searchParams.get("team");
    const status = searchParams.get("status");
    const manufacturer = searchParams.get("manufacturer");
    
    // Build query
    const query = {};
    if (team) query.team = team;
    if (status) query.status = status;
    if (manufacturer) query.manufacturer = { $regex: manufacturer, $options: "i" };
    
    // Get monitors with populated team
    const monitors = await Monitor.find(query).populate("team");
    
    if (monitors.length === 0) {
      return NextResponse.json({ error: "No monitors found matching your criteria" }, { status: 404 });
    }
    
    // Define CSV headers
    const headers = [
      "Serial Number", "Manufacturer", "Model", "PR Number", "PO Number",
      "PR Requester", "Status", "Team", "Issued To", "Created By", "Created At"
    ];
    
    // Generate CSV content
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    // Add monitor data
    for (const monitor of monitors) {
      const row = [
        escapeCSV(monitor.serialNumber || ""),
        escapeCSV(monitor.manufacturer || ""),
        escapeCSV(monitor.model || ""),
        escapeCSV(monitor.prNumber || ""),
        escapeCSV(monitor.poNumber || ""),
        escapeCSV(monitor.prRequester || ""),
        escapeCSV(monitor.status || ""),
        escapeCSV(monitor.team?.name || ""),
        escapeCSV(monitor.issueTo || ""),
        escapeCSV(monitor.username || ""),
        monitor.createdAt ? escapeCSV(new Date(monitor.createdAt).toLocaleDateString()) : ""
      ];
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    
    // Return CSV response with appropriate headers
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=monitors-export.csv"
      }
    });
  } catch (error) {
    console.error("Error exporting monitors:", error);
    return NextResponse.json(
      { error: "Failed to export monitors", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to properly escape values for CSV
function escapeCSV(value) {
  // Convert to string if not already
  const str = String(value);
  
  // If the string contains commas, quotes, or newlines, wrap it in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Double any existing quotes
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}