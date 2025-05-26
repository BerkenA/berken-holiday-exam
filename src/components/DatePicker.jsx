import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import AuthToken from "./Authtoken";
import { confirmAlert } from "react-confirm-alert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function DatePicker({ maxGuests, bookingToEdit = null, price }) {
  const token = AuthToken((state) => state.token);
  const user = AuthToken((state) => state.user);
  const navigate = useNavigate();
  const [isVenueOwner, setIsVenueOwner] = useState(false);
  const { id: venueId } = useParams();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [disabledDates, setDisabledDates] = useState([]);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/holidaze/venues/${venueId}?_bookings=true&_owner=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await res.json();
        const venue = data.data;

        if (!venue) {
          throw new Error("Venue data not found");
        }

        const bookings = venue.bookings || [];

        const datesToDisable = [];
        bookings.forEach((booking) => {
          if (bookingToEdit && booking.id === bookingToEdit.id) {
            return;
          }

          const current = new Date(booking.dateFrom);
          const end = new Date(booking.dateTo);
          while (current <= end) {
            datesToDisable.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setDisabledDates(datesToDisable);
        if (user?.name && venue?.owner?.name === user.name) {
          setIsVenueOwner(true);
        }
      } catch (err) {
        toast.error(err.message || "Failed to load booked dates");
      }
    };

    fetchBookings();
  }, [venueId, user?.name, token, bookingToEdit]);

  const handleDateChange = (item) => {
    setState([item.selection]);
  };

  const onGuestsChange = (e) => {
    let val = Number(e.target.value);

    if (!val || val < 1) {
      toast.error("At least 1 guest is required.");
      setGuests(1);
      return;
    }

    if (maxGuests && val > maxGuests) {
      toast.error(`Maximum guests allowed is ${maxGuests}`);
      val = maxGuests;
    }

    setGuests(val);
  };

  const confirmBooking = () => {
    const startDate = state[0].startDate;
    const endDate = state[0].endDate;

    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24) + 1));
    const totalCost = nights * price;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "50%",
              maxWidth: "500px",
              minWidth: "300px",
              lineHeight: "1.6",
              fontSize: "16px",
              color: "#000",
              border: "1px solid black",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#1E88E5",
              }}
            >
              Confirm Booking
            </h1>
            {bookingToEdit && (
              <p className="mb-2 font-semibold text-red-600">
                Editing your booking will overwrite your previous booking
                details.
              </p>
            )}
            <strong style={{ color: "#000000" }}>Booking details:</strong>
            <br />
            From: {formatDate(startDate)}
            <br />
            To: {formatDate(endDate)}
            <br />
            Nights: {nights}
            <br />
            Guests: {guests}
            <br />
            Max allowed: {maxGuests}
            <br />
            Price per night: ${price}
            <br />
            <br />
            <strong style={{ color: "#43A047" }}>
              Total cost: ${totalCost}
            </strong>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  handleBooking();
                  onClose();
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1E88E5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#E53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </div>
        );
      },
    });
  };

  useEffect(() => {
    if (bookingToEdit) {
      setState([
        {
          startDate: new Date(bookingToEdit.dateFrom),
          endDate: new Date(bookingToEdit.dateTo),
          key: "selection",
        },
      ]);
      setGuests(bookingToEdit.guests || 1);
    }
  }, [bookingToEdit]);

  const handleBooking = async () => {
    if (!venueId && !bookingToEdit) {
      toast.error("Venue ID is missing");
      return;
    }

    const dateFrom = state[0].startDate.toISOString().split("T")[0];
    const dateTo = state[0].endDate.toISOString().split("T")[0];

    setLoading(true);
    const loadingToast = toast.loading(
      bookingToEdit ? "Updating your booking..." : "Creating your booking..."
    );

    const requestBody = {
      dateFrom,
      dateTo,
      guests,
    };

    if (!bookingToEdit) {
      requestBody.venueId = venueId;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/holidaze/bookings${
          bookingToEdit ? `/${bookingToEdit.id}` : ""
        }`,
        {
          method: bookingToEdit ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed.");
      }

      toast.update(loadingToast, {
        render: bookingToEdit ? "Booking updated!" : "Booking successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      if (bookingToEdit) {
        navigate("/profile");
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: err.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isVenueOwner && (
        <div className="max-w-full rounded-lg shadow overflow-hidden">
          <DateRange
            onChange={handleDateChange}
            ranges={state}
            minDate={new Date()}
            disabledDates={disabledDates}
          />

          <div className="mt-4 flex flex-col">
            <label className="block mb-2 text-sm font-medium pl-4">
              Number of guests
            </label>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={onGuestsChange}
              className="border rounded px-2 py-1 w-20 ml-4"
            />
            <button
              onClick={() => {
                if (!token) {
                  toast.info("Please log in to book this venue.");
                  return;
                }
                confirmBooking();
              }}
              aria-label="Confirm booking"
              disabled={loading || guests < 1 || guests > maxGuests}
              className={`mt-4 px-4 py-2 rounded text-white ${
                loading || guests < 1 || guests > maxGuests
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DatePicker;
