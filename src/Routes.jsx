import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Login from "./pages/Auth/Customer/Login";
import Register from "./pages/Auth/Customer/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />}></Route>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      {/* Need to add one route for specific venue and one for all venues (With filters) */}
      <Route path="/Venue" element={<Venues />} /> 
      <Route path="/Booking" element={<Booking />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
