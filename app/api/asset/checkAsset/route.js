import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const {
      note,
      storeLocation,
      assetOwner,
      status,
      nodeName,
      serialNumber,
      checkType,
      model,
      purchaseDate,
      assetUser  // Changed from currentUser to assetUser for consistency
    } = data;

    if (!serialNumber || !nodeName) {
      console.error("Missing serial number or node name");
      return NextResponse.json(
        { error: "Serial number and node name are required." },
        { status: 400 }
      );
    }

    if (!checkType) {
      console.error("Missing check type");
      return NextResponse.json(
        { error: "Check type is required (checkin or checkout)." },
        { status: 400 }
      );
    }

    if (!assetUser) {
      console.error("Missing current user information");
      return NextResponse.json(
        { error: "Current user information is required." },
        { status: 400 }
      );
    }

    const existingAsset = await Asset.findOne({ serialNumber, nodeName });
    if (!existingAsset) {
      console.error("Asset not found");
      return NextResponse.json(
        { error: "Asset with this serial number or node name does not exist." },
        { status: 400 }
      );
    }

    // Update basic fields
    existingAsset.status = status || existingAsset.status;
    existingAsset.storeLocation = storeLocation || existingAsset.storeLocation;
    existingAsset.note = note || existingAsset.note;

    // Update purchase date if provided
    if (purchaseDate) {
      existingAsset.purchaseDate = new Date(purchaseDate);
    }

    let user = null;
    if (assetOwner) {
      user = await User.findOne({ fullName: assetOwner?.toLowerCase() });

      if (!user) {
        user = new User({
          fullName: assetOwner?.toLowerCase(),
          createdDate: Date.now(),
          segment: "default",
          password: "defaultPassword",
          siemensId: `siemens-${Date.now()}`
        });
        await user.save();
      }
    }

    if (!existingAsset.assetHistory) {
      existingAsset.assetHistory = [];
    }

    if (checkType === "checkout") {
      if (!assetOwner) {
        console.error("Missing assetOwner for checkout");
        return NextResponse.json(
          { error: "AssetOwner is required for checkout." },
          { status: 400 }
        );
      }

      existingAsset.assetOwner = user._id;
      existingAsset.checkOutDate = new Date();
      if (model) existingAsset.model = model;

      existingAsset.assetHistory.push({
        user: assetOwner, // This is the recipient
        updatedBy: assetUser, // Simplified to match check-in API
        action: "checkOut",
        date: new Date(),
        status: existingAsset.status,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined
      });
    } else if (checkType === "checkin") {
      existingAsset.assetOwner = user?._id || null;
      existingAsset.checkInDate = new Date();

      existingAsset.assetHistory.push({
        user: assetOwner || null, // This is the recipient
        updatedBy: assetUser, // Simplified to match check-in API
        action: "checkIn",
        date: new Date(),
        status: existingAsset.status,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined
      });
    } else {
      console.error("Invalid check type");
      return NextResponse.json(
        { error: "Invalid check type. It must be 'checkin' or 'checkout'." },
        { status: 400 }
      );
    }

    // Add validation for purchase date if needed
    if (purchaseDate && isNaN(new Date(purchaseDate).getTime())) {
      return NextResponse.json(
        { error: "Invalid purchase date format." },
        { status: 400 }
      );
    }

    const updatedAsset = await existingAsset.save();
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}