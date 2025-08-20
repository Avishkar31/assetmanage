// File: /app/api/search/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Asset from "@/models/Asset";

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function GET(request) {
  try {
    await connectDB();
    
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const department = searchParams.get("department") || "";
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build search query
    const searchQuery = {};
    
    // Handle multi-word searches by splitting the query
    if (query && query.trim() !== "") {
      const searchTerms = query.trim().split(/\s+/);
      
      if (searchTerms.length > 1) {
        // Multi-word search
        const regexPatterns = searchTerms.map(term => new RegExp(term, "i"));
        
        searchQuery["$and"] = regexPatterns.map(pattern => ({
          "$or": [
            { nodeName: { $regex: pattern } },
            { serialNumber: { $regex: pattern } },
            { manufacturer: { $regex: pattern } },
            { model: { $regex: pattern } },
            { type: { $regex: pattern } },
            { category: { $regex: pattern } },
            { department: { $regex: pattern } },
            { assetOwner: { $regex: pattern } },
            { note: { $regex: pattern } },
            { defaultLocation: { $regex: pattern } },
            { costCenter: { $regex: pattern } },
            { storeLocation: { $regex: pattern } },
            { poNumber: { $regex: pattern } },
            { order: { $regex: pattern } },
            { "assetHistory.updatedBy": { $regex: pattern } }
          ]
        }));
      } else {
        // Single-word search
        searchQuery["$or"] = [
          { nodeName: { $regex: query, $options: "i" } },
          { serialNumber: { $regex: query, $options: "i" } },
          { manufacturer: { $regex: query, $options: "i" } },
          { model: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { department: { $regex: query, $options: "i" } },
          { assetOwner: { $regex: query, $options: "i" } },
          { note: { $regex: query, $options: "i" } },
          { defaultLocation: { $regex: query, $options: "i" } },
          { costCenter: { $regex: query, $options: "i" } },
          { storeLocation: { $regex: query, $options: "i" } },
          { poNumber: { $regex: query, $options: "i" } },
          { order: { $regex: query, $options: "i" } },
          { "assetHistory.updatedBy": { $regex: query, $options: "i" } }
        ];
      }
    }

    // Add filters if provided
    if (type) {
      searchQuery.type = { $regex: type, $options: "i" };
    }
    
    if (status) {
      searchQuery.status = status; // Exact match for enum field
    }
    
    if (department) {
      searchQuery.department = { $regex: department, $options: "i" };
    }

    // Create sort object
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    // Execute search query
    const total = await Asset.countDocuments(searchQuery);
    const results = await Asset
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects

    // Return results with pagination metadata
    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Advanced search with more options
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      query = "",
      filters = {},
      limit = 10,
      page = 1,
      sortField = "updatedAt",
      sortOrder = "desc",
      dateRange = {}
    } = body;

    const skip = (page - 1) * limit;

    // Build advanced search query
    const searchQuery = {};
    
    // Handle multi-word searches by splitting the query
    if (query && query.trim() !== "") {
      const searchTerms = query.trim().split(/\s+/);
      
      if (searchTerms.length > 1) {
        // Multi-word search - all words must match somewhere
        const regexPatterns = searchTerms.map(term => new RegExp(term, "i"));
        
        searchQuery["$and"] = regexPatterns.map(pattern => ({
          "$or": [
            { nodeName: { $regex: pattern } },
            { serialNumber: { $regex: pattern } },
            { manufacturer: { $regex: pattern } },
            { model: { $regex: pattern } },
            { type: { $regex: pattern } },
            { category: { $regex: pattern } },
            { department: { $regex: pattern } },
            { assetOwner: { $regex: pattern } },
            { note: { $regex: pattern } },
            { defaultLocation: { $regex: pattern } },
            { costCenter: { $regex: pattern } },
            { storeLocation: { $regex: pattern } },
            { poNumber: { $regex: pattern } },
            { order: { $regex: pattern } },
            { "assetHistory.updatedBy": { $regex: pattern } }
          ]
        }));
      } else {
        // Single-word search
        searchQuery["$or"] = [
          { nodeName: { $regex: query, $options: "i" } },
          { serialNumber: { $regex: query, $options: "i" } },
          { manufacturer: { $regex: query, $options: "i" } },
          { model: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { department: { $regex: query, $options: "i" } },
          { assetOwner: { $regex: query, $options: "i" } },
          { note: { $regex: query, $options: "i" } },
          { defaultLocation: { $regex: query, $options: "i" } },
          { costCenter: { $regex: query, $options: "i" } },
          { storeLocation: { $regex: query, $options: "i" } },
          { poNumber: { $regex: query, $options: "i" } },
          { order: { $regex: query, $options: "i" } },
          { "assetHistory.updatedBy": { $regex: query, $options: "i" } }
        ];
      }
    }
    
    // Add all filters from the filters object
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        if (key === "status" && !Array.isArray(value)) {
          // Handle status as exact match for enum field
          searchQuery[key] = value;
        } else if (Array.isArray(value)) {
          // Handle array values (multiple selection)
          searchQuery[key] = { $in: value };
        } else if (key.endsWith("Date")) {
          // Skip date fields - they're handled separately
          return;
        } else {
          // Handle string values
          searchQuery[key] = { $regex: value, $options: "i" };
        }
      }
    });
    
    // Add date range filters for specific date fields
    const dateFields = ["receivedDate", "killdiskDate", "disposedDate", "purchaseDate", "checkOutDate", "checkInDate", "expires"];
    
    dateFields.forEach(field => {
      if (filters[field + "Start"] || filters[field + "End"]) {
        searchQuery[field] = {};
        
        if (filters[field + "Start"]) {
          searchQuery[field].$gte = new Date(filters[field + "Start"]);
        }
        
        if (filters[field + "End"]) {
          searchQuery[field].$lte = new Date(filters[field + "End"]);
        }
      }
    });
    
    // General date range (for createdAt)
    if (dateRange.start || dateRange.end) {
      searchQuery.createdAt = {};
      
      if (dateRange.start) {
        searchQuery.createdAt.$gte = new Date(dateRange.start);
      }
      
      if (dateRange.end) {
        searchQuery.createdAt.$lte = new Date(dateRange.end);
      }
    }

    // Create sort object
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    // Execute search query
    const total = await Asset.countDocuments(searchQuery);
    const results = await Asset
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects

    // Return results with pagination metadata
    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Advanced search API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}