// import { NextResponse } from "next/server";
// import Asset from "../../../../models/Asset";

// export async function POST(req) {
//   try {
//     const data = await req.json();
//     const { note, storeLocation, issueTo, status, nodeName, serialNumber } =
//       data;

//     const existingAsset = await Asset.findOne({ serialNumber });
//     if (existingAsset) {
//       return NextResponse.json(
//         { error: "Asset with this serial number already exists." },
//         { status: 400 }
//       );
//     }

//     const newAsset = new Asset({
//       assetTag,
//       nodeName,
//       serialNumber,
//       manufacturer,
//       type,
//       model,
//       expires,
//       category,
//       status,
//       department,
//       issueTo,
//       note,
//       defaultLocation,
//       costCenter,
//       receivedDate,
//       assetOwner,
//       condition,
//       storeLocation,
//       killdiskDate,
//       attachedFile,
//       disposedDate,
//       poNumber,
//       order,
//       purchaseDate
//     });
//     const savedAsset = await newAsset.save();
//     return NextResponse.json(savedAsset, { status: 201 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
