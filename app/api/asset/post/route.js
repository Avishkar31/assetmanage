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
      manufacturer,
      type, 
      model,
      expires,
      category,
      status,
      segment,
      assetOwner,
      note,
      defaultLocation,
      costCenter,
      receivedDate,
      condition,
      storeLocation,
      killdiskDate,
      attachedFile,
      disposedDate,
      poNumber,
      order,
      purchaseDate,
      accessories,
      user, // ✅ Add this - user data should come from frontend
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

    if (status === "Deployed") {
      checkOutDate = new Date();
    } else if (["MISStock", "Inactive"].includes(status)) {
      checkInDate = new Date();
    }

    // Alternative accessories handling
    const assetAccessories = {};
    const defaultAccessories = [
      "CPU", "LCD Monitor", "Docking Station", "Keyboard", "Mouse",
      "Power Adapter (Laptop)", "Power Adaptor (Docking station)", 
      "Laptop Bag", "Modular Battery", "Laptop Lock", 
      "Internal HDD/ External HDD", "Headphone", "Cardreader", 
      "Printer", "Mobile"
    ];

    defaultAccessories.forEach(accessory => {
      assetAccessories[accessory] = accessories?.[accessory] || false;
    });

    // ❌ REMOVE THIS - localStorage doesn't work on server
    // const storedUserData = JSON.parse(localStorage.getItem('user'));
    // console.log("Stored User Data:", storedUserData);

    // Create new asset
    const newAsset = new Asset({
      nodeName,
      serialNumber,
      manufacturer,
      type,
      model,
      expires,
      category,
      status,
      segment,
      assetOwner,
      note,
      defaultLocation,
      costCenter,
      receivedDate,
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
      accessories: assetAccessories,
      assetHistory: [
        {
          user: user?.siemensId || "System", // ✅ Add user field
          action: "created",
          date: new Date(),
          status: status,
          updatedBy: user?.siemensId || "System", // ✅ Use user from request
          assetOwner: assetOwner || "None",
          previousAssetOwner: null,
          lastChange: [],
          note: note || `Asset created with initial status: ${status}`,
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