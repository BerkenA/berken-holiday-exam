export default function Footer() {
  return (
    <footer className="text-gray-700 py-6 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-blue-600 text-2xl font-bold">Holidaze</p>
        <p className="text-m">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="/about" className="hover:text-blue-600">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Contact
          </a>
          <a href="/privacy" className="hover:text-blue-600">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
