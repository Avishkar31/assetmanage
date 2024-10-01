import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";
import { connectDb } from "lib/dbConnect";

const validSortColumns = [
  "nodeName",
  "serialNumber",
  "manufacturer",
  "type",
  "model",
  "category",
  "status",
  "department",
  "assetOwner",
  "condition"
];

const validOrder = ["asc", "desc"];

const validStatuses = [
  "Inpool",
  "New Purchase",
  "MIS Store",
  "Buyback",
  "Disposed",
  "Inactive",
  "Deployed"
];

export async function GET(req) {
  await connectDb();
  const { searchParams } = req.nextUrl;

  const sort = searchParams.get("sort") || "serialNumber";
  const order = searchParams.get("order") || "asc";
  const search = searchParams.get("search") || "";
  const offset = searchParams.get("offset") || 0;
  const limit = searchParams.get("limit") || 10;
  const status = searchParams.get("status") || "";

  try {
    // Validate sorting order
    if (!validSortColumns.includes(sort)) {
      return NextResponse.json(
        { error: "Invalid sort column" },
        { status: 400 }
      );
    }

    if (!validOrder.includes(order.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid order type" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Build search query
    const searchQuery = {
      ...(search
        ? {
            $or: validSortColumns.map((col) => ({
              [col]: { $regex: search, $options: "i" } // case-insensitive search
            }))
          }
        : {}),
      ...(status ? { status } : {}) // Add status to query if provided
    };

    // Fetch assets with sorting, searching, status filtering, and pagination
    const assets = await Asset.find(searchQuery)
      .populate('issueTo', 'name')
      .populate({
        path: 'assetHistory.user', 
        model: User,
        select: 'name',
        options: { skipInvalidIds: true } // Ensures invalid references are skipped
      })
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    if (assets.length === 0) {
      return NextResponse.json({ error: "No assets found" }, { status: 404 });
    }

    // Return paginated result
    const totalAssets = await Asset.countDocuments(searchQuery);

    return NextResponse.json(
      {
        data: assets,
        total: totalAssets,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalAssets / limit)
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
