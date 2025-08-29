import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";


export async function POST(req) {
  try {
    await dbConnect();
    

    const { serialNumber, nodeName, status, assetOwner, storeLocation, note, checkOutDate, assetUser } = await req.json();

    if (!serialNumber || !nodeName || !status || !assetOwner || !storeLocation || !checkOutDate) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const asset = await Asset.findOne({ serialNumber, nodeName });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    asset.status = status;
    asset.assetOwner = assetOwner;
    asset.checkOutDate = new Date(checkOutDate);
    asset.storeLocation = storeLocation;
    asset.note = note || "Standard check-out";

    asset.assetHistory.push({
      user: assetOwner,
      action: 'checkOut',
      date: new Date(),
      status: status,
      updatedBy: assetUser || "unknown-user"
    });

    await asset.save();

    const populatedAsset = await Asset.findById(asset._id)
      .populate('assetOwner')
      .populate('assetHistory.user');

    return NextResponse.json({
      message: "Asset checked out successfully",
      asset: populatedAsset
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}