
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import Asset from "@/models/Asset";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");
    const assetUser = formData.get("assetUser") || "SYSTEM";

    // 1. Check if file exists
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: "No file provided",
        userMessage: "Please select a CSV file to upload."
      }, { status: 400 });
    }

    // 2. Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ 
        success: false,
        error: "Invalid file type",
        userMessage: "Please upload only CSV files (.csv extension required)."
      }, { status: 400 });
    }

    // 3. Read and parse CSV
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileContent = fileBuffer.toString();

    let csvData;
    try {
      csvData = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (parseError) {
      return NextResponse.json({ 
        success: false,
        error: "CSV parsing failed",
        userMessage: "Your CSV file format is invalid. Please check:\n• Use comma separators\n• Ensure all rows have same number of columns\n• Remove special characters"
      }, { status: 400 });
    }

    // 4. Check if CSV has data
    if (!csvData || csvData.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: "Empty CSV file",
        userMessage: "Your CSV file is empty. Please add data rows and try again."
      }, { status: 400 });
    }

    // 5. Validate required columns
    const requiredColumns = [
      "NodeName", "Manufacturer", "Type", "SerialNumber", "Model", 
      "Expries", "Categories", "Status", "Segment", "assetOwner",
      "Note", "DefaultLocation", "CostCenter", "ReceivedDate", 
      "Condition", "StoreLocation", "PONumber", "Order", "PurchaseNumber"
    ];

    const headers = Object.keys(csvData[0]);
    const missingColumns = requiredColumns.filter(reqCol => 
      !headers.find(header => header.toLowerCase().trim() === reqCol.toLowerCase().trim())
    );

    if (missingColumns.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Missing required columns",
        userMessage: `Missing columns: ${missingColumns.join(', ')}\n\nRequired columns:\n${requiredColumns.join(', ')}\n\nYour file has:\n${headers.join(', ')}`,
        missingColumns,
        foundColumns: headers,
        requiredColumns
      }, { status: 400 });
    }

    // 6. Validate data in rows
    const validationErrors = [];
    const validStatuses = ["Active", "Deployed", "MISStock", "Inactive", "Disposed"];

    csvData.forEach((row, index) => {
      const rowNum = index + 2; // +2 for header row

      // Check required fields
      if (!getColumnValue(row, "SerialNumber")) {
        validationErrors.push(`Row ${rowNum}: SerialNumber is required`);
      }
      if (!getColumnValue(row, "Type")) {
        validationErrors.push(`Row ${rowNum}: Type is required`);
      }
      if (!getColumnValue(row, "Status")) {
        validationErrors.push(`Row ${rowNum}: Status is required`);
      }
      if (!getColumnValue(row, "Segment")) {
        validationErrors.push(`Row ${rowNum}: Segment is required`);
      }

      // Validate status
      const status = getColumnValue(row, "Status");
      if (status && !validStatuses.includes(status)) {
        validationErrors.push(`Row ${rowNum}: Invalid status '${status}'. Use: ${validStatuses.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Data validation failed",
        userMessage: `Please fix these issues:\n\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? `\n\n...and ${validationErrors.length - 5} more issues` : ''}`,
        validationErrors
      }, { status: 400 });
    }

    // 7. Check for duplicate serial numbers
    const serialNumbers = csvData.map(row => getColumnValue(row, "SerialNumber")).filter(sn => sn);
    const duplicatesInFile = serialNumbers.filter((item, index) => serialNumbers.indexOf(item) !== index);
    
    if (duplicatesInFile.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Duplicate serial numbers in file",
        userMessage: `Duplicate serial numbers found in your file:\n${[...new Set(duplicatesInFile)].join(', ')}\n\nPlease make each serial number unique.`,
        duplicates: [...new Set(duplicatesInFile)]
      }, { status: 400 });
    }

    // 8. Check existing serial numbers in database
    const existingAssets = await Asset.find({
      serialNumber: { $in: serialNumbers }
    });

    if (existingAssets.length > 0) {
      const existingSerials = existingAssets.map(asset => asset.serialNumber);
      return NextResponse.json({
        success: false,
        error: "Serial numbers already exist",
        userMessage: `These serial numbers already exist in database:\n${existingSerials.join(', ')}\n\nPlease change them to unique values or remove these rows.`,
        duplicates: existingSerials
      }, { status: 400 });
    }

    // 9. Transform and insert data
    const transformedData = csvData.map(row => transformCSVData(row, assetUser));
    const result = await Asset.insertMany(transformedData);

    return NextResponse.json({
      success: true,
      message: "Data successfully imported!",
      insertedCount: result.length,
      assets: result
    }, { status: 201 });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      userMessage: "Something went wrong. Please try again or contact support."
    }, { status: 500 });
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

const transformCSVData = (csvRow, assetUser) => {
  const status = getColumnValue(csvRow, "Status");
  
  let checkOutDate = null;
  let checkInDate = null;
  
  if (status === "Deployed") {
    checkOutDate = new Date();
  } else if (["MISStock", "Inactive"].includes(status)) {
    checkInDate = new Date();
  }

  function safelyParseDate(dateString) {
    if (!dateString) return null;
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
    assetOwner: getColumnValue(csvRow, "assetOwner"),
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
        user: getColumnValue(csvRow, "assetOwner") || "None",
        updatedBy: assetUser,
        action: "created",
        date: new Date(),
        status
      }
    ]
  };
};
