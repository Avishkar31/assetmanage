import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";

export async function POST(req) {
  try {
    await dbConnect();

    // Parse request body
    const {
      serialNumber,
      nodeName,
      assetUser,
      assetOwner,
      status,
      storeLocation,
      note,
      checkinDate
    } = await req.json();

    // Validate required fields
    if (!serialNumber) {
      return NextResponse.json(
        { error: "Serial number is required." },
        { status: 400 }
      );
    }

    // Find the asset by serial number
    const asset = await Asset.findOne({ serialNumber });

    // Check if asset exists
    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found." },
        { status: 404 }
      );
    }

    // Update asset fields if provided
    if (nodeName) asset.nodeName = nodeName;
    if (status) asset.status = status;
    if (assetOwner) asset.assetOwner = assetOwner;
    if (storeLocation) asset.storeLocation = storeLocation;
    if (note) asset.note = note;

    // Set check-in date
    asset.checkInDate = checkinDate ? new Date(checkinDate) : new Date();

    // Add to asset history - MAKE SURE ACTION IS ONE OF THE ALLOWED ENUM VALUES
    asset.assetHistory.push({
      user: assetOwner || "Unknown",
      action: "checkIn",  // This must be one of: "checkIn", "checkOut", or "update"
      date: asset.checkInDate,
      status: status || asset.status,
      updatedBy: assetUser || "System"
    });

    // Save the updated asset
    await asset.save();

    return NextResponse.json({
      message: "Asset checked in successfully",
      asset: asset
    });

  } catch (error) {
    console.error("Check-in API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to check in asset",
        details: error.message
      },
      { status: 500 }
    );
  }
}