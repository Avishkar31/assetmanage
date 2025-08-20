import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";

export async function PUT(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const {
      serialNumber,
      nodeName,
      model,
      category,
      type,
      deskLocation,
      poNumber,
      orderNumber,
      storeLocation,
      status,
      allocation,
      period,
      assetOwner,
      note,
      accessories,
      action,
      updatedBy,
      previousAssetOwner,
      returnBy,
      newAssignee
    } = data;

    // Asset identifier validation
    if (!serialNumber && !nodeName) {
      return NextResponse.json(
        { error: "Serial number or node name is required for identification." },
        { status: 400 }
      );
    }

    // Find the asset
    const query = {};
    if (serialNumber) query.serialNumber = serialNumber;
    if (nodeName) query.nodeName = nodeName;
    
    const existingAsset = await Asset.findOne(query);
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset not found. Please check the serial number or node name." },
        { status: 404 }
      );
    }

    // Update general fields
    const fieldsToUpdate = [
      'model', 'category', 'type', 'deskLocation', 'poNumber', 
      'orderNumber', 'storeLocation', 'status', 'allocation', 
      'period', 'note'
    ];
    
    fieldsToUpdate.forEach(field => {
      if (data[field] !== undefined) {
        existingAsset[field] = data[field];
      }
    });

    // Handle accessories update
    if (accessories) {
      existingAsset.accessories = {
        ...existingAsset.accessories,
        ...accessories
      };
    }

    // Handle user assignment if assetOwner is provided
    let user = null;
    if (assetOwner) {
      user = await User.findOne({ fullName: assetOwner.toLowerCase() });

      if (!user) {
        user = new User({
          fullName: assetOwner.toLowerCase(),
          createdDate: Date.now(),
          department: "default",
          password: "defaultPassword",
          siemensId: `siemens-${Date.now()}`
        });
        await user.save();
      }
      
      existingAsset.assetOwner = user._id;
    } else {
      existingAsset.assetOwner = null; // returned to pool
    }

    // Add history entry
    if (!existingAsset.assetHistory) {
      existingAsset.assetHistory = [];
    }

    let historyNote = note;

    if (!historyNote) {
      if (action === "reassigned") {
        historyNote = `Returned by ${returnBy}, reassigned from ${previousAssetOwner} to ${newAssignee}`;
      } else if (action === "statusChange") {
        historyNote = `Status changed to ${status}`;
      } else {
        historyNote = `Asset updated with ${Object.keys(data).filter(key => key !== 'serialNumber' && key !== 'nodeName').join(', ')}`;
      }
    }

    existingAsset.assetHistory.push({
      user: user?._id || null,
      action: action || "update",
      date: new Date(),
      status: status || existingAsset.status,
      updatedBy: updatedBy || "system",
      note: historyNote
    });

    // Update status if provided
    if (status) {
      existingAsset.status = status;
    }

    // Record update timestamp
    existingAsset.lastUpdated = new Date();

    // Save the updated asset
    const updatedAsset = await existingAsset.save();
    
    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (err) {
    console.error("Error in PUT handler:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// If you need to support partial updates
export async function PATCH(req) {
  return PUT(req);
}
