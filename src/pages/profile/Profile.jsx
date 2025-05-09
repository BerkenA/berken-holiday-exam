import { useEffect, useState } from "react";
import AuthToken from "../../components/Authtoken";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function Profile() {
  const user = AuthToken((state) => state.user);
  const token = AuthToken((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `${BASE_URL}/holidaze/profiles/${user.name}`,
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

    if (user?.name) {
      fetchProfile();
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
        <button className="rounded">
          <Link to="/edit-profile">Edit profile</Link>
        </button>
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "User avatar"}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center text-gray-600">
            No Avatar
          </div>
        )}
        <h1 className="text-2xl font-semibold text-blue-600">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>

        {user?.venueManager && (
          <p className="text-sm text-green-600 mt-2">Venue Manager</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
