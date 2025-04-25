export default function Footer() {
    return (
      <footer className="text-gray-700 py-6 mt-10 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    );
  }