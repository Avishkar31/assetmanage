import Asset from "models/Asset";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await verifyToken(req);
    if (!user || (user.role !== "admin" && user.role !== "regular")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serialNumber, nodeName, assetUser } = await req.json();

    if (!serialNumber || !nodeName) {
      return NextResponse.json(
        { error: "Serial number and node name are required." },
        { status: 400 }
      );
    }

    const asset = await Asset.findOne({ serialNumber, nodeName });
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    asset.status = "Inpool";
    asset.issueTo = null;
    asset.checkInDate = new Date();
    asset.assetHistory.push({
      user: assetUser,
      action: "checkIn",
      date: new Date(),
      status: "Inpool",
    });

    await asset.save();

    return NextResponse.json({
      message: "Asset checked in successfully",
      asset,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
