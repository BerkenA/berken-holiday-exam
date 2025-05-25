import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker";
import FormateDate from "../../components/FormateDate";
import { Star } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const token = AuthToken((state) => state.token);
  const userEmail = AuthToken((state) => state.user?.email);
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || null;
  const holderImage = "/No-Image-Placeholder.svg";

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
        setBookings(result.data.bookings || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (!venue) return toast.info("No venue found");

  const isVenueManager =
    token &&
    venue.owner &&
    userEmail?.trim().toLowerCase() === venue.owner.email?.trim().toLowerCase();

  async function onConfirmDelete() {
    try {
      const response = await fetch(
        `${BASE_URL}/holidaze/venues/${id}?_bookings=true`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );
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
      message:
        "Are you sure you want to delete this venue? this will cancel all bookings on this venue",
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

  async function deleteBooking(bookingId) {
    try {
      const response = await fetch(
        `${BASE_URL}/holidaze/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking deleted successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleDeleteConfirm(bookingId) {
    const bookingToDelete = bookings.find((b) => b.id === bookingId);
    confirmAlert({
      title: "Confirm delete booking",
      message: (
        <div>
          Are you sure you want to delete this booking from{" "}
          <FormateDate date={bookingToDelete?.dateFrom} /> to{" "}
          <FormateDate date={bookingToDelete?.dateTo} />?
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteBooking(bookingId),
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
              aria-label="Edit this venue"
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete this venue"
              className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-800"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-4 break-words">{venue.name}</h1>

      <img
        src={venue.media.length > 0 ? venue.media[0].url : holderImage}
        alt={
          venue.media.length > 0
            ? venue.media[0].alt || "Venue image"
            : "Holder image"
        }
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <p className="text-gray-700 mb-4">{venue.description}</p>

      <div className="mb-4">
        <p>
          <strong>Price:</strong> ${venue.price}
        </p>
        <p>
          <strong>Max Guests:</strong> {venue.maxGuests}
        </p>
        <p className="flex gap-1 items-center">
          <strong>Rating:</strong> {venue.rating}
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
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

      <DatePicker
        maxGuests={venue.maxGuests}
        editingBooking={editBooking}
        price={venue.price} 
        onBookingUpdated={(updatedBooking) => {
          setBookings((prev) =>
            prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
          );
          setEditBooking(null);
        }}
        onCancelEdit={() => setEditBooking(null)}
      />

      {venue.owner && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Hosted by</h2>
          <p>
            {venue.owner.name} ({venue.owner.email})
          </p>
        </div>
      )}

      {booking && (
        <div className="booking-info p-4 bg-blue-100 border border-blue-400 rounded mt-4">
          <h3 className="font-semibold text-lg mb-2">Your Booking Details</h3>
          <p>
            <strong>From:</strong> <FormateDate date={booking.dateFrom} />
          </p>
          <p>
            <strong>To:</strong> <FormateDate date={booking.dateTo} />
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
        </div>
      )}

      {isVenueManager ? (
        venue.bookings && venue.bookings.length > 0 ? (
          <ul>
            {venue.bookings.map((booking) => (
              <li
                key={booking.id}
                className="mb-4 border-gray-200 p-4 rounded-2xl shadow-xl"
              >
                <p>
                  <strong>Booked by:</strong>{" "}
                  {booking.customer?.name || "Unknown"}
                </p>
                <p>
                  <strong>Date from:</strong>{" "}
                  <FormateDate date={booking.dateFrom} />
                </p>
                <p>
                  <strong>Date to:</strong>{" "}
                  <FormateDate date={booking.dateTo} />
                </p>
                <p>
                  <strong>Guests:</strong> {booking.guests}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings for this venue yet.</p>
        )
      ) : null}
      {booking && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={() =>
              setEditBooking(editBooking?.id === booking.id ? null : booking)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            aria-label="Edit booking"
          >
            {editBooking?.id === booking.id ? "Cancel Edit" : "Edit Booking"}
          </button>
          <button
            onClick={() => handleDeleteConfirm(booking.id)}
            aria-label="Delete booking"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            Delete Booking
          </button>
        </div>
      )}
      {editBooking && booking && editBooking.id === booking.id && (
        <DatePicker
          maxGuests={venue.maxGuests}
          bookingToEdit={editBooking}
          onBookingUpdated={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
            );
            toast.success("Booking updated successfully");
            setEditBooking(null);
            navigate("/profile");
          }}
          onCancelEdit={() => setEditBooking(null)}
        />
      )}
    </div>
  );
}

export default Venue;
