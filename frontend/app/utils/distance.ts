export async function getWalkingDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_GRAPH_HOPPER_API_KEY;
  const url = `https://graphhopper.com/api/1/route?point=${fromLat},${fromLng}&point=${toLat},${toLng}&vehicle=foot&locale=vi&key=${apiKey}`;

  console.log("Đang gọi GraphHopper với URL:", url);
  console.log("API key:", apiKey);
  console.log("From:", fromLat, fromLng);
  console.log("To:", toLat, toLng);

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("Response từ GraphHopper:", data);

    const meters = data.paths?.[0]?.distance;
    return typeof meters === "number" ? meters / 1000 : null;
  } catch (err) {
    console.error("Lỗi khi gọi GraphHopper:", err);
    return null;
  }
}
