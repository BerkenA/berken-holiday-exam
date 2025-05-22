import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const App = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main
        className={`flex-grow w-full ${isRegisterPage ? "min-w-full" : ""}`}
      >
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ top: "85px" }}
      />
    </div>
  );
};

export default App;
