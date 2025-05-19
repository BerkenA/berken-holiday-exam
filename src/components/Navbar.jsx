import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthToken from "./Authtoken";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = AuthToken((state) => state.logout);
  const token = AuthToken((state) => state.token);
  const [logOutMessage, setLogOutMessage] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    setLogOutMessage(true);

    setTimeout(() => {
      logout();
      setLogOutMessage(false);
      navigate("/login");
    }, 2000);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          Holidaze
        </Link>

        {logOutMessage && (
          <div className="absolute top-16 right-4 bg-blue-600 border-blue-500 text-white px-4 py-2 rounded shadow-md">
            You have been logged out. Redirecting to login...
          </div>
        )}
        {/* Desktop Menu */}
        <nav className="space-x-4 hidden sm:flex items-center">
          <Link to="/" className="hover:text-blue-600 text-xl">
            Home
          </Link>
          <Link to="/venue" className="hover:text-blue-600 text-xl">
            Venues
          </Link>
          <Link to="/profile" className="hover:text-blue-600 text-xl">
            Profile
          </Link>
          {!token ? (
            <Link to="/login" className="hover:text-blue-600 text-xl">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer text-xl"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Burger menu button */}
        <button
          className="sm:hidden text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "X" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50 px-4 py-4 space-y-2 border-t-1">
          <Link
            to="/"
            className="block hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/venues"
            className="block hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Venues
          </Link>
          <Link
            to="/profile"
            className="block hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/login"
            className="block hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
