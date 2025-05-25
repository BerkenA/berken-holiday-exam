import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthToken from "./Authtoken";

const BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR_URL =
  "https://www.svgrepo.com/show/452030/avatar-default.svg";

function PasswordInput({ value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="border p-2 w-full pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        aria-label="See password"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
    avatar: {
      url: "",
      alt: "",
    },
  });

  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const login = AuthToken((state) => state.login);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.avatar.url) {
      formData.avatar.url = DEFAULT_AVATAR_URL;
    }

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

      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.errors?.[0]?.message || "Something went wrong, try again");
      }

      setMessage("User registered successfully!");
      login(loginData.data, loginData.data.accessToken);
      navigate("/profile");
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
        className="border p-2 w-full rounded"
      />
      <input
        type="email"
        placeholder="Email (must end in @stud.noroff.no)"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="border p-2 w-full rounded"
      />
      <input
        type="url"
        placeholder="Avatar URL (optional)"
        value={formData.avatar.url}
        onChange={(e) =>
          setFormData({
            ...formData,
            avatar: {
              ...formData.avatar,
              url: e.target.value,
            },
          })
        }
        className="border p-2 w-full rounded"
      />

      <PasswordInput
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <PasswordInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        aria-label="Confirm registration"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:cursor-pointer"
      >
        Register
      </button>

      <div className="flex justify-center">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline" aria-label="Go to login">
            Login here
          </Link>
        </p>
      </div>

      {message && <p className="text-red-500">{message}</p>}
    </form>
  );
}

export default RegisterForm;
