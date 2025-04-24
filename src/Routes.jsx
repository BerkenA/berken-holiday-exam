import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Auth/Customer/Login";
import Register from "./pages/Auth/Customer/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />}></Route>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
