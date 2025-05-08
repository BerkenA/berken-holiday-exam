import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow w-full ${isRegisterPage ? "min-w-full" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
