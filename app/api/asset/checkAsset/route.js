import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";

export async function POST(req) {
  try {
    const data = await req.json();
    const { note, storeLocation, issueTo, status, nodeName, serialNumber, checkType, model } = data;

    // Basic validation for required fields
    if (!serialNumber) {
      return NextResponse.json(
        { error: "Serial number is required." },
        { status: 400 }
      );
    }
    
    if (!checkType) {
      return NextResponse.json(
        { error: "Check type is required (checkin or checkout)." },
        { status: 400 }
      );
    }

    // Find the existing asset by serial number
    const existingAsset = await Asset.findOne({ serialNumber });
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset with this serial number does not exist." },
        { status: 400 }
      );
    }

    // Common updates for both check-in and check-out
    existingAsset.nodeName = nodeName || existingAsset.nodeName;
    existingAsset.status = status || existingAsset.status;
    existingAsset.issueTo = issueTo || existingAsset.issueTo;
    existingAsset.storeLocation = storeLocation || existingAsset.storeLocation;
    existingAsset.note = note || existingAsset.note;

    if (checkType === "checkin") {
      // Check-in specific update
      existingAsset.checkInDate = new Date(); // Update check-in date to current time
    } else if (checkType === "checkout") {
      // Check-out specific update
      existingAsset.checkOutDate = new Date(); // Static check-out date
      existingAsset.model = model || existingAsset.model; // Update model if provided
    } else {
      return NextResponse.json(
        { error: "Invalid check type. It must be 'checkin' or 'checkout'." },
        { status: 400 }
      );
    }

    // Save the updated asset
    const updatedAsset = await existingAsset.save();
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (err) {
    console.log("ee",err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
