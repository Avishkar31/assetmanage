// import { generateBackupData } from "../../../lib/backupService";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const backupData = await generateBackupData();
//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=backup_assets.csv"
//     );
//     res.status(200).send(backupData);
//   } catch (error) {
//     console.error("Backup extraction error:", error);
//     res.status(500).json({ error: "Failed to extract backup data" });
//   }
// }
