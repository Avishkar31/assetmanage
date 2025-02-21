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
  },
  {
    timestamps: true
  }
);

// Add index for better query performance
ManufacturerSchema.index({ name: 1 });

// Check for errors in the schema definition
ManufacturerSchema.post('save', function(error, doc, next) {
  if (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Manufacturer name must be unique.'));
    } else {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.models.Manufacturer || 
  mongoose.model("Manufacturer", ManufacturerSchema);
