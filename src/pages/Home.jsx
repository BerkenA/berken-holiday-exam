import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/bookings?_venue=true`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log(data);
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white shadow-lg rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-2">
            {booking.venue.name}
          </h2>
          <img
            src={
              booking.venue?.media?.[0]?.url ||
              "https://via.placeholder.com/300"
            }
            alt={booking.venue?.media?.[0]?.alt || "Venue image"}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
          <p>
            <strong>From:</strong> {booking.dateFrom}
          </p>
          <p>
            <strong>To:</strong> {booking.dateTo}
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Created: {booking.created}
          </p>
          <p className="text-sm text-gray-500">Updated: {booking.updated}</p>
        </div>
      ))}
    </div>
  );
}
