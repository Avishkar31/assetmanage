// models/Asset.js
import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  nodeName: String,
  serialNumber: { type: String, required: true, unique: true },
  manufacturer: String,
  type: String, // Changed to String for consistency
  model: String,
  expires: Date,
  category: String,
  status: {
    type: String,
    enum: [
      "MISStock",
      "New Purchase",
      "Buyback",
      "Disposed",
      "Inactive",
      "Deployed"
    ],
    required: true
  },
  department: String,
  assetOwner: String, // Changed to String
  note: String,
  defaultLocation: String,
  costCenter: String,
  receivedDate: Date,
  condition: String,
  storeLocation: String,
  killdiskDate: Date,
  attachedFile: String,
  disposedDate: Date,
  poNumber: String,
  order: String,
  purchaseDate: Date,
  checkOutDate: Date,
  checkInDate: Date,
  assetHistory: [
    {
      user: String, // Changed to String
      action: { type: String, enum: ["checkIn", "checkOut"] },
      date: { type: Date, default: Date.now },
      status: String,
      updatedBy: String,
    }
  ],
  accessories: String
});

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);
