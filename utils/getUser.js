async function getUserData() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }

  try {
    const response = await fetch("/api/users/get", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

export default getUserData;
