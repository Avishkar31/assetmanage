import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { 
      serialNumber, 
      nodeName, 
      status, 
      assetOwner, 
      storeLocation, 
      note, 
      checkOutDate, 
      assetUser,
      user // ✅ ADD: Get user data from frontend
    } = await req.json();

    // ✅ UPDATED: More flexible validation
    if (!serialNumber || !status || !assetOwner) {
      return NextResponse.json(
        { error: "Serial number, status, and asset owner are required." },
        { status: 400 }
      );
    }

    // ✅ UPDATED: Find by serial number only (more reliable)
    const asset = await Asset.findOne({ serialNumber });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // ✅ ADD: Store previous asset owner before updating
    const previousAssetOwner = asset.assetOwner;

    // Update asset fields
    asset.status = status;
    asset.assetOwner = assetOwner;
    asset.checkOutDate = checkOutDate ? new Date(checkOutDate) : new Date();
    
    // ✅ ADD: Clear check-in date when checking out
    asset.checkInDate = null;
    
    if (storeLocation) asset.storeLocation = storeLocation;
    if (nodeName) asset.nodeName = nodeName;
    asset.note = note || "Standard check-out";

    // ✅ UPDATED: Complete asset history entry with all required fields
    asset.assetHistory.push({
      user: user?.siemensId || assetUser || "System", // ✅ Who performed the action
      action: 'checkOut',
      date: new Date(),
      status: status,
      updatedBy: user?.siemensId || assetUser || "System", // ✅ Who updated the record
      assetOwner: assetOwner, // ✅ ADD: Current asset owner
      previousAssetOwner: previousAssetOwner, // ✅ ADD: Previous asset owner
      lastChange: [], // ✅ ADD: Array of changes (empty for checkout)
      note: note || `Asset checked out to ${assetOwner}` // ✅ ADD: Descriptive note
    });

    await asset.save();

    // ✅ UPDATED: Remove populate calls (they're not needed for strings)
    const updatedAsset = await Asset.findById(asset._id);

    return NextResponse.json({
      message: "Asset checked out successfully",
      asset: updatedAsset
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Failed to check out asset", details: error.message }, 
      { status: 500 }
    );
  }
}