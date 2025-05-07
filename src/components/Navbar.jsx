import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center sticky border-b-1">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          Holidaze
        </Link>
        {/* Desktop Menu */}
        <nav className="space-x-4 hidden sm:flex">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/venue" className="hover:text-blue-600">
            Venues
          </Link>
          <Link to="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>
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
        <nav className="sm:hidden bg-white border-b px-4 py-2 space-y-2">
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
