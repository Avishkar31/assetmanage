import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      note,
      storeLocation,
      issueTo,
      status,
      nodeName,
      serialNumber,
      checkType,
      model
    } = data;

    // Basic validation for required fields
    if (!serialNumber || !nodeName) {
      return NextResponse.json(
        { error: "Serial number and node name are required." },
        { status: 400 }
      );
    }

    if (!checkType) {
      return NextResponse.json(
        { error: "Check type is required (checkin or checkout)." },
        { status: 400 }
      );
    }

    // Find the existing asset by serial number and node name
    const existingAsset = await Asset.findOne({ serialNumber, nodeName });
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset with this serial number or node name does not exist." },
        { status: 400 }
      );
    }

    // Common updates for both check-in and check-out
    existingAsset.status = status || existingAsset.status;
    existingAsset.storeLocation = storeLocation || existingAsset.storeLocation;
    existingAsset.note = note || existingAsset.note;
 
    
    let user = await User.findOne({ fullName: issueTo?.fullName?.toLowerCase() });
    console.log("user",user)
    if (!user) {
      user = new User({
        fullName: issueTo?.fullName?.toLowerCase(), // Ensure the new user is saved with a lowercase fullName
        department: issueTo?.department
      });
      await user.save();
    }
    
    // Handling Check-Out
    if (checkType === "checkout") {
      // Check if 'issueTo' (user assignment) is provided
      if (!issueTo?.fullName || !issueTo?.department) {
        return NextResponse.json(
          { error: "IssueTo (fullName and department) is required for checkout." },
          { status: 400 }
        );
      }

      // Create or fetch the user who is receiving the asset
     

      // Update check-out specific fields
      existingAsset.issueTo = user._id;
      existingAsset.checkOutDate = new Date(); // Update check-out date to current time
      existingAsset.model = model || existingAsset.model;

      // Add to asset history for checkout
      existingAsset.assetHistory.push({
        user: user._id,
        action: "checkOut",
        date: new Date(),
        status: existingAsset.status,
      });

    } else if (checkType === "checkin") {
      existingAsset.issueTo = user._id;
      existingAsset.checkInDate = new Date(); // Update check-in date to current time

      existingAsset.assetHistory.push({
        user: existingAsset.issueTo, // Since no user is assigned on check-in, leave it as null
        action: "checkIn",
        date: new Date(),
        status: existingAsset.status,
      });

    } else {
      return NextResponse.json(
        { error: "Invalid check type. It must be 'checkin' or 'checkout'." },
        { status: 400 }
      );
    }

    // Save the updated asset
    const updatedAsset = await existingAsset.save();
    return NextResponse.json(updatedAsset, { status: 200 });

  } catch (err) {
    console.error("Error in POST handler:", err); // Added more detailed logging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
