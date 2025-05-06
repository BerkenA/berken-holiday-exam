import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import App from "./App";
import Booking from "./pages/Booking";
import Venue from "./pages/Venue";
import Profile from "./pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        {/* Need to add one route for specific venue and one for all venues (With filters) */}
        <Route path="/Venue" element={<Venue />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
