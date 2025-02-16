import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Manufacturer name is required"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    supportContact: {
      email: {
        type: String,
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Add index for better query performance
ManufacturerSchema.index({ name: 1 });

export default mongoose.models.Manufacturer || 
  mongoose.model("Manufacturer", ManufacturerSchema);

