import { Schema, model, models } from "mongoose";

const iphoneSchema = new Schema(
  {
    model: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true
    },
    poNumber: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["Available", "Checked Out"],
      default: "Available"
    },
    purchaseDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Iphone = models.Iphone || model("Iphone", iphoneSchema);

export default Iphone;
