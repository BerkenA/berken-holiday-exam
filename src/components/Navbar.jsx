import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center sticky border-b-2">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Holidaze
        </Link>
        <nav className="space-x-4 text-sm">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/venues" className="hover:text-blue-600">
            Venues
          </Link>
          <Link to="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
