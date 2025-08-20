import { NextResponse } from "next/server";
import Asset from "../../../../models/Asset";
import dbConnect from "lib/dbConnect";

export async function GET(req) {
  await dbConnect();

  try {
    const MISStockCount = await Asset.countDocuments({ status: "MISStock" });
    const newPurchaseCount = await Asset.countDocuments({
      status: "New Purchase"
    });
    const inactiveCount = await Asset.countDocuments({ status: "Inactive" });
    const deployedCount = await Asset.countDocuments({ status: "Deployed" });
    const allAssetsCount = await Asset.countDocuments({});

    const analytics = {
      MISStockCount,
      newPurchaseCount,
      inactiveCount,
      deployedCount,
      allAssetsCount
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
