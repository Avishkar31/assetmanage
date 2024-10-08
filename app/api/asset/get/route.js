import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";
import dbConnect from "lib/dbConnect";

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const serialNumber = searchParams.get("serialNumber");
  await dbConnect();

  try {
    console.log("serialNumber", serialNumber);
    const existingAsset = await Asset.findOne({
      serialNumber: String(serialNumber)
    }).populate({
      path: 'assetHistory.user', 
      model: User,
      select: 'name',
      options: { skipInvalidIds: true } // Ensures invalid references are skipped
    });
    if (!existingAsset) {
      return NextResponse.json({ error: "asset not found" }, { status: 404 });
    }
    return NextResponse.json(existingAsset, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
