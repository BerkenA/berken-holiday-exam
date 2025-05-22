import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Venue() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = AuthToken((state) => state.token);
  const userEmail = AuthToken((state) => state.user?.email);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/venues/${id}?_owner=true&_bookings=true`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }
        const result = await response.json();
        setVenue(result.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p>Error: {toast.error(error)}</p>;
  if (!venue) return <p>No venue found.</p>;

  const isVenueManager =
    token &&
    venue.owner &&
    userEmail?.trim().toLowerCase() === venue.owner.email?.trim().toLowerCase();

  async function onConfirmDelete() {
    try {
      const response = await fetch(`${BASE_URL}/holidaze/venues/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete venue");
      }
      toast.success("Venue deleted successfully.");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleDelete() {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this venue?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            onConfirmDelete();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mt-6">
        {isVenueManager && (
          <>
            <button
              onClick={() => navigate(`/venue/edit/${id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-800"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>

      {venue.media.length > 0 && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || "Venue image"}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <p className="text-gray-700 mb-4">{venue.description}</p>

      <div className="mb-4">
        <p>
          <strong>Price:</strong> ${venue.price}
        </p>
        <p>
          <strong>Max Guests:</strong> {venue.maxGuests}
        </p>
        <p>
          <strong>Rating:</strong> {venue.rating}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Location</h2>
        <p>
          {venue.location.address}, {venue.location.city}
        </p>
        <p>
          {venue.location.zip}, {venue.location.country}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        <ul className="list-disc list-inside">
          {Object.entries(venue.meta).map(([key, value]) => (
            <li key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {value ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </div>

      {venue.owner && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Hosted by</h2>
          <p>
            {venue.owner.name} ({venue.owner.email})
          </p>
        </div>
      )}

      {venue.bookings && venue.bookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Bookings</h2>
          <ul className="list-disc list-inside">
            {venue.bookings.map((booking) => (
              <li key={booking.id}>
                {booking.dateFrom} to {booking.dateTo} – Guests:{" "}
                {booking.guests}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Venue;
