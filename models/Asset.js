import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  nodeName: String,
  serialNumber: {
    type: String,
    unique: true,
    required: true
  },
  manufacturer: { type: String, required: true },
  type: { type: String, required: true },
  model: String,
  expires: Date,
  category: String,
  status: {
    type: String,
    enum: [
      "Inpool",
      "New Purchase",
      "MIS Store",
      "Buyback",
      "Disposed",
      "Inactive",
      "Deployed"
    ],
    default: "",
    required: true
  },
  department: String,
  issueTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
  defaultLocation: String,
  costCenter: String,
  receivedDate: Date,
  assetOwner: String,
  condition: {
    type: String,
    enum: ["Excellent", "Good", "Fair", "Bad"],
    default: ""
  },
  storeLocation: String,
  killdiskDate: Date,
  attachedFile: String,
  disposedDate: Date,
  poNumber: String,
  order: String,
  purchaseDate: Date,
  checkInDate: Date,
  checkOutDate: Date,
  assetHistory: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      action: { type: String, enum: ["checkIn", "checkOut"] },
      date: { type: Date, default: Date.now },
      status: String
    }
  ]
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
