import mongoose from "mongoose";

const MonitorSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, "Model name is required"],
      trim: true
    },
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true
    },
    poNumber: {
      type: String,
      required: [true, "PO number is required"],
      trim: true
    },
    team: {
      type: String,
      required: [true, "Team is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
MonitorSchema.index({ team: 1 });
MonitorSchema.index({ serialNumber: 1 });

export default mongoose.models.Monitor ||
  mongoose.model("Monitor", MonitorSchema);
