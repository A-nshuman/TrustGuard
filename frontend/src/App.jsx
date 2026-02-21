import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      <Navbar />
      <Hero />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 text-center">

        <h2 className="text-3xl font-bold mb-4 text-accent">
          Welcome to TrustGuard
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Secure, transparent, and intelligent claims analysis.
        </p>

      </main>

      <Footer />

    </div>
  );
}