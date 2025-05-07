import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto min-h-screen min-w-screen m-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
