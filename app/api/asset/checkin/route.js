import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";


export async function POST(req) {
  try {
    await dbConnect();
    // const user = await verifyToken(req);
    
    // if (!user || (user.role !== "admin" && user.role !== "regular")) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { serialNumber, nodeName, assetUser,issueTo } = await req.json();

    if (!serialNumber || !nodeName) {
      return NextResponse.json(
        { error: "Serial number and node name are required." },
        { status: 400 }
      );
    }

    const asset = await Asset.findOne({ serialNumber, nodeName })
      .populate('issueTo')
      .populate('assetHistory.user');

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // const previousIssueTo = asset.issueTo;
    
    asset.status = "Inpool";
    asset.issueTo = issueTo;
    asset.checkInDate = new Date();
    asset.assetHistory.push({
      user: issueTo,
      action: "checkIn",
      date: new Date(),
      status: "Inpool",  
      updatedBy: assetUser, // Assuming assetUser is the user checking in the asset
    });

    await asset.save();

    const populatedAsset = await Asset.findById(asset._id)
      .populate('issueTo')
      .populate('assetHistory.user')

    return NextResponse.json({
      message: "Asset checked in successfully",
      asset: populatedAsset
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}