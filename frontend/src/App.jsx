import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

import Analyze from "./pages/Analyze";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Footer />
            </>
          }
        />

        <Route path="/analyze" element={<Analyze />} />

      </Routes>

    </div>
  );
}