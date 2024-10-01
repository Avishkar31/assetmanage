import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import dbConnect from "lib/dbConnect";

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const serialNumber = searchParams.get("serialNumber");
  await dbConnect();

  try {
    const existingAsset = await Asset.findOne({
      serialNumber: String(serialNumber)
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
