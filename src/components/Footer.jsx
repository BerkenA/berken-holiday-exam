import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-gray-700 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-blue-600 text-2xl font-bold">Holidaze</p>
        <p className="text-xl">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-blue-600 text-2xl">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 text-2xl">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-blue-600 text-2xl">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
