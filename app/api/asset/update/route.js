// api/asset/update/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Asset from "../../../../models/Asset";

// Helper function to compare values and detect changes with detailed tracking
function detectChanges(existingAsset, newData) {
  const changes = {};
  const changedFields = [];
  const detailedChanges = {};
  
  const fieldsToCheck = [
    'nodeName', 'manufacturer', 'type', 'model', 'category', 'status',
    'segment', 'assetOwner', 'note', 'defaultLocation', 'costCenter',
    'condition', 'storeLocation', 'poNumber', 'order'
  ];
  
  const dateFields = [
    'expires', 'receivedDate', 'killdiskDate', 'disposedDate', 'purchaseDate',
    'checkOutDate', 'checkInDate'
  ];
  
  // Check regular fields
  fieldsToCheck.forEach(field => {
    const oldValue = existingAsset[field] || '';
    const newValue = newData[field] || '';
    
    if (oldValue !== newValue) {
      changes[field] = {
        from: oldValue,
        to: newValue
      };
      changedFields.push(field);
      
      // Store in detailedChanges for better database compatibility
      detailedChanges[field] = {
        from: oldValue,
        to: newValue,
        type: 'field_change'
      };
    }
  });
  
  // Check date fields
  dateFields.forEach(field => {
    const oldValue = existingAsset[field] ? existingAsset[field].toISOString().split('T')[0] : '';
    const newValue = newData[field] ? new Date(newData[field]).toISOString().split('T')[0] : '';
    
    if (oldValue !== newValue) {
      changes[field] = {
        from: oldValue || null,
        to: newValue || null
      };
      changedFields.push(field);
      
      detailedChanges[field] = {
        from: oldValue || 'Not set',
        to: newValue || 'Not set',
        type: 'date_change'
      };
    }
  });
  
  // Check accessories separately with detailed tracking
  const oldAccessories = existingAsset.accessories || {};
  const newAccessories = newData.accessories || {};
  
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
    oldAccessoriesObj = oldAccessories;
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
    newAccessoriesObj = newAccessories;
  }
  
  // Detailed accessories comparison
  const allAccessoryKeys = new Set([...Object.keys(oldAccessoriesObj), ...Object.keys(newAccessoriesObj)]);
  let hasAccessoriesChanges = false;
  
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
      } else if (oldQty > 0 && newQty === 0) {
        // Removed
        detailedChanges[`accessories.${accessoryName}`] = {
          from: oldQty,
          to: null,
          type: 'accessory_removed',
          accessoryName: accessoryName,
          changeType: 'removed'
        };
      } else if (oldQty > 0 && newQty > 0) {
        // Modified
        detailedChanges[`accessories.${accessoryName}`] = {
          from: oldQty,
          to: newQty,
          type: 'accessory_modified',
          accessoryName: accessoryName,
          changeType: 'modified'
        };
      }
    }
  });
  
  if (hasAccessoriesChanges) {
    changes.accessories = {
      from: oldAccessoriesObj,
      to: newAccessoriesObj
    };
    changedFields.push('accessories');
  }
  
  return { changes, changedFields, detailedChanges };
}

