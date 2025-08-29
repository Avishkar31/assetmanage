      // models/Segments.js
      import mongoose from "mongoose";

      const SegmentSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, "Please provide a Segment name"],
          unique: true,
          trim: true,
          maxlength: [50, "Name cannot be more than 50 characters"]
        },
        description: {
          type: String,
          trim: true,
          maxlength: [500, "Description cannot be more than 500 characters"]
        },
        segment: {
          type: String,
          required: [true, "Please provide a segment name"],
          trim: true,
          maxlength: [50, "Segment name cannot be more than 50 characters"]
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      });

      // Prevent model overwrite error during development with hot reloading
      const Segment = mongoose.models.Segment || mongoose.model("Segment", SegmentSchema);

      export default Segment;