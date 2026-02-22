import { Images } from "../assets/images";
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";
import MatrixButton from "./MatrixButton";

export default function Hero() {
    return (
        <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
            <MatrixBackground />

            {/* Glow Behind Logo */}
            <div
                className="absolute w-[500px] h-[500px] md:w-[650px] md:h-[650px]
             bg-accent opacity-25 blur-[140px] rounded-full"
            />

            {/* Background Logo */}
            <img
                src={Images.logo}
                alt="TrustGuard Logo Background"
                className="absolute w-[450px] md:w-[600px]
             opacity-20 select-none pointer-events-none"
            />
            <img
                src={Images.logo}
                alt="TrustGuard Logo Background"
                className="absolute w-[450px] md:w-[600px] opacity-15 select-none pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900" />

            <div className="relative z-10 text-center px-6">

                <h1 className="text-5xl md:text-7xl font-bold tracking-wide text-accent mb-4 animate-fadeIn">
                    TrustGuard
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                    AI-powered healthcare fraud detection with transparency and trust.
                </p>

                <div className="relative group inline-block">
                    {/* <Link
                        to="/analyze"
                        className="heart-btn relative inline-flex items-center justify-center
                            px-6 py-3 rounded-md font-medium text-lg
                            bg-accent text-black
                            border border-accent
                            transition-all duration-300
                            group-hover:bg-transparent
                            group-hover:text-accent
                            overflow-hidden"
                    >
                        Get Started

                        <span className="heart-icon">
                            <HeartPulse size={18} strokeWidth={2.2} />
                        </span>
                    </Link> */}
                    <MatrixButton to="/analyze">
                        Get Started
                    </MatrixButton>
                </div>
            </div>
        </section>
    );
}