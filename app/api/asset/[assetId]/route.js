// app>api>assetId>route.js
import { NextResponse } from "next/server";

import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    // Accept assetId from dynamic route (params), or from body/query
    let assetId;
    if (params && params.assetId) {
      assetId = params.assetId;
    }

    const data = await req.json();
    const {
      serialNumber,
      nodeName,
      model,
      manufacturer,
      category,
      type,
      deskLocation,
      poNumber,
      orderNumber,
      storeLocation,
      status,
      allocation,
      period,
      assetOwner, // name string from frontend
      note,
      accessories,
      action, // from frontend, may be custom
      updatedBy,
      previousAssetOwner,
      returnBy,
      newAssignee,
      // ... add more fields as needed
    } = data;

    // -- 1. Identify the asset --
    let query = {};
    if (assetId) query._id = assetId;
    if (serialNumber) query.serialNumber = serialNumber;
    if (nodeName) query.nodeName = nodeName;

    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        { error: "Asset ID, serial number or node name required for identification." },
        { status: 400 }
      );
    }

    // -- 2. Find the asset --
    const existingAsset = await Asset.findOne(query);
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset not found. Please check the assetId, serial number or node name." },
        { status: 404 }
      );
    }

    // -- 3. Update fields dynamically --
    const fieldsToUpdate = [
      'model', 'manufacturer', 'type', 'deskLocation', 'poNumber',
      'orderNumber', 'storeLocation', 'status', 'allocation',
      'period', 'note', 'segment', 'defaultLocation', 'costCenter',
      'receivedDate', 'condition', 'killdiskDate', 'attachedFile', 'disposedDate',
      'purchaseDate'
    ];
    fieldsToUpdate.forEach(field => {
      if (data[field] !== undefined) {
        existingAsset[field] = data[field];
      }
    });

    // -- 4. Accessories update (merges as object/string) --
    if (accessories) {
      // Handle both string/JSON merge if necessary
      if (typeof accessories === "object" && !Array.isArray(accessories)) {
        existingAsset.accessories = {
          ...(existingAsset.accessories || {}),
          ...accessories
        };
      } else {
        existingAsset.accessories = accessories;
      }
    }

    // -- 5. User assignment (ObjectId) --
    let user = null;
    if (assetOwner) {
      // Case-insensitive name match (assume full names are unique)
      user = await User.findOne({ fullName: assetOwner.toLowerCase() });
      if (!user) {
        user = new User({
          fullName: assetOwner.toLowerCase(),
          createdDate: Date.now(),
          segment: "default",
          password: "defaultPassword",
          siemensId: `siemens-${Date.now()}`
        });
        await user.save();
      }
      existingAsset.assetOwner = user._id;
    } else {
      existingAsset.assetOwner = null; // return to pool
    }

    // -- 6. Safe asset history action --
    if (!existingAsset.assetHistory) existingAsset.assetHistory = [];

    const allowedActions = ["checkIn", "checkOut", "update"];
    // Map only allowed enums
    let historyAction = allowedActions.includes(action) ? action : "update";

    let historyNote = note;
    if (!historyNote) {
      if (action === "reassigned") {
        historyNote = `Returned by ${returnBy}, reassigned from ${previousAssetOwner} to ${newAssignee}`;
      } else if (historyAction === "update") {
        historyNote = `Status changed to ${status}`;
      } else {
        historyNote = `Asset updated: ${Object.keys(data).filter(key => key !== 'serialNumber' && key !== 'nodeName').join(', ')}`;
      }
    }

    

    existingAsset.assetHistory.push({
      user: user?._id || null,
      action: historyAction,
      date: new Date(),
      status: status || existingAsset.status,
      updatedBy: updatedBy || "system",
      note: historyNote
    });

    // -- 7. Update timestamp and save --
    existingAsset.lastUpdated = new Date();

    const updatedAsset = await existingAsset.save();

    return NextResponse.json(
      { success: true, asset: updatedAsset },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PUT handler:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// Use the same logic for PATCH
export async function PATCH(req, ctx) {
  return PUT(req, ctx);
}