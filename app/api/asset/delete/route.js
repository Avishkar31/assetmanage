// app/api/asset/delete/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Find and delete the asset
    const deletedAsset = await Asset.findByIdAndDelete(id);

    // Check if asset was found
    if (!deletedAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Asset deleted successfully", deletedAsset },
      { status: 200 }
    );
  } catch (err) {
    console.log("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
