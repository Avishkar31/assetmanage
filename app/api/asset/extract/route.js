import { getAssetData } from "../../../lib/assetService";
import { Parser } from "json2csv"; // Import json2csv for better formatting

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { assetId } = req.query;

  try {
    const assetData = await getAssetData(assetId);

    if (!assetData || (Array.isArray(assetData) && assetData.length === 0)) {
      return res.status(404).json({ error: "No asset data found" });
    }

    const parser = new Parser();
    const csvData = parser.parse(
      Array.isArray(assetData) ? assetData : [assetData]
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=asset_${assetId}.csv`
    );

    return res.status(200).send(csvData);
  } catch (error) {
    console.error("Asset extraction error:", error);
    return res.status(500).json({ error: "Failed to extract asset data" });
  }
}
