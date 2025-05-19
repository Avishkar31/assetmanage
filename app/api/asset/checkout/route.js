import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";
import { verifyToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    // const user = await verifyToken(req);
    
    // if (!user || (user.role !== 'admin' && user.role !== 'regular')) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { serialNumber, nodeName, issueTo,assetUser } = await req.json();

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

    asset.status = 'Deployed';
    asset.issueTo = issueTo;
    asset.checkOutDate = new Date();
    asset.assetHistory.push({
      user: issueTo,
      action: 'checkOut',
      date: new Date(),
      status: 'Deployed',
      updatedBy: assetUser, // Assuming issueTo is the user checking out the asset
    });

    await asset.save();

    const populatedAsset = await Asset.findById(asset._id)
      .populate('issueTo')
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