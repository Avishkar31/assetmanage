import { parse } from "csv-parse";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect"; // Ensure this is correctly set up

export const config = {
  api: {
    bodyParser: false // Disable Next.js default body parser
  }
};

export default async function handler(req, res) {
  console.log("API Request Received:", req.method); // Debugging log

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed. Use POST." });
  }

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/uploads");
    form.keepExtensions = true;
    form.multiples = false; // Ensures only one file is processed

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("File Parsing Error:", err);
        return res
          .status(500)
          .json({ message: "File parsing error", error: err.message });
      }

      // Ensure file exists and is correctly structured
      if (!files.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;
      const filePath = uploadedFile.filepath || uploadedFile.path;
      console.log("Uploaded File Path:", filePath);

      // Validate CSV columns
      const requiredColumns = [
        "NodeName",
        "Manufacturer",
        "Serialnumber",
        "Model",
        "Expries",
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
        "PurchaseNumber"
      ];

      const csvData = await parseCSV(filePath);

      if (!validateCSV(csvData, requiredColumns)) {
        return res.status(400).json({ message: "Invalid CSV file structure." });
      }

      // Connect to the database
      await dbConnect();
      const db = (await dbConnect()).db;

      // Insert the data into MongoDB
      try {
        const result = await db.collection("assets").insertMany(csvData);
        res
          .status(200)
          .json({
            message: "Data successfully imported!",
            insertedCount: result.insertedCount
          });
      } catch (error) {
        console.error("Database Insertion Error:", error);
        return res
          .status(500)
          .json({ message: "Database insertion failed", error: error.message });
      }

      // Remove file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error) {
    console.error("Error Importing Data:", error);
    res
      .status(500)
      .json({ message: "Error importing data", error: error.message });
  }
}

// Parse CSV file function
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row) => {
        if (row.ReceivedDate) {
          row.ReceivedDate = new Date(row.ReceivedDate); // Convert ReceivedDate to Date type
        }
        results.push(row);
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// Validate CSV data structure
function validateCSV(data, requiredColumns) {
  if (data.length === 0) return false;

  const firstRow = Object.keys(data[0]);

  // Check if required columns are present
  return requiredColumns.every((column) => firstRow.includes(column));
}
