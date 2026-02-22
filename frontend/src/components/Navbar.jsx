import { Images } from "../assets/images";
import { HeartPulse } from "lucide-react";
import { useState } from "react";
import AboutModal from "./AboutModal";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="w-full bg-gray-900 shadow-md px-6 py-4 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                <div
                    onClick={() => {
                        if (location.pathname === "/") {
                            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                        } else {
                            navigate("/");
                            setTimeout(() => {
                                document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                        }
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <img
                        src={Images.logo}
                        alt="TrustGuard Logo"
                        className="h-12 w-auto"
                    />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="hidden md:block text-xl font-bold text-accent tracking-wide">
                        TrustGuard
                    </h1>
                </div>

                <div className="relative group">
                    <a
                        onClick={() => setIsAboutOpen(true)}
                        className="heart-btn relative inline-flex items-center justify-center
                            px-4 py-2 rounded-md font-medium
                            bg-accent text-black
                            border border-accent
                            transition-all duration-300
                            group-hover:bg-transparent
                            group-hover:text-accent
                            overflow-hidden cursor-pointer">
                        About Us

                        <span className="heart-icon">
                            <HeartPulse size={16} strokeWidth={2.2} />
                        </span>
                    </a>
                </div>
            </div>
            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />
        </nav>
    );
}