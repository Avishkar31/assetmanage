// models/Teams.js
import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a team name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"]
  },
  department: {
    type: String,
    required: [true, "Please provide a department name"],
    trim: true,
    maxlength: [50, "Department name cannot be more than 50 characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent model overwrite error during development with hot reloading
const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;