import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; //The venues need to be a Link so yo u can clcik and get the specific venue details. 

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function Home() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/holidaze/bookings?_venue=true`, {
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
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          to={`/venue/${booking.venue.id}`}
          className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition block"
        >
          <h2 className="text-lg font-semibold mb-2">{booking.venue.name}</h2>
          <img
            src={booking.venue?.media?.[0]?.url || "/No-Image-Placeholder.svg"}
            alt={booking.venue?.media?.[0]?.alt || "Venue image"}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
          <p>
            <strong>From:</strong>{" "}
            {new Date(booking.dateFrom).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>To:</strong>{" "}
            {new Date(booking.dateTo).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p className="text-m text-blue-600">
            {truncateText(booking.venue.description, 55)}
          </p>
          <p className="text-xl">
            <strong>Price:</strong> {booking.venue.price}$
          </p>
        </Link>
      ))}
    </div>
  );
}

export default Home;
