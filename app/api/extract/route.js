import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { stringify } from "csv-stringify/sync";

export async function GET(req) {
  try {
    // Connect to database
    await dbConnect();

    // Extract query parameters for filtering
    const { searchParams } = new URL(req.url);

    // Build query filter from all possible search params
    const filter = {};
    const possibleFilters = [
      "status",
      "department",
      "category",
      "checkOutDate",
      "receivedDate"
    ];

    possibleFilters.forEach((key) => {
      const value = searchParams.get(key);
      if (value) filter[key] = value;
    });

    // Handle special case for "today" checkOutDate
    if (searchParams.get("checkOutDate") === "today") {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      filter.checkOutDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    // Fetch assets based on filter
    const assets = await Asset.find(filter);

    // Prepare CSV filename based on export type
    let filename = "assets_export.csv";
    if (filter.status) {
      filename = `${filter.status}_assets.csv`;
    } else if (filter.checkOutDate) {
      filename = "todays_allocation.csv";
    }

    // Prepare CSV columns
    const columns = [
      "NodeName",
      "SerialNumber",
      "Manufacturer",
      "Model",
      "Expires",
      "Categories",
      "Status",
      "Department",
      "IssueTo",
      "Note",
      "DefaultLocation",
      "CostCenter",
      "ReceivedDate",
      "AssetOwner",
      "Condition",
      "StoreLocation",
      "PONumber",
      "Order",
      "PurchaseNumber",
      "CheckOutDate"
    ];

    // Transform assets to CSV-friendly format
    const csvData = assets.map((asset) => ({
      NodeName: asset.nodeName,
      SerialNumber: asset.serialNumber,
      Manufacturer: asset.manufacturer,
      Model: asset.model,
      Expires: asset.expires ? formatDate(asset.expires) : "",
      Categories: asset.category,
      Status: asset.status,
      Department: asset.department,
      IssueTo: asset.issueTo,
      Note: asset.note,
      DefaultLocation: asset.defaultLocation,
      CostCenter: asset.costCenter,
      ReceivedDate: asset.receivedDate ? formatDate(asset.receivedDate) : "",
      AssetOwner: asset.assetOwner,
      Condition: asset.condition,
      StoreLocation: asset.storeLocation,
      PONumber: asset.poNumber,
      Order: asset.order,
      PurchaseNumber: asset.purchaseDate ? formatDate(asset.purchaseDate) : "",
      CheckOutDate: asset.checkOutDate ? formatDate(asset.checkOutDate) : ""
    }));

    // Convert to CSV
    const csvString = stringify(csvData, {
      header: true,
      columns: columns
    });

    // Create response with CSV file
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}`
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export assets",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Helper function to format dates consistently
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
