import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import truncateText from "../components/TruncateText";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Wifi,
  WifiOff,
  ParkingCircle,
  ParkingCircleOff,
  Utensils,
  UtensilsCrossed,
  Fish,
  FishOff,
  Star,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  const limit = 24;

  useEffect(() => {
    setVenues([]);
    setPage(1);
    setHasMore(true);
  }, [filters, sort, sortOrder]);

  function filterVenues(venues, filters) {
    return venues.filter((venue) => {
      for (const [key, required] of Object.entries(filters)) {
        if (required && !venue.meta?.[key]) {
          return false;
        }
      }
      return true;
    });
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          _owner: "true",
          _bookings: "true",
          limit: limit.toString(),
          page: page.toString(),
        });

        if (sort) queryParams.append("sort", sort);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        const response = await fetch(
          `${BASE_URL}/holidaze/venues?${queryParams.toString()}`,
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
        const filteredVenues = filterVenues(newVenues, filters);
        setVenues((prev) => {
          const combined = [...prev, ...filteredVenues];
          const uniqueMap = new Map();
          combined.forEach((venue) => uniqueMap.set(venue.id, venue));
          return Array.from(uniqueMap.values());
        });

        if (!data.meta.nextPage || data.meta.isLastPage) {
          setHasMore(false);
        }
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, filters, sort, sortOrder]);

  const fetchNext = () => setPage((prev) => prev + 1);

  const featureIcons = {
    wifi: <Wifi className="w-4 h-4" />,
    parking: <ParkingCircle className="w-4 h-4" />,
    breakfast: <Utensils className="w-4 h-4" />,
    pets: <Fish className="w-4 h-4" />,
  };

  return (
    <div>
      <div className="p-4 bg-white shadow rounded mb-6">
        <h3 className="font-bold mb-2 text-blue-600">Filter Venues</h3>

        <div className="flex flex-wrap gap-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-2 rounded cursor-pointer"
          >
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded cursor-pointer"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          {["wifi", "pets", "parking", "breakfast"].map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 border px-3 py-1 rounded shadow-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.checked })
                }
                className="w-5 h-5 cursor-pointer"
              />

              <span className="flex items-center gap-1">
                {featureIcons[key]}
                <span className="capitalize">{key}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <InfiniteScroll
        className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        dataLength={venues.length}
        next={fetchNext}
        hasMore={hasMore}
        loader={loading && <p className="text-center my-4">Loading more...</p>}
        endMessage={
          !hasMore &&
          !loading && (
            <p className="text-center mt-4 text-gray-500">
              You've reached the end.
            </p>
          )
        }
      >
        {venues.map((venue) => (
          <Link
            key={venue.id}
            to={`/venue/${venue.id}`}
            className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition flex flex-col gap-1 min-w-0"
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
            <div className="flex justify-between">
              <p className="text-green-700">
                <strong className="text-black">Price:</strong> {venue.price}$
              </p>
              <p className="text-m flex items-center gap-1">
                {venue.rating}
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </p>
            </div>
            <div className="flex gap-2 mt-2 text-gray-700">
              {venue.meta?.wifi ? (
                <Wifi
                  className="w-5 h-5 text-green-600"
                  title="WiFi available"
                />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" title="No WiFi" />
              )}
              {venue.meta?.parking ? (
                <ParkingCircle
                  className="w-5 h-5 text-green-600"
                  title="Parking available"
                />
              ) : (
                <ParkingCircleOff
                  className="w-5 h-5 text-red-400"
                  title="No Parking"
                />
              )}
              {venue.meta?.breakfast ? (
                <Utensils
                  className="w-5 h-5 text-green-600"
                  title="Breakfast included"
                />
              ) : (
                <UtensilsCrossed
                  className="w-5 h-5 text-red-400"
                  title="No Breakfast"
                />
              )}
              {venue.meta?.pets ? (
                <Fish className="w-5 h-5 text-green-600" title="Pets allowed" />
              ) : (
                <FishOff className="w-5 h-5 text-red-400" title="No Pets" />
              )}
            </div>
          </Link>
        ))}
        {!loading && (
          <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2 flex flex-col items-center justify-center mt-4 text-gray-500 gap-4">
            <p>You've reached the end.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition cursor-pointer"
            >
              Back to Top
            </button>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}

export default Home;
