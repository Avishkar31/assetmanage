import mongoose from "mongoose";

const MonitorSchema = new mongoose.Schema(
  {
    prRequester: {
      type: String,
      required: [true, "PR Requester is required"],
      trim: true
    },
    manufacturer: {
      type: String, 
      required: [true, "Manufacturer is required"],
      trim: true
    },
    model: {
      type: String,
      required: [true, "Model name is required"],
      trim: true
    },
    prNumber: {
      type: String,
      required: [true, "PR number is required"],
      trim: true
    },
    poNumber: {
      type: String,
      required: [true, "PO number is required"],
      trim: true
    },
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true
    },
    status: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    assetHistory: [
      {
        user: String,
        action: { type: String, enum: ["checkIn", "checkOut"] },
        date: { type: Date, default: Date.now },
        status: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
MonitorSchema.index({ serialNumber: 1 });
MonitorSchema.index({ prNumber: 1 });

export default mongoose.models.Monitor ||
  mongoose.model("Monitor", MonitorSchema);
