import { X } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            <div className="relative bg-gray-900 border border-accent/40
                      rounded-2xl p-10 max-w-3xl w-[90%]
                      shadow-[0_0_40px_#65B15630]
                      animate-modalIn">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-accent transition"
                >
                    <X size={22} />
                </button>

                <h2 className="text-3xl font-bold text-accent mb-6 text-center">
                    About TrustGuard
                </h2>

                <p className="text-gray-400 text-center mb-8 leading-relaxed">
                    TrustGuard is an AI-assisted claims intelligence system designed to
                    detect anomalous billing patterns and documentation inconsistencies.
                    Built with transparency and explainability at its core, the platform
                    empowers auditors with actionable insights — without making automated
                    legal or enforcement decisions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {["Anshuman Bhardwaj", "Sukhjot Singh", "Sritiz Sahu"].map((name) => (
                        <div
                            key={name}
                            className="bg-gray-800 rounded-xl p-5 text-center
                         transition hover:-translate-y-2
                         hover:shadow-[0_0_20px_#65B15640]"
                        >
                            <h3 className="text-accent font-semibold">{name}</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Core Developer
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}