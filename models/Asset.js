import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  nodeName: String,
  serialNumber: {
    type: String,
    unique: true,
    required: true
  },
  manufacturer: { type: String, required: true },
<<<<<<< HEAD
=======
  // type: { type: String, required: true },
>>>>>>> 82a1ac98e4ccaf54a8167844ae45932e7f295c3b
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
      user: { id:Number,userName:String },
      action: { type: String, enum: ["checkIn", "checkOut"] },
      date: { type: Date, default: Date.now },
      status: String
    }
  ]
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
