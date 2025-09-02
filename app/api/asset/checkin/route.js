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
      user // ✅ ADD: Get user data from frontend
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

    // ✅ CHANGE: Store previous asset owner before updating
    const previousAssetOwner = asset.assetOwner;

    // Update asset fields if provided
    if (nodeName) asset.nodeName = nodeName;
    if (status) asset.status = status;
    if (assetOwner) asset.assetOwner = assetOwner;
    if (storeLocation) asset.storeLocation = storeLocation;
    if (note) asset.note = note;

    // Set check-in date - ✅ CHANGE: Use full date object
    asset.checkInDate = new Date();
    
    // ✅ CHANGE: Clear checkout date when checking in
    asset.checkOutDate = null;

    // ✅ CHANGE: Add to asset history with proper schema fields
    asset.assetHistory.push({
      user: user?.siemensId || assetUser || "System", // ✅ Who performed the action
      action: "checkIn", // ✅ This matches your enum
      date: asset.checkInDate,
      status: status || asset.status,
      updatedBy: user?.siemensId || assetUser || "System", // ✅ Who updated the record
      assetOwner: assetOwner || asset.assetOwner, // ✅ Current asset owner
      previousAssetOwner: previousAssetOwner, // ✅ Previous asset owner
      lastChange: [], // ✅ Array of strings for changes
      note: note || `Asset checked in with status: ${status || asset.status}` // ✅ Descriptive note
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