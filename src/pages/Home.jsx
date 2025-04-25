import { useState, useEffect } from "react";

const BASE_URL = "https://v2.api.noroff.dev/holidaze";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(`${BASE_URL}/venues`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();
        setVenues(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(venues)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {venues.map((venue) => (
        <div key={venue.id} className="border rounded p-4 shadow">
          <h2 className="text-lg font-semibold">{venue.name}</h2>
          <p>{venue.location?.address || "Address not available"}</p>
        </div>
      ))}
    </div>
  );
}

