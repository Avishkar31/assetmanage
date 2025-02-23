// app/api/asset/route.js
import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const {
      nodeName,
      serialNumber,
      assetTag,
      manufacturer,
      model,
      expires,
      category,
      status,
      department,
      issueTo,
      note,
      defaultLocation,
      costCenter,
      receivedDate,
      assetOwner,
      condition,
      storeLocation,
      killdiskDate,
      attachedFile,
      disposedDate,
      poNumber,
      order,
      purchaseDate,
      user,
    } = data;

    // Check if asset exists
    const existingAsset = await Asset.findOne({ serialNumber });
    if (existingAsset) {
      return NextResponse.json(
        { error: "Asset with this serial number already exists." },
        { status: 400 }
      );
    }

    // Determine checkIn/checkOut logic
    let checkOutDate = null;
    let checkInDate = null;
    let action = null;

    if (status === "Deployed") {
      checkOutDate = new Date();
      action = "checkOut";
    } else if (["Inpool", "Inactive"].includes(status)) {
      checkInDate = new Date();
      action = "checkIn";
    }

    // Create new asset
    const newAsset = new Asset({
      nodeName,
      serialNumber,
      assetTag,
      manufacturer,
      model,
      expires,
      category,
      status,
      department,
      issueTo,
      note,
      defaultLocation,
      costCenter,
      receivedDate,
      assetOwner,
      condition,
      storeLocation,
      killdiskDate,
      attachedFile,
      disposedDate,
      poNumber,
      order,
      purchaseDate,
      checkOutDate,
      checkInDate,
      assetHistory: [
        {
          user: user.siemensId,
          action,
          date: new Date(),
          status,
        },
      ],
    });

    const savedAsset = await newAsset.save();
    return NextResponse.json(savedAsset, { status: 201 });
  } catch (err) {
    console.log("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
