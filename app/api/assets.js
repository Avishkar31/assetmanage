import dbConnect from "../../lib/dbConnect";
import Asset from "../../models/Asset";

export default async function handler(req, res) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (req.query.nextTag) {
          // Handle request for the next asset tag number
          const lastAsset = await Asset.findOne(
            {},
            {},
            { sort: { assetTag: -1 } }
          );
          const nextTag = lastAsset
            ? (parseInt(lastAsset.assetTag, 10) + 1).toString()
            : "1";
          res.status(200).json({ success: true, nextTag });
        } else {
          // Handle request for fetching all assets
          const assets = await Asset.find({});
          res.status(200).json({ success: true, data: assets });
        }
      } catch (error) {
        console.error("Error fetching assets:", error); // Improved logging
        res
          .status(500)
          .json({ success: false, error: "Failed to fetch assets." });
      }
      break;
    case "POST":
      try {
        // Validate required fields (you can customize this based on your schema)
        const { assetTag, nodeName } = req.body;
        if (!assetTag || !nodeName) {
          return res
            .status(400)
            .json({
              success: false,
              error: "Asset tag and node name are required."
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
