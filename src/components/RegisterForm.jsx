import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
    avatar: "",
  });

  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setMessage("Passwords doesn't match");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.errors?.[0]?.message || "Registration failed");

      setMessage("User registered successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Username"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        className="border p-2 w-full"
      />
      <input
        type="email"
        placeholder="Email (must end in @stud.noroff.no)"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.venueManager}
          onChange={(e) =>
            setFormData({ ...formData, venueManager: e.target.checked })
          }
        />
        <span>Register as a Venue Manager</span>
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>

      {message && <p className="text-red-500">{message}</p>}
    </form>
  );
}

export default RegisterForm;
