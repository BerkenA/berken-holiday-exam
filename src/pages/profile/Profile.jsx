import { useEffect, useState } from "react";
import AuthToken from "../../components/Authtoken";
import { Link } from "react-router-dom";
import truncateText from "../../components/TruncateText";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
  const user = AuthToken((state) => state.user);
  const token = AuthToken((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/profiles/${user.name}?_bookings=true&_venues=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.errors?.[0]?.message || "Failed to fetch profile"
          );
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      }
    }
    async function fetchUserBookings() {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/profiles/${user.name}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.errors?.[0]?.message || "Failed to fetch bookings"
          );
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      }
    }

    if (user?.name) {
      fetchProfile();
      fetchUserBookings();
    }
  }, [user, token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile || !user)
    return (
      <div className="h-screen flex items-center justify-center text-2xl text-center px-4">
        <p>
          You are not logged in. You have to be logged in to see this page.{" "}
          <Link to="/login" className="text-blue-600">
            Click here to log in
          </Link>
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center p-6 flex-wrap">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center">
        {profile.avatar?.url ? (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "User avatar"}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center text-gray-600">
            No Avatar
          </div>
        )}

        <h1 className="text-2xl font-semibold text-blue-600">{profile.name}</h1>
        <p className="text-gray-600">{profile.email}</p>
        <p className="text-gray-600">{profile.bio}</p>

        {profile.venueManager && (
          <p className="text-l text-green-600 mt-2">Venue Manager</p>
        )}
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4 hover:bg-blue-800">
            <Link to="/edit-profile">Edit profile</Link>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4 hover:bg-blue-800">
            <Link to="/CreateVenue">Create Venue</Link>
          </button>
        </div>
        <div className="flex gap-8 flex-wrap p-8 flex-col md:flex-row">
          <div className="flex-1 w-full md:w-1/2 min-w-0 flex flex-col">

            <h2 className="text-xl font-semibold mb-6">Your Venues</h2>
            <div className="flex flex-col gap-4">
              {profile.venues?.length ? (
                profile.venues.map((venue) => (
                  <Link
                    to={`/venue/${venue.id}`}
                    key={venue.id}
                    className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition flex flex-col"
                  >
                    <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                    <img
                      src={venue.media?.[0]?.url || "/No-Image-Placeholder.svg"}
                      alt={venue.media?.[0]?.alt || "Venue image"}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <p className="mb-1">{venue.location?.city}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {venue.description}
                    </p>
                    <p className="text-xl mt-2">
                      <strong>Price:</strong> {venue.price}$
                    </p>
                  </Link>
                ))
              ) : (
                <p>You have no venues.</p>
              )}
            </div>
          </div>

            <div className="flex-1 w-full md:w-1/2 min-w-0 flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Your Bookings</h2>
            <div className="flex flex-col gap-4">
              {bookings.length ? (
                bookings.map((booking) => (
                  <Link
                    to={`/venue/${booking.venue.id}`}
                    state={{ booking }}
                    key={booking.id}
                    className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition flex flex-col"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {truncateText(booking.venue.name, 15)}
                    </h3>
                    <img
                      src={
                        booking.venue?.media?.[0]?.url ||
                        "/No-Image-Placeholder.svg"
                      }
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
                    <p className="text-sm text-blue-600 truncate mt-2">
                      {truncateText(booking.venue.description, 55)}
                    </p>
                    <p className="text-xl mt-2">
                      <strong>Price:</strong> {booking.venue.price}$
                    </p>
                  </Link>
                ))
              ) : (
                <p>You have no bookings.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
