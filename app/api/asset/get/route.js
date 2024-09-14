import { NextResponse } from "next/server";
import  Asset from "../../../../models/Asset"

export async function GET(req) {
  const { serialNumber} = req.query;
  try {
    const existingAsset = await Asset.findOne({ serialNumber });
    if (!existingAsset) {
      return NextResponse.json({ error: "asset not found" }, { status: 404 });
    }
    return NextResponse.json(existingAsset, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}