import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import truncateText from "../components/TruncateText";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

const BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 24;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/venues?_owner=true&_bookings=true&limit=${limit}&page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        const newVenues = data.data || [];
        setVenues((prev) => {
          const combined = [...prev, ...newVenues];
          const uniqueMap = new Map();
          combined.forEach((venue) => uniqueMap.set(venue.id, venue));
          return Array.from(uniqueMap.values());
        });

        if (!data.meta.nextPage || data.meta.isLastPage) {
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
        className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        dataLength={venues.length}
        next={fetchNext}
        hasMore={hasMore}
        loader={<p className="text-center my-4">Loading more...</p>}
        endMessage={
          <p className="text-center mt-4 text-gray-500">
            You've reached the end.
          </p>
        }
      >
        {venues.map((venue) => (
          <Link
            key={venue.id}
            to={`/venue/${venue.id}`}
            className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition flex flex-col gap-1"
          >
            <h2 className="text-lg font-semibold mb-2">
              {truncateText(venue.name, 20)}
            </h2>
            <img
              src={venue?.media?.[0]?.url || "/No-Image-Placeholder.svg"}
              alt={venue?.media?.[0]?.alt || "Venue image"}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <p>
              <strong> Max guests:</strong> {venue.maxGuests}
            </p>
            <p className="text-m text-blue-600">
              {truncateText(venue.description, 20)}
            </p>
            <p className="text-green-700">
              <strong className="text-black">Price:</strong> {venue.price}$
            </p>
          </Link>
        ))}
      </InfiniteScroll>
      {!hasMore && (
        <div className="flex justify-center my-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition cursor-pointer"
          >
            Back to Top
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
