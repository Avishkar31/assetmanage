import fs from 'fs';
import { Parser } from 'json2csv';
import { parse } from 'csv-parse/sync';

// Function to convert JSON to CSV
export const jsonToCsv = (jsonData) => {
  const parser = new Parser();
  return parser.parse(jsonData);
};

// Function to convert CSV to JSON
export const csvToJson = (csvData) => {
  return parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });
};

// Function to save CSV to a file
export const saveCsvToFile = (csvData, filePath) => {
  fs.writeFileSync(filePath, csvData);
};

// Function to read CSV from a file and convert to JSON
export const readCsvToJsonFromFile = (filePath) => {
  const csvData = fs.readFileSync(filePath);
  return csvToJson(csvData);
};
