import { getAssetData } from "@/lib/assetService";
import { Parser } from "json2csv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method Not Allowed. Use GET request." });
  }

  try {
    const { assetId } = req.query;

    // Fetch asset data (single asset or all assets if no ID is provided)
    const assetData = await getAssetData(assetId);

    if (!assetData || (Array.isArray(assetData) && assetData.length === 0)) {
      return res.status(404).json({ error: "No asset data found." });
    }

    // Convert JSON to CSV
    const parser = new Parser();
    const csvData = parser.parse(
      Array.isArray(assetData) ? assetData : [assetData]
    );

    // Set response headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${assetId ? `asset_${assetId}` : "all_assets"}.csv`
    );

    return res.status(200).send(csvData);
  } catch (error) {
    console.error("Asset Export Error:", error);
    return res.status(500).json({ error: "Failed to export asset data." });
  }
}
