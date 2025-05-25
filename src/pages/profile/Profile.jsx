import { useEffect, useState } from "react";
import AuthToken from "../../components/Authtoken";
import { Link, useNavigate } from "react-router-dom";
import truncateText from "../../components/TruncateText";
import { toast } from "react-toastify";
import FormateDate from "../../components/FormateDate";
import { Helmet } from "react-helmet";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
  const user = AuthToken((state) => state.user);
  const token = AuthToken((state) => state.token);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      toast.info(
        "You need to be logged in to see this page, redirected to login"
      );
      navigate("/login");
      return;
    }

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
        toast.error(err.message);
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
        toast.error(err.message);
      }
    }

    if (user?.name) {
      fetchProfile();
      fetchUserBookings();
    }
  }, [user, token, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | Holidaze</title>
        <meta
          name="description"
          content="Discover and book unique holiday venues with Holidaze. Personalise and choose what picture, name, and if you want to become a venue manager"
        />
        <meta
          name="keywords"
          content="holidaze, holiday booking, vacation rentals, travel, unique venues, accommodation, hotels, booking platform, profile, customize"
        />
        <meta name="author" content="Berken Ates" />
      </Helmet>

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

          <h1 className="text-2xl font-semibold text-blue-600">
            {profile.name}
          </h1>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-gray-600">{profile.bio}</p>

          {profile.venueManager && (
            <p className="text-xl text-green-600 mt-2">Venue Manager</p>
          )}
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4 hover:bg-blue-800">
              <Link to="/edit-profile" aria-label="Go to edit profile">
                Edit profile
              </Link>
            </button>
            <button
              onClick={(e) => {
                if (!profile.venueManager) {
                  e.preventDefault();
                  toast.info(
                    "You have to be a venue manager to create a venue, you can do that in edit profile"
                  );
                }
              }}
              className={`px-4 py-2 rounded mt-4 text-white transition ${
                profile.venueManager
                  ? "bg-blue-600 hover:bg-blue-800 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <Link
                to="/CreateVenue"
                aria-label="Go to create venue"
                onClick={(e) => !profile.venueManager && e.preventDefault()}
              >
                Create Venue
              </Link>
            </button>
          </div>
          <div className="flex gap-8 flex-wrap flex-col md:flex-row mt-6">
            <div
              className={`flex-1 w-full md:w-1/2 min-w-0 flex flex-col ${
                !profile.venues?.length ? "text-center" : "text-left"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6 text-center">
                Your Venues
              </h2>
              <div className="flex flex-col gap-4">
                {profile.venues?.length ? (
                  profile.venues.map((venue) => (
                    <Link
                      to={`/venue/${venue.id}`}
                      key={venue.id}
                      className="bg-white shadow-xl rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition flex flex-col"
                      aria-label="Your venue"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {venue.name}
                      </h3>
                      <img
                        src={
                          venue.media?.[0]?.url || "/No-Image-Placeholder.svg"
                        }
                        alt={venue.media?.[0]?.alt || "Venue image"}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <p className="mb-1">{venue.location?.city}</p>
                      <p>
                        <strong>Guests</strong> {venue.maxGuests}
                      </p>
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

            <div
              className={`flex-1 w-full md:w-1/2 min-w-0 flex flex-col ${
                bookings.length === 0 ? "text-center" : "text-left"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6 text-center">
                Your Bookings
              </h2>
              <div className="flex flex-col gap-4">
                {bookings.length ? (
                  bookings.map((booking) => (
                    <Link
                      to={`/venue/${booking.venue.id}`}
                      state={{ booking }}
                      key={booking.id}
                      aria-label="Your bookings"
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
                        <FormateDate date={booking.dateFrom} />
                      </p>
                      <p>
                        <strong>To:</strong>{" "}
                        <FormateDate date={booking.dateTo} />
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
    </>
  );
}

export default Profile;
