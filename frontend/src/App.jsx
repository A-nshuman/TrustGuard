import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 text-center">

        <h2 className="text-4xl font-bold mb-4 text-accent">
          Welcome to TrustGuard
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          AI-powered healthcare fraud detection with transparency and trust.
        </p>

      </main>

      <Footer />

    </div>
  );
}