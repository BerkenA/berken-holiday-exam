import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EditProfile from "./pages/profile/EditProfile"
import App from "./App";
import Booking from "./pages/Booking";
import Venue from "./pages/venue/Venue";
import Profile from "./pages/profile/Profile";
import Contact from "./pages/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        
        {/* Need to add one route for specific venue and one for all venues (With filters) */}
        <Route path="/Venue/:id" element={<Venue />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
