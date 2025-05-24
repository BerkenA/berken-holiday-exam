import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import { toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import AuthToken from "./Authtoken";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export default function DatePicker() {
  const token = AuthToken((state) => state.token);
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
          `${BASE_URL}/holidaze/venues/${venueId}?_bookings=true`,
          {
            headers: {
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await res.json();
        const bookings = data.data?.bookings || [];

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
      } catch (err) {
        toast.error(err.message || "Failed to load booked dates");
      }
    };

    fetchBookings();
  }, [venueId]);

  const handleDateChange = (item) => {
    setState([item.selection]);
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
    <div className="max-w-fit p-4 rounded-lg shadow">
      <DateRange
        onChange={handleDateChange}
        ranges={state}
        minDate={new Date()}
        disabledDates={disabledDates}
      />

      <div className="mt-4">
        <label className="block mb-1 text-sm font-medium">
          Number of guests
        </label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}
