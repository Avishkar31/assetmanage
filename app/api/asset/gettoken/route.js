import { NextResponse } from "next/server";

export async function POST() {
  try {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "l7e4dfdc32c32d45fca160aa38496e3647",
      client_secret: "f2307c67b74346e29e229afabcdf6f18",
    });

    // Send the POST request
    const response = await fetch("https://apigtwb2c.us.dell.com/auth/oauth/v2/token", {
      method: "POST",
      body: params.toString(), // Encode the parameters
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Set the header
      },
    });

    // Handle non-OK response status
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch token" },
        { status: response.status }
      );
    }

    // Parse the response JSON
    const data = await response.json();

    // Process or store the token
    const token = data.token;
    console.log("Token fetched successfully:", token);

    // Return the token in the response
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Token fetch error:", error);

    // Handle errors gracefully
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
