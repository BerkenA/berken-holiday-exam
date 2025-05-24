import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import truncateText from "../components/TruncateText";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function Home() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 24;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/bookings?_venue=true&limit=${limit}&offset=${(page - 1) * limit}`,
          {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "Content-Type": "application/json",
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        const newBookings = data.data;
        setBookings((prev) => [...prev, ...newBookings]);

        if (newBookings.length < limit) {
          setHasMore(false);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchBookings();
  }, [page]);

  const fetchNext = () => setPage((prev) => prev + 1);

  return (
    <div>
      <InfiniteScroll
        className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        dataLength={bookings.length}
        next={fetchNext}
        hasMore={hasMore}
        loader={<p className="text-center my-4">Loading more...</p>}
        endMessage={
          <p className="text-center mt-4 text-gray-500">
            You've reached the end.
          </p>
        }
      >
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          to={`/venue/${booking.venue.id}`}
          className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition block"
        >
          <h2 className="text-lg font-semibold mb-2">
            {truncateText(booking.venue.name, 20)}
          </h2>
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
            {truncateText(booking.venue.description, 35)}
          </p>
          <p className="text-xl">
            <strong>Price:</strong> {booking.venue.price}$
          </p>
        </Link>
      ))}
      </InfiniteScroll>
    </div>
  );
}

export default Home;
