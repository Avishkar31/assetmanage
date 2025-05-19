// models/Manufacturer.js
import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  address: { 
    type: String,
    trim: true,
    default: ""
  },
  contact: { 
    type: String,
    trim: true,
    default: ""
  }
}, { timestamps: true });

// Prevent duplicate model error
export default mongoose.models.Manufacturer || mongoose.model("Manufacturer", ManufacturerSchema);