import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      assetTag,
      nodeName,
      serialNumber,
      manufacturer,
      type,
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
    } = data;

    // Check if asset with the same serial number already exists
    const existingAsset = await Asset.findOne({ serialNumber });
    if (existingAsset) {
      return NextResponse.json(
        { error: "Asset with this serial number already exists." },
        { status: 400 }
      );
    }

    // If issueTo contains user details, create a new user
    let user;
    if (issueTo?.fullName && issueTo?.department) {
      user = new User({
        fullName: issueTo?.fullName?.toLowerCase(),
        department: issueTo?.department,
      });
      await user.save(); // Save the user in the database
    }

    // Determine checkIn/checkOut logic based on status
    let checkOutDate = null;
    let checkInDate = null;
    let action = null;

    if (status === "Deployed") {
      checkOutDate = new Date(); // Set checkOut date to current date
      action = "checkOut";
    } else if (["Inpool", "Inactive"].includes(status)) {
      checkInDate = new Date(); // Set checkIn date to current date
      action = "checkIn";
    }

    // Create the new asset
    const newAsset = new Asset({
      assetTag,
      nodeName,
      serialNumber,
      manufacturer,
      type,
      model,
      expires,
      category,
      status,
      department,
      issueTo: user?._id || null, // Assign user ID if user is created
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
      checkOutDate, // Set checkOutDate if applicable
      checkInDate,  // Set checkInDate if applicable
      assetHistory: [
        {
          user: user?._id || null,
          action, // "checkIn" or "checkOut"
          date: new Date(), // Log current date for this action
          status,
        },
      ],
    });

    // Save the new asset
    const savedAsset = await newAsset.save();

    return NextResponse.json(savedAsset, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
