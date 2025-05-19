// app/api/monitors/import/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Monitor from "@/models/Monitor";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { monitors, username } = await req.json();
    
    if (!Array.isArray(monitors)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    if (!username) {
      return NextResponse.json({ error: "Username is required for tracking imports" }, { status: 400 });
    }
    
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };
    
    // Process each monitor
    for (const monitorData of monitors) {
      try {
        // Validate required fields
        if (!monitorData.serialNumber) {
          results.errors.push(`Monitor without serial number skipped`);
          continue;
        }
        
        // Convert team ID to ObjectId if needed
        if (monitorData.team && typeof monitorData.team === 'string' && mongoose.Types.ObjectId.isValid(monitorData.team)) {
          monitorData.team = new mongoose.Types.ObjectId(monitorData.team);
        }
        
        // Check if monitor exists by serial number
        const existingMonitor = await Monitor.findOne({ serialNumber: monitorData.serialNumber });
        
        if (existingMonitor) {
          // Update existing monitor with history entry
          const historyEntry = {
            date: new Date(),
            user: monitorData.issueTo || existingMonitor.issueTo || null, // Recipient
            updatedBy: username, // Person performing the action
            action: "bulkUpdate",
            status: monitorData.status || existingMonitor.status
          };
          
          // If status changed, record previous status
          if (monitorData.status && monitorData.status !== existingMonitor.status) {
            historyEntry.previousStatus = existingMonitor.status;
            historyEntry.action = "statusChange"; // More specific action
          }
          
          // If issueTo changed, record previous issueTo
          if (monitorData.issueTo !== undefined && monitorData.issueTo !== existingMonitor.issueTo) {
            historyEntry.previousIssueTo = existingMonitor.issueTo;
          }
          
          if (!existingMonitor.assetHistory) {
            existingMonitor.assetHistory = [];
          }
          existingMonitor.assetHistory.push(historyEntry);
          
          // Update fields except _id and assetHistory
          Object.keys(monitorData).forEach(key => {
            if (key !== '_id' && key !== 'assetHistory') {
              existingMonitor[key] = monitorData[key];
            }
          });
          
          await existingMonitor.save();
          results.updated++;
        } else {
          // Create new monitor
          const defaultStatus = monitorData.status || "inpool"; // Use inpool as default status
          
          // Check if status is deployed but no issueTo
          if (defaultStatus === "deployed" && !monitorData.issueTo) {
            results.errors.push(`Monitor ${monitorData.serialNumber}: Status is deployed but no recipient specified`);
            continue;
          }
          
          const newMonitor = new Monitor({
            ...monitorData,
            status: defaultStatus,
            username: username, // For display purposes
            createdAt: new Date(),
            assetHistory: [{
              date: new Date(),
              user: monitorData.issueTo || null, // Recipient
              updatedBy: username, // Person performing the action
              action: "created",
              status: defaultStatus
            }]
          });
          
          await newMonitor.save();
          results.created++;
        }
      } catch (error) {
        console.error("Error processing monitor:", error);
        results.errors.push(`Error with monitor ${monitorData.serialNumber || 'unknown'}: ${error.message}`);
      }
    }
    
    return NextResponse.json({ 
      message: "Import completed", 
      results 
    });
  } catch (error) {
    console.error("Failed to import monitors:", error);
    return NextResponse.json({ error: "Failed to import monitors", details: error.message }, { status: 500 });
  }
}