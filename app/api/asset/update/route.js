// app/api/asset/update/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Asset from "@/models/Asset";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
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
      user
    } = data;

    // Get the existing asset
    const existingAsset = await Asset.findById(id);
    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check if serial number is being changed and if it already exists
    if (serialNumber !== existingAsset.serialNumber) {
      const duplicateAsset = await Asset.findOne({ serialNumber });
      if (duplicateAsset) {
        return NextResponse.json(
          { error: "Asset with this serial number already exists." },
          { status: 400 }
        );
      }
    }

    // Determine checkIn/checkOut logic
    let checkOutDate = existingAsset.checkOutDate;
    let checkInDate = existingAsset.checkInDate;
    let action = null;

    // If status is changing, update check in/out dates
    if (status !== existingAsset.status) {
      if (status === "Deployed" && existingAsset.status !== "Deployed") {
        checkOutDate = new Date();
        action = "checkOut";
      } else if (
        ["Inpool", "Inactive"].includes(status) &&
        !["Inpool", "Inactive"].includes(existingAsset.status)
      ) {
        checkInDate = new Date();
        action = "checkIn";
      } else {
        action = "update";
      }
    } else {
      action = "update";
    }

    // Create history entry
    const historyEntry = {
      user: user.siemensId,
      action,
      date: new Date(),
      status
    };

    // Update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      {
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
        $push: { assetHistory: historyEntry }
      },
      { new: true }
    );

    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (err) {
    console.log("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
