const BASE_URL = "https://v2.api.noroff.dev/holidaze";

export async function getAllVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
}
