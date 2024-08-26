import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  assetTag: { type: String },
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
    default: "Inpool"
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
    default: "Excellent"
  },
  storeLocation: String,
  killdiskDate: Date,
  attachedFile: String,
  disposedDate: Date,
  poNumber: String,
  order: String,
  purchaseDate: Date
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
