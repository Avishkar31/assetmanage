// models/Asset.js
import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  nodeName: String,
  serialNumber: { type: String, required: true, unique: true },
  manufacturer: String,
  type: String,
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
      "Deployed",
    ],
    required: true,
  },
  segment: String,
  assetOwner: { type: String },
  note: String,
  defaultLocation: { type: String, required: false },
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
      user: String,
      action: {
        type: String,
        enum: ["created", "checkIn", "checkOut", "update", "disposed"],
      },
      date: { type: Date, default: Date.now },
      status: String,
      updatedBy: String,
      assetOwner: String,
      previousAssetOwner: String,
      changedFields: [String], // Array of field names that changed
      // Store detailed changes as plain object instead of Map for better MongoDB compatibility
      detailedChanges: {
        type: Object,
        default: {}
      },
      note: String,
    },
  ],
  // Changed accessories to be more flexible - can store as string or object
  accessories: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: String
});

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);