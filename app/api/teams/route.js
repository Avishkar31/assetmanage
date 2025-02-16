// import dbConnect from "../../../lib/dbConnect";
// import Team from "../../models/Teams";

export async function GET(req) {
  try {
    await dbConnect();
    const teams = await Team.find({});
    return Response.json({ success: true, data: teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return Response.json(
      { success: false, error: "Failed to fetch teams." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, description, department } = body;

    if (!name || !department) {
      return Response.json(
        { success: false, error: "Name and department are required." },
        { status: 400 }
      );
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return Response.json(
        { success: false, error: "Team with this name already exists." },
        { status: 400 }
      );
    }

    const team = await Team.create(body);
    return Response.json({ success: true, data: team }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return Response.json(
      { success: false, error: "Failed to create team." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return Response.json(
        { success: false, error: "Team ID is required." },
        { status: 400 }
      );
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, body, {
      new: true
    });

    return Response.json({ success: true, data: updatedTeam });
  } catch (error) {
    console.error("Error updating team:", error);
    return Response.json(
      { success: false, error: "Failed to update team." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Team ID is required." },
        { status: 400 }
      );
    }

    await Team.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Team deleted." });
  } catch (error) {
    console.error("Error deleting team:", error);
    return Response.json(
      { success: false, error: "Failed to delete team." },
      { status: 500 }
    );
  }
}
