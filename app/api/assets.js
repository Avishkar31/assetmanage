import dbConnect from "../../lib/dbConnect";
import Asset from "../../models/Asset";

export default async function handler(req, res) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Handle request for fetching all assets
        const assets = await Asset.find({});
        res.status(200).json({ success: true, data: assets });
      } catch (error) {
        console.error("Error fetching assets:", error); // Improved logging
        res
          .status(500)
          .json({ success: false, error: "Failed to fetch assets." });
      }
      break;
    case "POST":
      try {
        // Validate required fields according to the schema
        const { serialNumber, nodeName } = req.body;
        if (!serialNumber || !nodeName) {
          return res.status(400).json({
            success: false,
            error: "Serial number and node name are required."
          });
        }

        // Check if asset with the same serial number already exists
        const existingAsset = await Asset.findOne({ serialNumber });
        if (existingAsset) {
          return res.status(400).json({
            success: false,
            error: "Asset with this serial number already exists."
          });
        }

        // Create a new asset
        const asset = await Asset.create(req.body);
        res.status(201).json({ success: true, data: asset });
      } catch (error) {
        console.error("Error creating asset:", error); // Improved logging
        res
          .status(500)
          .json({ success: false, error: "Failed to create asset." });
      }
      break;
    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
