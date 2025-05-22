import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function EditProfile() {
  const user = AuthToken((state) => state.user);
  const token = AuthToken((state) => state.token);
  const updateUser = AuthToken((state) => state.updateUser);
  const navigate = useNavigate();

  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || "");
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt || "");
  const [bannerUrl, setBannerUrl] = useState(user?.banner?.url || "");
  const [bannerAlt, setBannerAlt] = useState(user?.banner?.alt || "");
  const [venueManager, setVenueManager] = useState(user?.venueManager || false);

  async function handleUpdateProfile(e) {
    e.preventDefault();

    const payload = {
      bio,
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      banner: {
        url: bannerUrl,
        alt: bannerAlt,
      },
      venueManager,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/holidaze/profiles/${user.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.[0]?.message || "Failed to update profile"
        );
      }

      if (updateUser) {
        updateUser(data.data);
      }

      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full space-y-4 justify-center max-w-6xl"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          Edit Profile
        </h1>

        <label className="block">
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            rows="3"
          />
        </label>

        <label className="block">
          Avatar URL:
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
          {avatarUrl && (
            <div className="my-4">
              <p className="text-sm text-gray-600 mb-1">Avatar Preview:</p>
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-32 h-32 flex justify-self-center rounded-full object-cover border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/128?text=Invalid+URL";
                }}
              />
            </div>
          )}
        </label>

        <label className="block">
          Avatar Alt Text:
          <input
            type="text"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          Banner URL:
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
          {bannerUrl && (
            <div className="my-4">
              <p className="text-sm text-gray-600 mb-1">Banner Preview:</p>
              <img
                src={bannerUrl}
                alt="Banner preview"
                className="w-full h-40 object-cover border rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x160?text=Invalid+URL";
                }}
              />
            </div>
          )}
        </label>

        <label className="block">
          Banner Alt Text:
          <input
            type="text"
            value={bannerAlt}
            onChange={(e) => setBannerAlt(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
          I am a venue manager
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-800"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="bg-red-600 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-red-800"
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
