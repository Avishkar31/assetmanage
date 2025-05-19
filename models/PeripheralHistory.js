// models/PeripheralHistory.js
import mongoose from "mongoose";

const PeripheralHistorySchema = new mongoose.Schema(
  {
    peripheralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Peripheral",
      required: true
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: ["add", "remove"]
    },
    quantity: {
      type: Number,
      required: true
    },
    previousCount: {
      type: Number,
      required: true
    },
    newCount: {
      type: Number,
      required: true
    },
    performedBy: {
      type: String,
      default: "System"
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

const PeripheralHistory = mongoose.models.PeripheralHistory || mongoose.model("PeripheralHistory", PeripheralHistorySchema);

export default PeripheralHistory;