export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const {
      nodeName, serialNumber, manufacturer, type, model, expires, category,
      status, segment, assetOwner, note, defaultLocation, costCenter,
      receivedDate, condition, storeLocation, killdiskDate, attachedFile,
      disposedDate, poNumber, order, purchaseDate, checkOutDate, checkInDate,
      updatedBy, accessories
    } = data;

    // Validate required fields
    if (!serialNumber) {
      return NextResponse.json(
        { error: "Serial number is required" },
        { status: 400 }
      );
    }

    // Find the existing asset
    const existingAsset = await Asset.findOne({ serialNumber });
    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      nodeName: nodeName || existingAsset.nodeName,
      manufacturer: manufacturer || existingAsset.manufacturer,
      type: type || existingAsset.type,
      model: model || existingAsset.model,
      expires: expires ? new Date(expires) : existingAsset.expires,
      category: category || existingAsset.category,
      status: status || existingAsset.status,
      segment: segment || existingAsset.segment,
      assetOwner: assetOwner || existingAsset.assetOwner,
      note: note !== undefined ? note : existingAsset.note,
      defaultLocation: defaultLocation || existingAsset.defaultLocation,
      costCenter: costCenter !== undefined ? costCenter : existingAsset.costCenter,
      receivedDate: receivedDate ? new Date(receivedDate) : existingAsset.receivedDate,
      condition: condition || existingAsset.condition,
      storeLocation: storeLocation !== undefined ? storeLocation : existingAsset.storeLocation,
      killdiskDate: killdiskDate ? new Date(killdiskDate) : existingAsset.killdiskDate,
      attachedFile: attachedFile !== undefined ? attachedFile : existingAsset.attachedFile,
      disposedDate: disposedDate ? new Date(disposedDate) : existingAsset.disposedDate,
      poNumber: poNumber !== undefined ? poNumber : existingAsset.poNumber,
      order: order !== undefined ? order : existingAsset.order,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : existingAsset.purchaseDate,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : existingAsset.checkOutDate,
      checkInDate: checkInDate ? new Date(checkInDate) : existingAsset.checkInDate,
      accessories: accessories !== undefined ? accessories : existingAsset.accessories,
    };

    // Detect what actually changed with detailed tracking
    const { changes, changedFields, detailedChanges } = detectChanges(existingAsset, updateData);

    // Only proceed if there are actual changes
    if (changedFields.length === 0) {
      return NextResponse.json(
        { success: true, message: "No changes detected", asset: existingAsset },
        { status: 200 }
      );
    }

    // Store previous values for history tracking
    const previousStatus = existingAsset.status;
    const previousOwner = existingAsset.assetOwner;

    // Determine the action type based on changes
    let actionType = "update";
    let historyNote = "Asset updated";

    if (changedFields.includes('status')) {
      if (updateData.status === "Deployed" && previousStatus !== "Deployed") {
        actionType = "checkOut";
        historyNote = `Asset checked out to ${updateData.assetOwner || "Unknown"}`;
      } else if (updateData.status === "MISStock" && previousStatus === "Deployed") {
        actionType = "checkIn";
        historyNote = `Asset checked in from ${previousOwner || "Unknown"}`;
      } else if (updateData.status === "Disposed") {
        actionType = "disposed";
        historyNote = "Asset disposed";
      }
    }

    // Create detailed history entry
    const historyEntry = {
      action: actionType,
      date: new Date(),
      status: updateData.status,
      updatedBy: updatedBy || "System",
      assetOwner: updateData.assetOwner || existingAsset.assetOwner,
      previousAssetOwner: previousOwner,
      changedFields: changedFields,
      detailedChanges: detailedChanges, // Store as plain object
      note: historyNote,
    };

    console.log("Detailed History Entry:", {
      action: historyEntry.action,
      changedFields: historyEntry.changedFields,
      detailedChanges: historyEntry.detailedChanges
    });

    // Initialize assetHistory if it doesn't exist
    if (!existingAsset.assetHistory) {
      existingAsset.assetHistory = [];
    }

    existingAsset.assetHistory.push(historyEntry);

    // Update the asset with change tracking
    const updatedAsset = await Asset.findOneAndUpdate(
      { serialNumber },
      {
        ...updateData,
        assetHistory: existingAsset.assetHistory,
        lastUpdated: new Date(),
        updatedBy: updatedBy || "System",
      },
      {
        new: true,
        runValidators: true,
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
        message: `Asset updated successfully. ${changedFields.length} field(s) changed: ${changedFields.join(', ')}`,
        asset: updatedAsset,
        changedFields: changedFields,
        detailedChanges: detailedChanges
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating asset:", error);

    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Serial number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Handle PATCH requests for partial updates (like accessories only)
export async function PATCH(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const assetId = pathParts[pathParts.length - 1];
    
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
      oldAccessoriesObj = oldAccessories;
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
      newAccessoriesObj = newAccessories;
    }

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
        } else if (oldQty > 0 && newQty === 0) {
          // Removed
          detailedChanges[`accessories.${accessoryName}`] = {
            from: oldQty,
            to: null,
            type: 'accessory_removed',
            accessoryName: accessoryName,
            changeType: 'removed'
          };
        } else if (oldQty > 0 && newQty > 0) {
          // Modified
          detailedChanges[`accessories.${accessoryName}`] = {
            from: oldQty,
            to: newQty,
            type: 'accessory_modified',
            accessoryName: accessoryName,
            changeType: 'modified'
          };
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

    console.log("PATCH - Accessories History Entry:", {
      action: historyEntry.action,
      changedFields: historyEntry.changedFields,
      detailedChanges: historyEntry.detailedChanges,
      oldAccessories: oldAccessoriesObj,
      newAccessories: newAccessoriesObj
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

    return NextResponse.json(
      {
        success: true,
        message: "Accessories updated successfully",
        asset: updatedAsset,
        changedFields: changedFields,
        detailedChanges: detailedChanges,
        changesSummary: `${Object.keys(detailedChanges).length} accessory changes detected`
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