import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AuthToken from "./AuthToken";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  const logout = AuthToken((state) => state.logout);
  const token = AuthToken((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  function handleLogout() {
    toast.info("You have been logged out. Redirecting to login...", {
      autoClose: 1000,
      onClose: () => {
        logout();
        navigate("/login");
      },
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <Link
            to="/"
            className="font-bold text-blue-600"
            aria-label="Go to home"
          >
            <img
              src="/holidaze-logo-right.png"
              alt="click to go home"
              className="w-18 h-auto"
            />
          </Link>
        </div>

        <div className="flex-1 hidden sm:flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="flex-1 justify-end space-x-6 items-center hidden sm:flex">
          <Link
            to="/"
            className=" text-blue-600 hover:text-blue-800 hover:underline text-lg ml-6"
            aria-label="Go to home"
          >
            Home
          </Link>
          {token && (
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 hover:underline text-lg"
              aria-label="Go to profile"
            >
              Profile
            </Link>
          )}
          {!token ? (
            <Link
              to="/login"
              className="hover:text-blue-800 text-blue-600 hover:underline text-lg"
              aria-label="Go to login"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer text-lg"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Burger menu button */}
        <button
          className="sm:hidden text-3xl focus:outline-none text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "X" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={wrapperRef}
          className="sm:hidden absolute top-26 left-0 w-full z-50"
        >
          <nav className="bg-white shadow-md px-4 py-4 space-y-2 border-t border-blue-600">
            <div className="mb-4 block sm:hidden">
              <SearchBar />
            </div>
            <Link
              to="/"
              className="block text-blue-600"
              onClick={() => setMenuOpen(false)}
              aria-label="Go to home"
            >
              Home
            </Link>
            {token && (
              <Link
                to="/profile"
                className="block text-blue-600"
                onClick={() => setMenuOpen(false)}
                aria-label="Go to profile"
              >
                Profile
              </Link>
            )}
            {!token ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-blue-600"
                aria-label="Go to login"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block text-center w-full bg-red-500 text-white rounded-lg"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
