import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthToken from "../../components/Authtoken";
import { toast } from "react-toastify";
import HandleDiscard from "../../components/handleDiscard";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function CreateVenue() {
  const token = AuthToken((state) => state.token);
  const handleDiscard = HandleDiscard();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: "",
    maxGuests: "",
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("meta.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: type === "number" ? Number(value) : value,
        },
      }));
    } else if (name.startsWith("media.")) {
      const [_, index, field] = name.split(".");
      const mediaCopy = [...formData.media];
      mediaCopy[Number(index)][field] = value;
      setFormData((prev) => ({ ...prev, media: mediaCopy }));
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

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.maxGuests
    ) {
      toast.error(
        "Please fill in all required fields (name, description, price, max guests)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/holidaze/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          media: formData.media.filter((m) => m.url),
          price: Number(formData.price),
          maxGuests: Number(formData.maxGuests),
          rating: formData.rating || 0,
          meta: formData.meta,
          location: formData.location,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.errors ? errData.errors[0].message : "Failed to create venue"
        );
      }

      toast.success("Venue created successfully!")
      setTimeout(() => navigate("/profile"), 1000);
      setFormData({
        name: "",
        description: "",
        media: [{ url: "", alt: "" }],
        price: "",
        maxGuests: "",
        rating: 0,
        meta: { wifi: false, parking: false, breakfast: false, pets: false },
        location: {
          address: "",
          city: "",
          zip: "",
          country: "",
          continent: "",
          lat: 0,
          lng: 0,
        },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full space-y-6 max-w-6xl"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          Create a New Venue
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
            name="media.0.url"
            placeholder="Image URL"
            value={formData.media[0].url}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        {formData.media[0].url && (
          <div className="my-4">
            <p className="mb-1">Image Preview:</p>
            <img
              src={formData.media[0].url}
              alt={formData.media[0].alt || "Venue media preview"}
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
            name="media.0.alt"
            placeholder="Alt text"
            value={formData.media[0].alt}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          Price <span className="text-red-600">*</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 border rounded mt-1"
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
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Venue"}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateVenue;
