// utils/assetExport.js
export async function exportAssets(type) {
  try {
    // Build the API URL based on the export type
    let apiUrl = "/api/extract";
    
    // Map the UI type to the corresponding API parameters
    switch (type) {
      case "MISStock":
        apiUrl = `${apiUrl}?status=MISStock`;
        break;
      case "NewPurchase":
        apiUrl = `${apiUrl}?status=newpurchase`;
        break;
      case "Deployed":
        apiUrl = `${apiUrl}?status=deployed`;
        break;
      case "TodaysAllocation":
        // Get today's date in the format expected by the API
        const today = new Date();
        apiUrl = `${apiUrl}?checkOutDate=today`;
        break;
      // Default case is AllAsset, which doesn't need parameters
    }
    
    console.log(`Exporting data with URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Export failed: ${response.status} - ${errorText}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.toLowerCase()}_assets.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    
    return true;
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
}