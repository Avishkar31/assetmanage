import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    // Validate that the ID is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid asset ID format" }, { status: 400 });
    }

    // Find and delete the asset
    const deletedAsset = await Asset.findByIdAndDelete(id);

    // Check if asset was found
    if (!deletedAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    console.log("Asset deleted successfully:", deletedAsset);

    return NextResponse.json(
      { message: "Asset deleted successfully", deletedAsset },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
