// models/Monitor.js
import mongoose from "mongoose";

const historyEntrySchema = new mongoose.Schema({
  user: {
    type: String,
    required: false
  },
  updatedBy: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'statusChange', 'checkIn', 'checkOut']
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: String,
  previousStatus: String,
  previousIssueTo: String
});

const monitorSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  prNumber: String,
  poNumber: String,
  prRequester: String,
  status: {
    type: String,
    required: true,
    enum: ['inpool', 'deployed', 'disposed'],
    default: 'inpool'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  issueTo: {
    type: String,
    default: ""
  },
  username: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  assetHistory: [historyEntrySchema]
});

const Monitor = mongoose.models.Monitor || mongoose.model('Monitor', monitorSchema);

export default Monitor;