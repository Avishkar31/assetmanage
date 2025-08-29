import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";
import getUserData from "../../../../utils/getUser";

export async function PUT(req) {
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
      checkOutDate,
      checkInDate,
      updatedBy,
      accessories
    } = data;

    // Validate required fields
    if (!serialNumber) {
      return NextResponse.json(
        { error: "Serial number is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Find the existing asset by serial number
    const existingAsset = await Asset.findOne({ serialNumber });
    
    if (!existingAsset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // Store previous values for history tracking
    const previousStatus = existingAsset.status;
    const previousOwner = existingAsset.assetOwner;

    // Update the asset with new data
    const updateData = {
      nodeName: nodeName || existingAsset.nodeName,
      manufacturer: manufacturer || existingAsset.manufacturer,
      type: type || existingAsset.type,
      model: model || existingAsset.model,
      expires: expires ? new Date(expires) : existingAsset.expires,
      category: category || existingAsset.category,
      status: status,
      segment: segment || existingAsset.segment,
      assetOwner: assetOwner || existingAsset.assetOwner,
      note: note || existingAsset.note,
      defaultLocation: defaultLocation || existingAsset.defaultLocation,
      costCenter: costCenter || existingAsset.costCenter,
      receivedDate: receivedDate ? new Date(receivedDate) : existingAsset.receivedDate,
      condition: condition || existingAsset.condition,
      storeLocation: storeLocation || existingAsset.storeLocation,
      killdiskDate: killdiskDate ? new Date(killdiskDate) : existingAsset.killdiskDate,
      attachedFile: attachedFile || existingAsset.attachedFile,
      disposedDate: disposedDate ? new Date(disposedDate) : existingAsset.disposedDate,
      poNumber: poNumber || existingAsset.poNumber,
      order: order || existingAsset.order,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : existingAsset.purchaseDate,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : existingAsset.checkOutDate,
      checkInDate: checkInDate ? new Date(checkInDate) : existingAsset.checkInDate,
      accessories: accessories || existingAsset.accessories
    };

    // Determine the action type based on changes
    let actionType = "update";
    let historyNote = note || "Asset updated";

    if (previousStatus !== status) {
      if (status === "Deployed" && previousStatus !== "Deployed") {
        actionType = "checkOut";
        historyNote = `Asset checked out to ${assetOwner || "Unknown"}`;
      } else if (status === "MISStock" && previousStatus === "Deployed") {
        actionType = "checkIn";
        historyNote = `Asset checked in from ${previousOwner || "Unknown"}`;
      } else if (status === "Disposed") {
        actionType = "disposed";
        historyNote = "Asset disposed";
      }
    }

    // Add history entry
    const historyEntry = {
      user: assetOwner || previousOwner || "System",
      action: actionType,
      date: new Date(),
      status: status,
      updatedBy: updatedBy || "System",
      assetOwner: assetOwner || existingAsset.assetOwner
    };

    // Initialize assetHistory if it doesn't exist
    if (!existingAsset.assetHistory) {
      existingAsset.assetHistory = [];
    }

    existingAsset.assetHistory.push(historyEntry);

    // Update the asset
    const updatedAsset = await Asset.findOneAndUpdate(
      { serialNumber },
      {
        ...updateData,
        assetHistory: existingAsset.assetHistory,
        lastUpdated: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Failed to update asset" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Asset updated successfully",
        asset: updatedAsset 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating asset:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: errors
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Serial number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Also handle PATCH requests
export async function PATCH(req) {
  return PUT(req);
}
