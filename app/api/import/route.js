import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import Asset from "@/models/Asset";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");
    const user = { siemensId: "SYSTEM" };
    //  JSON.parse(formData.get("user") || "{}");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileContent = fileBuffer.toString();

    // Parse CSV
    const csvData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // const requiredColumns = [
    //   "NodeName",
    //   "Manufacturer",
    //   "Serialnumber",
    //   "Model",
    //   "Expries",
    //   "Categories",
    //   "Status",
    //   "Department",
    //   "IssueTo",
    //   "Note",
    //   "DefaultLocation",
    //   "CostCenter",
    //   "ReceivedDate",
    //   "AssetOwner",
    //   "Condition",
    //   "StoreLocation",
    //   "PONumber",
    //   "Order",
    //   "PurchaseNumber",
    // ];

    // // Validate CSV structure
    // if (!validateCSV(csvData, requiredColumns)) {
    //   return NextResponse.json(
    //     { error: "Invalid CSV file structure" },
    //     { status: 400 }
    //   );
    // }

    // Check for duplicate serial numbers
    const serialNumbers = csvData.map(
      (row) => row.Serialnumber || row.serialnumber
    );
    const existingAssets = await Asset.find({
      serialNumber: { $in: serialNumbers },
    });

    if (existingAssets.length > 0) {
      const duplicates = existingAssets.map((asset) => asset.serialNumber);
      return NextResponse.json(
        {
          error: "Duplicate serial numbers found",
          duplicates,
        },
        { status: 400 }
      );
    }

    // Transform and insert data
    const transformedData = csvData.map((row) => transformCSVData(row, user));

    const result = await Asset.insertMany(transformedData);

    return NextResponse.json(
      {
        message: "Data successfully imported!",
        insertedCount: result.length,
        assets: result,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to validate CSV structure
const validateCSV = (data, requiredColumns) => {
  if (!data || data.length === 0) return false;
  const headers = Object.keys(data[0]);
  return requiredColumns.every((col) =>
    headers.map((h) => h.toLowerCase()).includes(col.toLowerCase())
  );
};

const transformCSVData = (csvRow, user) => {
  const status = csvRow.Status || csvRow.status;
  let checkOutDate = null;
  let checkInDate = null;
  let action = null;

  if (status === "Deployed") {
    checkOutDate = new Date();
    action = "checkOut";
  } else if (["Inpool", "Inactive"].includes(status)) {
    checkInDate = new Date();
    action = "checkIn";
  }

  return {
    nodeName: csvRow.NodeName || csvRow.nodename,
    serialNumber: csvRow.Serialnumber || csvRow.serialnumber,
    manufacturer: csvRow.Manufacturer || csvRow.manufacturer,
    model: csvRow.Model || csvRow.model,
    expires: csvRow.Expries ? new Date(csvRow.Expries) : null,
    category: csvRow.Categories || csvRow.categories,
    status: status,
    department: csvRow.Department || csvRow.department,
    issueTo: csvRow.IssueTo || csvRow.issueto,
    note: csvRow.Note || csvRow.note,
    defaultLocation: csvRow.DefaultLocation || csvRow.defaultlocation,
    costCenter: csvRow.CostCenter || csvRow.costcenter,
    receivedDate: csvRow.ReceivedDate ? new Date(csvRow.ReceivedDate) : null,
    assetOwner: csvRow.AssetOwner || csvRow.assetowner,
    condition: csvRow.Condition || csvRow.condition,
    storeLocation: csvRow.StoreLocation || csvRow.storelocation,
    poNumber: csvRow.PONumber || csvRow.ponumber,
    order: csvRow.Order || csvRow.order,
    purchaseDate: csvRow.PurchaseNumber
      ? new Date(csvRow.PurchaseNumber)
      : null,
    checkOutDate,
    checkInDate,
    assetHistory: [
      {
        user: user?.siemensId || "SYSTEM",
        action,
        date: new Date(),
        status,
      },
    ],
  };
};
