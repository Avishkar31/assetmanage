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
  previousAssetOwner: String
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
    enum: ['MISStock', 'deployed', 'disposed'],
    default: 'MISStock'
  },
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  },
  assetOwner: {
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