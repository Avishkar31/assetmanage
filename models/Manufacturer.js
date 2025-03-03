import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", ManufacturerSchema);
