import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EditProfile from "./pages/profile/EditProfile";
import App from "./App";
import Venue from "./pages/venue/Venue";
import Profile from "./pages/profile/Profile";
import CreateVenue from "./pages/venue/CreateVenue";
import ScrollToTop from "./components/ScrollToTop";
import EditVenue from "./pages/venue/EditVenue";
import NotFound from "./pages/NotFound"
import SearchBar from "./components/SearchBar";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/CreateVenue" element={<CreateVenue />} />
          <Route path="/Venue/:id" element={<Venue />} />
          <Route path="/venue/edit/:id" element={<EditVenue />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
