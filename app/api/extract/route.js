// app/api/extract/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { stringify } from "csv-stringify/sync";

export async function GET(req) {
  try {
    console.log("Extract API called");
    
    await dbConnect();
    const { searchParams } = new URL(req.url);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    // Build query filter
    const filter = {};
    
    // Handle status parameter with special case for "New Purchase"
    const status = searchParams.get("status");
    if (status) {
      if (status.toLowerCase() === "new purchase") {
        filter.status = "New Purchase";
      } else {
        filter.status = new RegExp(`^${status}$`, "i");
      }
      console.log("Status filter:", filter.status);
    }
    
    // Handle department
    const department = searchParams.get("department");
    if (department) filter.department = department;
    
    // Handle category
    const category = searchParams.get("category");
    if (category) filter.category = category;

    // Handle segment
    const segment = searchParams.get("segment");
    if (segment) filter.segment = segment;

    // Handle purchase date range
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      filter.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Handle checkout date
    if (searchParams.get("checkOutDate") === "today") {
      const today = new Date();
      filter.checkOutDate = {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999))
      };
    }

    console.log("Final filter:", JSON.stringify(filter, null, 2));

    // Fetch assets
    const assets = await Asset.find(filter).lean();
    console.log(`Found ${assets.length} assets matching the filter`);

    if (assets.length === 0) {
      return NextResponse.json(
        { error: "No data found for the specified criteria" },
        { status: 404 }
      );
    }

    // Prepare filename
    const timestamp = new Date().toISOString().split("T")[0];
    let filename = `assets_export_${timestamp}.csv`;
    if (status) {
      filename = `${status.toLowerCase().replace(/\s+/g, "_")}_assets_${timestamp}.csv`;
    }

    // Define columns with their display names (aligned with import headers)
    const columnMap = {
      nodeName: "NodeName",
      serialNumber: "SerialNumber",
      manufacturer: "Manufacturer",
      type: "Type",
      model: "Model",
      expires: "Expries",
      category: "Categories",
      status: "Status",
      segment: "Segment",
      department: "Department",
      assetOwner: "AssetOwner",
      note: "Note",
      defaultLocation: "DefaultLocation",
      costCenter: "CostCenter",
      receivedDate: "ReceivedDate",
      condition: "Condition",
      storeLocation: "StoreLocation",
      poNumber: "PONumber",
      order: "Order",
      purchaseDate: "PurchaseNumber",
      checkOutDate: "CheckOutDate",
      checkInDate: "CheckInDate"
    };

    // Transform assets data
    const csvData = assets.map(asset => {
      const row = {};
      for (const [key, displayName] of Object.entries(columnMap)) {
        if (key.toLowerCase().includes("date")) {
          row[displayName] = asset[key] ? formatDate(asset[key]) : "";
        } else {
          row[displayName] = asset[key] || "";
        }
      }
      return row;
    });

    // Convert to CSV
    const csvString = stringify(csvData, {
      header: true,
      columns: Object.values(columnMap)
    });

    console.log(`Generated CSV with ${csvData.length} rows`);

    // Create response with CSV file
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export assets",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

function formatDate(date) {
  try {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Date formatting error for date:", date, error);
    return "";
  }
}
