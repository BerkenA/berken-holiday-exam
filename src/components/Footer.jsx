import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-gray-700 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-blue-600 text-2xl font-bold">Holidaze</p>
        <p className="text-xl text-blue-600">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-4">
          <p className="text-blue-600 hover:text-blue-800 hover:underline text-xl" aria-label="Go to about page">
            About
          </p>
          <p className="text-blue-600 hover:text-blue-800 hover:underline text-xl" aria-label="Go to contact page">
            Contact
          </p>
          <p className="text-blue-600 hover:text-blue-800 hover:underline text-xl" aria-label="Go to privacy page">
            Privacy
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
