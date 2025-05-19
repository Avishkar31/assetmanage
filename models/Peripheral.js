// models/Peripheral.js
import mongoose from "mongoose";

// Check if the model already exists to prevent overwriting
const PeripheralSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["keyboard", "mouse", "headset", "webcam", "other"]
    },
    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Create a compound index for type and name to ensure uniqueness
PeripheralSchema.index({ type: 1, name: 1 }, { unique: true });

// Use this pattern to prevent "Model overwrite" errors in development with hot reloading
const Peripheral = mongoose.models.Peripheral || mongoose.model("Peripheral", PeripheralSchema);

export default Peripheral;