import { NextResponse } from "next/server";
import  Asset from "../../../../models/Asset"

export async function GET(req) {
  const { id } = req.query;
  try {
    const asset = await Asset.findById(id);
    if (!asset) {
      return NextResponse.json({ error: "asset not found" }, { status: 404 });
    }
    return NextResponse.json(asset, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}