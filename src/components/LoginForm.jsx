import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthToken from "./Authtoken";

const BASE_URL = import.meta.env.VITE_API_URL;

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

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const login = AuthToken((state) => state.login);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/login?_holidaze=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Login failed");
      }

      setMessage("Login successful!");
      login(data.data, data.data.accessToken, data.venueManager);
      navigate("/profile");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="border p-2 w-full rounded"
      />

      <PasswordInput
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:cursor-pointer"
      >
        Login
      </button>

      <div className="flex justify-center">
        <p>
          Dont have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>

      {message && <p className="text-red-500">{message}</p>}
    </form>
  );
}

export default LoginForm;
