import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import DatePicker from "../../components/DatePicker";
import FormateDate from "../../components/FormateDate";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Wifi, ParkingCircle, Utensils, Fish } from "lucide-react";

const amenityIcons = {
  wifi: Wifi,
  parking: ParkingCircle,
  breakfast: Utensils,
  pets: Fish,
};

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
            "Content-Type": "application/json",
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
    <>
      <Helmet>
        <title>Venue | Holidaze</title>
        <meta
          name="description"
          content="Discover and book unique holiday venues with Holidaze. Find your perfect venue to book for an amazing holiday"
        />
        <meta
          name="keywords"
          content="holidaze, holiday booking, vacation rentals, travel, unique venues, accommodation, hotels, booking platform, venues"
        />
        <meta name="author" content="Berken Ates" />
      </Helmet>

      <div className="max-w-4xl mx-auto p-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-4 break-words text-blue-600">
          {venue.name}
        </h1>

        <img
          src={venue.media.length > 0 ? venue.media[0].url : holderImage}
          alt={
            venue.media.length > 0
              ? venue.media[0].alt || "Venue image"
              : "Holder image"
          }
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div className="flex gap-4 justify-center">
          {isVenueManager && (
            <>
              <button
                onClick={() => navigate(`/venue/edit/${id}`)}
                aria-label="Edit this venue"
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800"
              >
                Edit Venue
              </button>
              <button
                onClick={handleDelete}
                aria-label="Delete this venue"
                className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-800"
              >
                Delete Venue
              </button>
            </>
          )}
        </div>
        <p className="mb-4 mt-4 text-xl">{venue.description}</p>
        <div className="flex flex-col sm:flex-row justify-between gap-10">
          <div className="flex-col">
            <div className="mb-4">
              <p className="text-green-600 text-xl">
                <strong className="text-blue-600">Price:</strong> ${venue.price}
              </p>
              <p className="text-black text-xl">
                <strong className="text-blue-600">Max Guests:</strong>{" "}
                {venue.maxGuests}
              </p>
              <p className="flex gap-1 items-center text-black text-xl">
                <strong className="text-blue-600">Rating:</strong>{" "}
                {venue.rating}
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-blue-600">Location</h2>
              <p className="text-lg">
                {venue.location.address}, {venue.location.city}
              </p>
              <p className="text-lg">
                {venue.location.zip}, {venue.location.country}
              </p>
              <h2 className="text-xl font-semibold text-blue-600 mt-4">
                Amenities
              </h2>
              <ul className="space-y-2 mt-2">
                {Object.entries(venue.meta).map(([key, value]) => {
                  if (!value) return null;
                  const Icon = amenityIcons[key];
                  return (
                    <li
                      key={key}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      {Icon && <Icon size={20} className="text-gray-600" />}
                      <span className="capitalize">{key}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-4 flex gap-20">
              {venue.owner && (
                <div className="flex flex-col rounded-xl mt-6 gap-1">
                  <h2 className="text-xl font-semibold text-blue-600">
                    Hosted by
                  </h2>
                  <img
                    src={venue.owner.avatar?.url || "/default-avatar.jpg"}
                    alt={venue.owner.avatar?.alt || "User avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <p>{venue.owner.name}</p>
                </div>
              )}
            </div>
          </div>

          {booking && (
            <div className="p-4 bg-blue-600 border border-blue-400 rounded  text-white h-fit">
              <h3 className="font-semibold text-lg mb-2">
                Your Booking Details
              </h3>
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

          <div className="flex flex-col">
            <div className="flex gap-4 justify-center">
              <DatePicker
                maxGuests={venue.maxGuests}
                price={venue.price}
                bookingToEdit={editBooking}
                onBookingUpdated={(updatedBooking) => {
                  setBookings((prev) =>
                    prev.map((b) =>
                      b.id === updatedBooking.id ? updatedBooking : b
                    )
                  );
                  toast.success(
                    editBooking
                      ? "Booking updated successfully"
                      : "Booking added successfully"
                  );
                  setEditBooking(null);
                  if (editBooking) {
                    navigate("/profile");
                  }
                }}
                onCancelEdit={() => setEditBooking(null)}
              />
            </div>

            {booking && (
              <div className="mt-4 flex gap-22 justify-center">
                <button
                  onClick={() =>
                    setEditBooking(
                      editBooking?.id === booking.id ? null : booking
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                  aria-label="Edit booking"
                >
                  {editBooking?.id === booking.id
                    ? "Cancel Edit"
                    : "Edit Booking"}
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

            {isVenueManager ? (
              venue.bookings && venue.bookings.length > 0 ? (
                <ul>
                  {venue.bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="mb-4 border-gray-200 p-4 rounded-2xl shadow-xl flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1">
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
                      </div>
                      <img
                        src={booking.customer.avatar?.url}
                        alt={booking.customer.avatar?.alt || "User avatar"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings for this venue yet.</p>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Venue;
