import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
  const [query, setQuery] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setVenues([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      async function fetchVenues() {
        setLoading(true);
        try {
          const response = await fetch(
            `${BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error("Failed to fetch venues");
          const result = await response.json();
          setVenues(result.data || []);
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      fetchVenues();
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative z-50 bg-white border rounded">
      <input
        type="text"
        placeholder="Search venues..."
        className="p-2 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => venues.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {showDropdown && (
        <div
          className="absolute left-0 w-full bg-gray-50 shadow-md rounded max-h-80 overflow-y-auto border-r-2 border-l-2"
          style={{ top: "calc(100% + 3px)" }}
        >
          {loading && <p className="p-2">Loading...</p>}

          {!loading && venues.length === 0 && query !== "" && (
            <p className="p-2 text-gray-500">No venues found for "{query}"</p>
          )}

          {!loading && venues.length > 0 && (
            <ul>
              {venues.map((venue) => (
                <li key={venue.id} className="border-b p-0">
                  <Link
                    to={`/Venue/${venue.id}`}
                    className="block p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setShowDropdown(false)}
                  >
                    <h3 className="font-semibold break-words">{venue.name}</h3>
                    <img
                      src={
                        venue?.media?.[0]?.url || "/No-Image-Placeholder.svg"
                      }
                      alt={venue?.media?.[0]?.alt || "Venue image"}
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                    <p>
                      <strong> Max guests:</strong> {venue.maxGuests}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2 break-words">
                      {venue.description}
                    </p>
                    <div className="flex justify-between">
                      <p className="text-green-700">
                        <strong className="text-black">Price:</strong>{" "}
                        {venue.price}$
                      </p>
                      <p className="text-m">{venue.rating}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
