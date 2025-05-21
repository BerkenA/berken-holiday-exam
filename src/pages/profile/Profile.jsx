import { useEffect, useState } from "react";
import AuthToken from "../../components/Authtoken";
import { Link } from "react-router-dom";

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
          `${BASE_URL}/holidaze/profiles/${user.name}/bookings`,
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
    <div className="min-h-screen flex justify-center p-6">
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4">
            <Link to="/edit-profile">Edit profile</Link>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4">
            <Link to="/CreateVenue">Create Venue</Link>
          </button>
        </div>
        <div className="h-[70vh] flex gap-4 mt-6">
          <div className=" flex-1 p-4 text-black rounded-xl overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Your Venues</h2>
            {profile.venues?.length ? (
              profile.venues.map((venue) => (
                <div
                  key={venue.id}
                  className="mb-4 p-3 bg-gray-100 rounded shadow"
                >
                  <h3 className="font-bold">{venue.name}</h3>
                  <p>{venue.location?.city}</p>
                </div>
              ))
            ) : (
              <p>You have no venues.</p>
            )}
          </div>

          <div className="flex-1 p-4 text-black rounded-xl overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            {bookings.length ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="mb-4 p-3 bg-gray-100 rounded shadow"
                >
                  <p>
                    <strong>ID:</strong> {booking.id}
                  </p>
                  <p>
                    <strong>From:</strong>{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()} —
                    <strong> To:</strong>{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </div>
              ))
            ) : (
              <p>You have no bookings.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
