import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import Asset from "@/models/Asset";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");
    const assetUser = formData.get("assetUser") || "SYSTEM"; // Added to get the current user

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
      trim: true
    });

    console.log("CSV data sample:", csvData.slice(0, 2));
    console.log("CSV columns:", csvData.length > 0 ? Object.keys(csvData[0]) : []);

    // Validate CSV structure
    const requiredColumns = [
      "NodeName",
      "Manufacturer",
      "Type",          // ✅ ensure required
      "SerialNumber",
      "Model",
      "Expries",
      "Categories",
      "Status",
      "Segment",       // ✅ ensure required
      "assetOwner",
      "Note",
      "DefaultLocation",
      "CostCenter",
      "ReceivedDate",
      "Condition",
      "StoreLocation",
      "PONumber",
      "Order",
      "PurchaseNumber"
    ];

    // Improved validation
    const validationResult = validateCSV(csvData, requiredColumns);
    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          error: "Invalid CSV file structure. Missing required columns.",
          missingColumns: validationResult.missingColumns,
          foundColumns: validationResult.foundColumns
        },
        { status: 400 }
      );
    }

    // Check for duplicate serial numbers
    const serialNumbers = csvData.map(row => getColumnValue(row, "SerialNumber"));
    const existingAssets = await Asset.find({
      serialNumber: { $in: serialNumbers }
    });

    if (existingAssets.length > 0) {
      const duplicates = existingAssets.map((asset) => asset.serialNumber);
      return NextResponse.json(
        {
          error: "Duplicate serial numbers found",
          duplicates
        },
        { status: 400 }
      );
    }

    // Transform and insert data
    const transformedData = csvData.map(row => transformCSVData(row, assetUser));
    const result = await Asset.insertMany(transformedData);

    return NextResponse.json(
      {
        message: "Data successfully imported!",
        insertedCount: result.length,
        assets: result
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err.message
      },
      { status: 500 }
    );
  }
}

// Helper function to get column value regardless of case
function getColumnValue(row, columnName) {
  const normalizedColumnName = columnName.toLowerCase().trim();
  const key = Object.keys(row).find(
    k => k.toLowerCase().trim() === normalizedColumnName
  );
  return key ? row[key] : undefined;
}

// Helper function to validate CSV structure with improved error reporting
const validateCSV = (data, requiredColumns) => {
  if (!data || data.length === 0) {
    return { 
      valid: false, 
      missingColumns: requiredColumns,
      foundColumns: [] 
    };
  }

  const headers = Object.keys(data[0]).map(h => h.toLowerCase().trim());
  console.log("Normalized headers in CSV:", headers);
  console.log("Required columns:", requiredColumns.map(c => c.toLowerCase().trim()));

  const missingColumns = [];
  
  for (const col of requiredColumns) {
    const normalizedCol = col.toLowerCase().trim();
    if (!headers.includes(normalizedCol)) {
      missingColumns.push(col);
    }
  }

  return { 
    valid: missingColumns.length === 0,
    missingColumns,
    foundColumns: headers
  };
};

const transformCSVData = (csvRow, assetUser) => {
  const status = getColumnValue(csvRow, "Status");
  
  // For imports, we set checkOutDate and checkInDate based on status,
  // but we always use "created" as the action
  let checkOutDate = null;
  let checkInDate = null;
  
  // Set dates based on status, but don't change the action
  if (status === "Deployed") {
    checkOutDate = new Date();
  } else if (["MISStock", "Inactive"].includes(status)) {
    checkInDate = new Date();
  }

  function safelyParseDate(dateString) {
    if (!dateString) return null;

    // Try formats: DD-MM-YYYY, MM-DD-YYYY, YYYY-MM-DD
    try {
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            return new Date(dateString); // YYYY-MM-DD
          } else {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD-MM-YYYY
          }
        }
      }
      const date = new Date(dateString);
      return isNaN(date) ? null : date;
    } catch (e) {
      console.error("Date parsing error:", e);
      return null;
    }
  }

  return {
    nodeName: getColumnValue(csvRow, "NodeName"),
    serialNumber: getColumnValue(csvRow, "SerialNumber"),
    manufacturer: getColumnValue(csvRow, "Manufacturer"),
    type: getColumnValue(csvRow, "Type"),
    model: getColumnValue(csvRow, "Model"),
    expires: safelyParseDate(getColumnValue(csvRow, "Expries")),
    category: getColumnValue(csvRow, "Categories"),
    status: status,
    segment: getColumnValue(csvRow, "Segment"),
    
    assetOwner: getColumnValue(csvRow, "AssetOwner"),
    note: getColumnValue(csvRow, "Note"),
    defaultLocation: getColumnValue(csvRow, "DefaultLocation"),
    costCenter: getColumnValue(csvRow, "CostCenter"),
    receivedDate: safelyParseDate(getColumnValue(csvRow, "ReceivedDate")),
    condition: getColumnValue(csvRow, "Condition"),
    storeLocation: getColumnValue(csvRow, "StoreLocation"),
    poNumber: getColumnValue(csvRow, "PONumber"),
    order: getColumnValue(csvRow, "Order"),
    purchaseDate: safelyParseDate(getColumnValue(csvRow, "PurchaseNumber")),
    checkOutDate,
    checkInDate,
    assetHistory: [
      {
        user: getColumnValue(csvRow, "AssetOwner") || "None",
        updatedBy: assetUser,
        action: "created", // Always "created" for imports
        date: new Date(),
        status
      }
    ]
  };
};