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
        enum: ["created", "checkIn", "checkOut", "update", "disposed"]
      },
      date: { type: Date, default: Date.now },
      status: String,
      updatedBy: String,
      assetOwner: String,
      changes: [
        
      ]
    }
  ],
  accessories: {
    CPU: { type: Boolean, default: false },
    "LCD Monitor": { type: Boolean, default: false },
    "Docking Station": { type: Boolean, default: false },
    Keyboard: { type: Boolean, default: false },
    Mouse: { type: Boolean, default: false },
    "Power Adapter (Laptop)": { type: Boolean, default: false },
    "Power Adaptor (Docking station)": { type: Boolean, default: false },
    "Laptop Bag": { type: Boolean, default: false },
    "Modular Battery": { type: Boolean, default: false },
    "Laptop Lock": { type: Boolean, default: false },
    "Internal HDD/ External HDD": { type: Boolean, default: false },
    Headphone: { type: Boolean, default: false },
    Cardreader: { type: Boolean, default: false },
    Printer: { type: Boolean, default: false },
    Mobile: { type: Boolean, default: false }
  }
});

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);
