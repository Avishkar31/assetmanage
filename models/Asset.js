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
  segment: String,
  assetOwner: {
  type: String
}, // Changed to String
  note: String,
  defaultLocation: {
    type: String,
    required: false
  },
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
      enum: ["created", "checkIn", "checkOut", "update", "disposed"] // added disposed
    },
    date: { type: Date, default: Date.now },
    status: String,
    updatedBy: String,
    assetOwner: String // 👈 add this if you want to display owner in history
  }
],
  accessories: String
});

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);
