// utils/assetExport.js
export const exportAssets = async (extractType) => {
  try {
    // Build the appropriate query parameters
    let queryParams = new URLSearchParams();

    switch (extractType) {
      case "AllAsset":
        // No parameters needed for all assets
        break;
      case "Inpool":
        queryParams.append("status", "inpool");
        break;
      case "NewPurchase":
        queryParams.append("status", "new purchase");
        break;
      case "Deployed":
        queryParams.append("status", "deployed");
        break;
      case "TodaysAllocation":
        // Format today's date in the format your API expects
        const today = new Date();
        const formattedDate = `${today
          .getDate()
          .toString()
          .padStart(2, "0")}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getFullYear()}`;
        queryParams.append("checkOutDate", formattedDate);
        break;
      default:
        break;
    }

    // Make the API request
    const response = await fetch(`/api/extract?${queryParams.toString()}`, {
      method: "GET"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to export assets");
    }

    // Create a blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    // Generate dynamic filename based on extract type
    const filename = `${extractType.toLowerCase()}_assets_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

    return true;
  } catch (error) {
    console.error("Asset export error:", error);
    throw error;
  }
};
