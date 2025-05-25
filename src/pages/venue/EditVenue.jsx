import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { toast } from "react-toastify";
import HandleDiscard from "../../components/handleDiscard";
import { Helmet } from "react-helmet";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = AuthToken((state) => state.token);
  const handleDiscard = HandleDiscard();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`${BASE_URL}/holidaze/venues/${id}`, {
          headers: { "X-Noroff-API-Key": API_KEY },
        });
        if (!response.ok) throw new Error("Failed to fetch venue.");
        const { data } = await response.json();
        setFormData(data);
      } catch (error) {
        toast.error(error.message);
      }
    }

    fetchVenue();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("media.")) {
      const [_, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        media: [{ ...prev.media[0], [key]: value }],
      }));
    } else if (name.startsWith("meta.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [key]: checked },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/holidaze/venues/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.errors?.[0]?.message || "Failed to update venue.");
      }

      toast.success("Venue updated!");
      navigate(`/venue/${id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!formData) return <p>Loading venue data...</p>;

  return (
    <>
      <Helmet>
        <title>Edit venue | Holidaze</title>
        <meta
          name="description"
          content="Discover and book unique holiday venues with Holidaze. Edit your venue for renting it out"
        />
        <meta
          name="keywords"
          content="holidaze, holiday booking, vacation rentals, travel, unique venues, accommodation, hotels, booking platform, venue, edit venue, edit"
        />
        <meta name="author" content="Berken Ates" />
      </Helmet>

      <div className="min-h-screen flex justify-center p-6 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full space-y-6 max-w-6xl"
        >
          <h1 className="text-2xl font-bold text-blue-600 text-center">
            Edit Venue
          </h1>

          <label className="block">
            Name <span className="text-red-600">*</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <label className="block">
            Description <span className="text-red-600">*</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <label className="block">
            Media URL:
            <input
              type="url"
              name="media.url"
              value={formData.media[0]?.url}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          {formData.media[0]?.url && (
            <div className="my-4">
              <p className="mb-1">Image Preview:</p>
              <img
                src={formData.media[0].url}
                alt={formData.media[0].alt || "Venue preview"}
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/256x160?text=Invalid+URL";
                }}
              />
            </div>
          )}

          <label className="block">
            Alt Text:
            <input
              type="text"
              name="media.alt"
              value={formData.media[0]?.alt}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <label className="block">
            Price <span className="text-red-600">*</span>
            <input
              type="number"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 border rounded mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          <label className="block">
            Max Guests <span className="text-red-600">*</span>
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <label className="block">
            Rating:
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <fieldset className="border p-4 rounded">
            <legend className="font-semibold mb-2">Amenities</legend>
            <div className="flex flex-wrap gap-4">
              {["wifi", "parking", "breakfast", "pets"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`meta.${item}`}
                    checked={formData.meta[item]}
                    onChange={handleChange}
                  />
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-semibold mb-2">Location</legend>
            {["address", "city", "zip", "country", "continent"].map((field) => (
              <label key={field} className="block">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
                <input
                  type="text"
                  name={`location.${field}`}
                  value={formData.location[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </label>
            ))}

            <label className="block">
              Latitude:
              <input
                type="number"
                step="any"
                name="location.lat"
                value={formData.location.lat}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>

            <label className="block">
              Longitude:
              <input
                type="number"
                step="any"
                name="location.lng"
                value={formData.location.lng}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
          </fieldset>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              aria-label="Confirm your edit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              aria-label="Discard your edit"
              onClick={handleDiscard}
              className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditVenue;
