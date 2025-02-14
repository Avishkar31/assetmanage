// models/Asset.js
import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  nodeName: String,
  serialNumber: { type: String, required: true, unique: true },
  manufacturer: String,
  model: String,
  expires: Date,
  category: String,
  status: {
    type: String,
    enum: ["Deployed", "Inpool", "Inactive"],
    required: true
  },
  department: String,
  issueTo: String, // Changed to String
  note: String,
  defaultLocation: String,
  costCenter: String,
  receivedDate: Date,
  assetOwner: String,
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
      status: String
    }
  ]
});

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);
