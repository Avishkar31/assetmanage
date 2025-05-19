// app/api/peripherals/history/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PeripheralHistory from "@/models/PeripheralHistory";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const peripheralId = searchParams.get("peripheralId");
    
    let query = {};
    if (peripheralId) {
      query.peripheralId = peripheralId;
    }
    
    const history = await PeripheralHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history", details: error.message },
      { status: 500 }
    );
  }
}