import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AuthToken from "./Authtoken";
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
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Holidaze
          </Link>
        </div>

        <div className="flex-1 hidden sm:flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="flex-1 justify-end space-x-6 items-center hidden sm:flex">
          <Link to="/" className="hover:text-blue-600 text-lg">
            Home
          </Link>
          {token && (
            <Link to="/profile" className="hover:text-blue-600 text-lg">
              Profile
            </Link>
          )}
          {!token ? (
            <Link to="/login" className="hover:text-blue-600 text-lg">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer text-lg"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Burger menu button */}
        <button
          className="sm:hidden text-3xl focus:outline-none"
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
          className="sm:hidden absolute top-16 left-0 w-full z-50"
        >
          <nav className="bg-white shadow-md px-4 py-4 space-y-2 border-t-1">
            <div className="mb-4 block sm:hidden">
              <SearchBar />
            </div>
            <Link
              to="/"
              className="block hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            {token && (
              <Link
                to="/profile"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {!token ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-blue-600"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block text-left w-full hover:text-blue-600"
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
