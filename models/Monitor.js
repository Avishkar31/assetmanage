import mongoose from "mongoose";

const MonitorSchema = new mongoose.Schema({
  prRequester: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  prNumber: { type: String, required: true },
  poNumber: { type: String, required: true },
  serialNumber: { type: String, required: true },
  status: { type: String, required: true },
  username: { type: String, required: true },
  assetHistory: { type: Array, default: [] },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }
});

export default mongoose.models.Monitor ||
  mongoose.model("Monitor", MonitorSchema);
