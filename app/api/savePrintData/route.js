import { NextResponse } from "next/server";
import Asset from "@/models/Asset";

export async function PUT(request) {
  try {
    const { nodeName, serialNumber, accessories, ...rest } =
      await request.json();

    // Check if the asset exists
    const asset = await Asset.findOne({ serialNumber });
    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    // Prepare the accessories string
    const accessoriesString = Object.entries(accessories)
      .map(([key, value]) => `${key}:${value === false ? "0" : value}`)
      .join(", ");

    console.log("accessoriesString", accessoriesString);
    // Update the asset
    const updatedAsset = await Asset.findOneAndUpdate(
      { serialNumber },
      {
        $set: {
          ...rest,
          accessories: accessoriesString,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedAsset },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
