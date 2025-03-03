// /api/Manufacturer.js (Server-Side)
import dbConnect from "../../../lib/dbConnect";
import Manufacturer from "../../../models/Manufacturer";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const manufacturers = await Manufacturer.find({});
        console.log("Manufacturers found:", manufacturers); // Add this line
        return res.status(200).json({ success: true, data: manufacturers });
      } catch (error) {
        console.error("GET Error:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "POST":
      try {
        const { name, address, contact } = req.body;
        if (!name?.trim() || !address?.trim() || !contact?.trim()) {
          return res
            .status(400)
            .json({ success: false, error: "All fields are required" });
        }

        const existing = await Manufacturer.findOne({ name });
        if (existing) {
          return res
            .status(400)
            .json({ success: false, error: "Manufacturer already exists" });
        }

        const newManufacturer = await Manufacturer.create({
          name,
          address,
          contact
        });
        return res.status(201).json({ success: true, data: newManufacturer });
      } catch (error) {
        console.error("POST Error:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "PUT":
      try {
        const { id } = req.query;
        if (!id) {
          return res
            .status(400)
            .json({ success: false, error: "ID is required" });
        }

        const { name, address, contact } = req.body;
        const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
          id,
          { name, address, contact },
          { new: true, runValidators: true }
        );

        if (!updatedManufacturer) {
          return res
            .status(404)
            .json({ success: false, error: "Manufacturer not found" });
        }

        return res
          .status(200)
          .json({ success: true, data: updatedManufacturer });
      } catch (error) {
        console.error("PUT Error:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "DELETE":
      try {
        const { id } = req.query;
        if (!id) {
          return res
            .status(400)
            .json({ success: false, error: "ID is required" });
        }

        const deleted = await Manufacturer.findByIdAndDelete(id);
        if (!deleted) {
          return res
            .status(404)
            .json({ success: false, error: "Manufacturer not found" });
        }

        return res.status(200).json({
          success: true,
          message: "Manufacturer deleted successfully"
        });
      } catch (error) {
        console.error("DELETE Error:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}
