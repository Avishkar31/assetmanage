import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
