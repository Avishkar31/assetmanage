import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";

export async function POST(req) {
  try {
    const data = await req.json();
    const { note, storeLocation, issueTo, status, nodeName, serialNumber, checkType, model } = data;

    // Basic validation for required fields
    if (!serialNumber || !nodeName) {
      return NextResponse.json(
        { error: "Serial number  and nodename is required." },
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
    const existingAsset = await Asset.findOne({ serialNumber,nodeName });
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset with this serial number or nodeName does not exist." },
        { status: 400 }
      );
    }

    // Common updates for both check-in and check-out
    existingAsset.status = status || existingAsset.status;
    existingAsset.issueTo = issueTo || existingAsset.issueTo;
    existingAsset.storeLocation = storeLocation || existingAsset.storeLocation;
    existingAsset.note = note || existingAsset.note;

    if (checkType === "checkin") {
      // Check-in specific update
      existingAsset.checkInDate = new Date(); // Update check-in date to current time
    } else if (checkType === "checkout") {
      // Check-out specific update
      existingAsset.checkOutDate = new Date();
      existingAsset.model = model || existingAsset.model;
    } else {
      return NextResponse.json(
        { error: "Invalid check type. It must be 'checkin' or 'checkout'." },
        { status: 400 }
      );
    }

    const updatedAsset = await existingAsset.save();
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (err) {
    console.log("ee",err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
