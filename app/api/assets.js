import dbConnect from "../../lib/dbConnect";
import Asset from "../../models/Asset";

export default async function handler(req, res) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const assets = await Asset.find({}); 
        res.status(200).json({ success: true, data: assets });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const asset = await Asset.create(req.body); 
        res.status(201).json({ success: true, data: asset });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
