import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EditProfile from "./pages/profile/EditProfile";
import App from "./App";
import Booking from "./pages/Booking";
import Venue from "./pages/venue/Venue";
import Profile from "./pages/profile/Profile";
import Contact from "./pages/Contact";
import CreateVenue from "./pages/venue/CreateVenue";
import ScrollToTop from "./components/ScrollToTop";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/CreateVenue" element={<CreateVenue />} />
          {/* Need to add a route for all venues (With filters) */}
          <Route path="/Venue/:id" element={<Venue />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
