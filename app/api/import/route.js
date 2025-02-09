// pages/api/import.js
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Get the CSV file from the request (make sure to handle file uploads)
      const file = req.files.file; // Assuming the file is sent as `file` in the form-data

      // Validate the CSV columns
      const requiredColumns = ["column1", "column2", "column3"]; // Adjust based on your schema
      const csvData = await parseCSV(file);

      if (!validateCSV(csvData, requiredColumns)) {
        return res.status(400).json({ message: "Invalid CSV file structure." });
      }

      // Connect to the database
      const { db } = await connectToDatabase();

      // Insert the data into MongoDB
      const result = await db.collection("yourCollection").insertMany(csvData);

      res.status(200).json({ message: "Data successfully imported!", result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error importing data", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Parse CSV file function
async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    const parser = fs
      .createReadStream(file.path)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Validate CSV data structure
function validateCSV(data, requiredColumns) {
  if (data.length === 0) return false;

  const firstRow = Object.keys(data[0]);

  // Check if required columns are present
  for (const column of requiredColumns) {
    if (!firstRow.includes(column)) {
      return false;
    }
  }
  return true;
}
