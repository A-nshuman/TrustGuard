import { X } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay (No Blur = Faster) */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-gray-900 border border-accent/40
                   rounded-xl p-8 max-w-3xl w-[90%]
                   shadow-lg
                   animate-aboutIn"
            >

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-accent"
                >
                    <X size={22} />
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-accent text-center mb-3">
                    About TrustGuard
                </h2>

                {/* Snake Divider */}
                <div className="ecg-container mx-auto mb-6">

                    <svg viewBox="0 0 400 60" className="ecg-svg">

                        {/* Base Line (Always Visible) */}
                        <path
                            d="
                                M0 30 L40 30 L55 30 L65 10 L75 50 L90 30 L130 30 L150 30 L165 15
                                L180 45 L195 30 L240 30 L260 30 L275 10 L290 50 L305 30 L360 30 L400 30
                            "
                            className="ecg-base"
                        />

                        {/* Moving Pulse */}
                        <path
                            d="
                                M0 30 L40 30 L55 30 L65 10 L75 50 L90 30 L130 30 L150 30 L165 15 L180 45
                                L195 30 L240 30 L260 30 L275 10 L290 50 L305 30 L360 30 L400 30
                            "
                            className="ecg-pulse"
                        />

                    </svg>

                </div>

                {/* Description */}
                <p className="text-gray-400 text-center leading-relaxed mb-8">
                    TrustGuard is an AI-assisted claims intelligence system built to
                    detect anomalous billing patterns and documentation inconsistencies.
                    Our mission is to empower auditors with transparent, explainable
                    insights — without automated enforcement.
                </p>

                {/* Team */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {[
                        "Anshuman Bhardwaj",
                        "Sukhjot Singh",
                        "Sritiz Sahu",
                    ].map((name) => (
                        <div
                            key={name}
                            className="bg-gray-800 rounded-lg p-4 text-center
                         transition hover:border-accent
                         border border-gray-700 hover:shadow-[0_0_30px_#65B15630]
                         hover:-translate-y-1 hover:cursor-pointer"
                        >
                            <h3 className="text-accent font-semibold">
                                {name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Core Developer
                            </p>
                        </div>
                    ))}

                </div>

                {/* Footer Snake Tag */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    🐍 Team Slytherin 🐍
                </p>

            </div>
        </div>
    );
}