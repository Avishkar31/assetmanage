// api/changes.js (or wherever your API route is located)
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb"; // <--- ADD THIS LINE

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) { // Added check for empty array
      return res.status(400).json({ success: false, message: 'Invalid input: IDs array is empty or invalid' });
    }

    // Connect to MongoDB (adjust according to your database setup)
    const { db } = await dbConnect();
    
    // Fetch the change records
    // Ensure your 'changes' collection documents have an '_id' field that matches the 'ids' array
    const changes = await db
      .collection('changes') // replace with your actual collection name
      .find({ _id: { $in: ids.map(id => new ObjectId(id)) } })
      .toArray();
    
    return res.status(200).json({ success: true, changes });
  } catch (error) {
    console.error('Error fetching changes:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}