// api/asset/update/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Asset from "../../../../../models/Asset";

// Handle PATCH requests for specific asset by ID
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id: assetId } = params;
    
    const data = await req.json();
    const { accessories, updateType, updatedBy } = data;

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

    // Find the existing asset
    const existingAsset = await Asset.findById(assetId);
    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    let updateData = {};
    let historyNote = "Asset updated";
    
    if (updateType === 'accessories') {
      updateData.accessories = accessories;
      historyNote = "Accessories updated";
    }

    // Manual accessories change detection specifically for PATCH requests
    const oldAccessories = existingAsset.accessories || {};
    const newAccessories = accessories || {};
    
    // Convert string format to object if needed
    let oldAccessoriesObj = {};
    let newAccessoriesObj = {};
    
    if (typeof oldAccessories === 'string') {
      if (oldAccessories.trim()) {
        oldAccessoriesObj = oldAccessories.split(", ").reduce((acc, item) => {
          const [key, value] = item.split(":");
          if (key && value) {
            acc[key.trim()] = parseInt(value.trim()) || 1;
          }
          return acc;
        }, {});
      }
    } else {
      // Handle object format - convert any boolean values to quantities
      Object.entries(oldAccessories).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          oldAccessoriesObj[key] = 1;
        } else if (typeof value === 'number' && value > 0) {
          oldAccessoriesObj[key] = value;
        }
      });
    }
    
    if (typeof newAccessories === 'string') {
      if (newAccessories.trim()) {
        newAccessoriesObj = newAccessories.split(", ").reduce((acc, item) => {
          const [key, value] = item.split(":");
          if (key && value) {
            acc[key.trim()] = parseInt(value.trim()) || 1;
          }
          return acc;
        }, {});
      }
    } else {
      newAccessoriesObj = newAccessories || {};
    }

    console.log("PATCH Accessories Comparison:", {
      oldAccessoriesObj,
      newAccessoriesObj,
      existingAssetAccessories: existingAsset.accessories,
      receivedAccessories: accessories
    });

    // Detailed accessories comparison for PATCH
    const allAccessoryKeys = new Set([...Object.keys(oldAccessoriesObj), ...Object.keys(newAccessoriesObj)]);
    let hasAccessoriesChanges = false;
    const detailedChanges = {};
    const changedFields = [];
    
    allAccessoryKeys.forEach(accessoryName => {
      const oldQty = oldAccessoriesObj[accessoryName] || 0;
      const newQty = newAccessoriesObj[accessoryName] || 0;
      
      if (oldQty !== newQty) {
        hasAccessoriesChanges = true;
        
        if (oldQty === 0 && newQty > 0) {
          // Added
          detailedChanges[`accessories.${accessoryName}`] = {
            from: null,
            to: newQty,
            type: 'accessory_added',
            accessoryName: accessoryName,
            changeType: 'added'
          };
          console.log(`Added: ${accessoryName} (Qty: ${newQty})`);
        } else if (oldQty > 0 && newQty === 0) {
          // Removed
          detailedChanges[`accessories.${accessoryName}`] = {
            from: oldQty,
            to: null,
            type: 'accessory_removed',
            accessoryName: accessoryName,
            changeType: 'removed'
          };
          console.log(`Removed: ${accessoryName} (was Qty: ${oldQty})`);
        } else if (oldQty > 0 && newQty > 0) {
          // Modified
          detailedChanges[`accessories.${accessoryName}`] = {
            from: oldQty,
            to: newQty,
            type: 'accessory_modified',
            accessoryName: accessoryName,
            changeType: 'modified'
          };
          console.log(`Modified: ${accessoryName} from ${oldQty} to ${newQty}`);
        }
      }
    });
    
    if (hasAccessoriesChanges) {
      changedFields.push('accessories');
    }

    // Check if there are actually changes
    if (!hasAccessoriesChanges) {
      return NextResponse.json(
        { success: true, message: "No changes detected", asset: existingAsset },
        { status: 200 }
      );
    }

    // Create history entry with detailed changes
    const historyEntry = {
      action: "update",
      date: new Date(),
      status: existingAsset.status,
      updatedBy: updatedBy || "System",
      assetOwner: existingAsset.assetOwner,
      changedFields: changedFields,
      detailedChanges: detailedChanges, // Store as plain object with specific accessory changes
      note: historyNote,
    };

    console.log("PATCH - Final History Entry to be saved:", {
      action: historyEntry.action,
      changedFields: historyEntry.changedFields,
      detailedChangesKeys: Object.keys(historyEntry.detailedChanges),
      detailedChanges: historyEntry.detailedChanges
    });

    // Initialize assetHistory if it doesn't exist
    if (!existingAsset.assetHistory) {
      existingAsset.assetHistory = [];
    }

    existingAsset.assetHistory.push(historyEntry);

    // Update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      {
        ...updateData,
        assetHistory: existingAsset.assetHistory,
        lastUpdated: new Date(),
        updatedBy: updatedBy || "System",
      },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Failed to update asset" },
        { status: 500 }
      );
    }

    const addedCount = Object.values(detailedChanges).filter(change => change.changeType === 'added').length;
    const removedCount = Object.values(detailedChanges).filter(change => change.changeType === 'removed').length;
    const modifiedCount = Object.values(detailedChanges).filter(change => change.changeType === 'modified').length;

    return NextResponse.json(
      {
        success: true,
        message: `Accessories updated successfully. ${addedCount} added, ${removedCount} removed, ${modifiedCount} modified.`,
        asset: updatedAsset,
        changedFields: changedFields,
        detailedChanges: detailedChanges,
        changesSummary: {
          added: addedCount,
          removed: removedCount,
          modified: modifiedCount,
          total: Object.keys(detailedChanges).length
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in PATCH request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}