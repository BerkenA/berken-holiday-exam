import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import { toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import AuthToken from "./Authtoken";
import { confirmAlert } from "react-confirm-alert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function DatePicker({ maxGuests }) {
  const token = AuthToken((state) => state.token);
  const user = AuthToken((state) => state.user);
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

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/holidaze/venues/${venueId}?_bookings=true&_owner=true`,
          {
            headers: {
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
  }, [venueId, user?.name]);

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
    confirmAlert({
      title: "Confirm Booking",
      message: `Do you want to book from ${formatDate(
        state[0].startDate
      )} to ${formatDate(state[0].endDate)} for ${guests} guest(s)?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => handleBooking(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleBooking = async () => {
    if (!venueId) {
      toast.error("Venue ID is missing");
      return;
    }

    const dateFrom = formatDate(state[0].startDate);
    const dateTo = formatDate(state[0].endDate);

    setLoading(true);
    const loadingToast = toast.loading("Creating your booking...");

    try {
      const res = await fetch(`${BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          dateFrom,
          dateTo,
          guests,
          venueId,
        }),
      });

      console.log("Fetched bookings:", res);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed.");
      }

      toast.update(loadingToast, {
        render: "Booking successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
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
        <div className="max-w-fit p-4 rounded-lg shadow">
          <DateRange
            onChange={handleDateChange}
            ranges={state}
            minDate={new Date()}
            disabledDates={disabledDates}
          />

          <div className="mt-4 flex flex-col">
            <label className="block mb-2 text-sm font-medium">
              Number of guests
            </label>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={onGuestsChange}
              className="border rounded px-2 py-1 w-20"
            />
            <button
              onClick={confirmBooking}
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
