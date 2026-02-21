import { useState } from "react";
import { HeartPulse, X } from "lucide-react";

export default function Analyze() {
    const [result, setResult] = useState(null);
    const [showHeart, setShowHeart] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowHeart(true);

        setTimeout(() => {
            setShowHeart(false);

            setResult({
                risk: "High",
                score: "0.87",
                status: "Potential Fraud Detected",
            });

        }, 600);
    };

    return (
        <div className="min-h-screen bg-gray-900 px-6 py-12">

            <div className="max-w-5xl mx-auto">

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-accent text-center mb-10">
                    Claim Analysis
                </h1>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-800 border border-accent/30
                     rounded-2xl p-8 shadow-[0_0_30px_#65B15630]
                     space-y-8"
                >

                    {/* ================= Financial Metrics ================= */}
                    <Section title="Financial Metrics">
                        <Input label="Total Revenue" />
                        <Input label="Average Revenue Per Claim" />
                        <Input label="Revenue Standard Deviation" />
                        <Input label="Revenue Per Beneficiary" />
                        <Input label="Deductible Ratio" />
                        <Input label="Revenue Median Gap" />
                    </Section>

                    {/* ================= Claim Statistics ================= */}
                    <Section title="Claim Statistics">
                        <Input label="Total Claims" />
                        <Input label="Unique Patients" />
                        <Input label="Claims Per Patient" />
                        <Input label="Inpatient Ratio" />
                        <Input label="High Cost Ratio" />
                        <Input label="Claim After Death Count" />
                    </Section>

                    {/* ================= Medical Details ================= */}
                    <Section title="Medical Details">
                        <Input label="Avg Diagnosis Count" />
                        <Input label="Avg Procedure Count" />
                        <Input label="Avg Length of Stay" />
                        <Input label="Avg Chronic Burden" />
                        <Input label="Age Standard Deviation" />
                    </Section>

                    {/* ================= Notes & Text Analysis ================= */}
                    <Section title="Notes & Text Analysis">
                        <Input label="Short Note Ratio" />
                        <Input label="High Cost Short Note Ratio" />
                        <Input label="Average Word Count" />
                        <Input label="Medical Term Density" />
                    </Section>

                    {/* ================= Submit Button ================= */}
                    <div className="text-center pt-4 relative">

                        <button
                            type="submit"
                            className="analyze-btn relative inline-flex items-center justify-center
                         px-8 py-3 rounded-md font-medium text-lg
                         bg-accent text-black
                         border border-accent
                         transition-all duration-300
                         hover:bg-transparent hover:text-accent
                         overflow-hidden"
                        >
                            Analyze Claim
                        </button>

                        {/* Floating Heart */}
                        {showHeart && (
                            <span className="analyze-heart">
                                <HeartPulse size={26} strokeWidth={2.2} />
                            </span>
                        )}

                    </div>

                </form>

            </div>

            {/* ================= Output Modal ================= */}
            {result && (
                <ResultModal result={result} onClose={() => setResult(null)} />
            )}

        </div>
    );
}


function ResultModal({ result, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-gray-900 border border-accent/40
                   rounded-2xl p-8 max-w-md w-[90%]
                   text-center
                   shadow-[0_0_40px_#65B15640]
                   animate-modalIn"
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-accent"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-accent mb-6">
                    Analysis Result
                </h2>

                <div className="space-y-3 text-gray-300">

                    <p>
                        <span className="font-semibold">Risk Level:</span>{" "}
                        <span className="text-red-400">{result.risk}</span>
                    </p>

                    <p>
                        <span className="font-semibold">Fraud Score:</span>{" "}
                        {result.score}
                    </p>

                    <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {result.status}
                    </p>

                </div>

            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>

            <h2 className="text-xl font-semibold text-accent mb-4 border-b border-accent/30 pb-2">
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>

        </div>
    );
}

function Input({ label }) {
    return (
        <div className="flex flex-col">

            <label className="text-sm text-gray-400 mb-1">
                {label}
            </label>

            <input
                type="number"
                step="any"
                required
                className="bg-gray-900 border border-gray-700
                   rounded-md px-3 py-2 text-white
                   focus:outline-none focus:border-accent
                   focus:ring-1 focus:ring-accent
                   transition"
                placeholder={`Enter ${label}`}
            />

        </div>
    );
}