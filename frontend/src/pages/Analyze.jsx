import { useState } from "react";
import { X } from "lucide-react";
import RiskGauge from "../components/RiskGauge";
import ShapWaterfall from "../components/ShapWaterfall";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function Analyze() {

    const [form, setForm] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const demoData = {
        // Financial Metrics
        TotalRevenue: 280910,
        AvgRevenuePerClaim: 241.124463519313,
        RevenueStd: 491.556391867259,
        RevenuePerBeneficiary: 566.350806451612,
        DeductibleRatio: 0.0131714315210155,
        RevenueMedianGap: 168.124463519313,

        // Claim Statistics
        TotalClaims: 1165,
        UniquePatients: 495,
        ClaimsPerPatient: 2.34879032258064,
        InpatientRatio: 0,
        HighCostRatio: 0.023175965665236,
        ClaimAfterDeathCount: 0,

        // Medical Details
        AvgDiagnosisCount: 2.58884120171673,
        AvgProcedureCount: 0,
        AvgLengthOfStay: 38,
        AvgChronicBurden: 1.58060085836909,
        AgeStd: 10.3574338438221,

        // Notes & Text Analysis
        ShortNoteRatio: 0.015450643776824,
        HighCostShortNoteRatio: 0,
        AvgWordCount: 486.928755364806,
        MedicalTermDensity: 2.70643776824034
    };

    const handleDemoFill = () => {
        setForm(demoData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("https://trustguard-backend-zzsk.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            setResult(data);

        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 px-6 py-12">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold text-accent text-center mb-10">
                    Claim Risk Intelligence Dashboard
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-800 border border-accent/30
          rounded-2xl p-8 shadow-[0_0_30px_#65B15630]
          space-y-8"
                >

                    <Section title="Financial Metrics">
                        <Input label="Total Revenue" name="TotalRevenue" form={form} setForm={setForm} />
                        <Input label="Average Revenue Per Claim" name="AvgRevenuePerClaim" form={form} setForm={setForm} />
                        <Input label="Revenue Standard Deviation" name="RevenueStd" form={form} setForm={setForm} />
                        <Input label="Revenue Per Beneficiary" name="RevenuePerBeneficiary" form={form} setForm={setForm} />
                        <Input label="Deductible Ratio" name="DeductibleRatio" form={form} setForm={setForm} />
                        <Input label="Revenue Median Gap" name="RevenueMedianGap" form={form} setForm={setForm} />
                    </Section>

                    <Section title="Claim Statistics">
                        <Input label="Total Claims" name="TotalClaims" form={form} setForm={setForm} />
                        <Input label="Unique Patients" name="UniquePatients" form={form} setForm={setForm} />
                        <Input label="Claims Per Patient" name="ClaimsPerPatient" form={form} setForm={setForm} />
                        <Input label="Inpatient Ratio" name="InpatientRatio" form={form} setForm={setForm} />
                        <Input label="High Cost Ratio" name="HighCostRatio" form={form} setForm={setForm} />
                        <Input label="Claim After Death Count" name="ClaimAfterDeathCount" form={form} setForm={setForm} />
                    </Section>

                    <Section title="Medical Details">
                        <Input label="Avg Diagnosis Count" name="AvgDiagnosisCount" form={form} setForm={setForm} />
                        <Input label="Avg Procedure Count" name="AvgProcedureCount" form={form} setForm={setForm} />
                        <Input label="Avg Length of Stay" name="AvgLengthOfStay" form={form} setForm={setForm} />
                        <Input label="Avg Chronic Burden" name="AvgChronicBurden" form={form} setForm={setForm} />
                        <Input label="Age Standard Deviation" name="AgeStd" form={form} setForm={setForm} />
                    </Section>

                    <Section title="Notes & Text Analysis">

                        <Input
                            label="Short Note Ratio"
                            name="ShortNoteRatio"
                            form={form}
                            setForm={setForm}
                            tooltip="Proportion of claims that contain very short clinical notes. High values may indicate insufficient documentation."
                        />

                        <Input
                            label="High Cost Short Note Ratio"
                            name="HighCostShortNoteRatio"
                            form={form}
                            setForm={setForm}
                            tooltip="Percentage of high-cost claims that also have short or incomplete notes. This can indicate potential billing risk."
                        />

                        <Input
                            label="Average Word Count"
                            name="AvgWordCount"
                            form={form}
                            setForm={setForm}
                        />

                        <Input
                            label="Medical Term Density"
                            name="MedicalTermDensity"
                            form={form}
                            setForm={setForm}
                        />

                    </Section>

                    <div className="text-center pt-4 flex justify-center gap-4">

                        <button
                            type="button"
                            onClick={handleDemoFill}
                            className="px-6 py-3 rounded-md font-medium
        border border-accent text-accent
        hover:bg-accent hover:text-black
        transition"
                        >
                            Populate
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-md font-medium text-lg
        bg-accent text-black hover:bg-transparent hover:text-accent
        border border-accent transition"
                        >
                            {loading ? "Analyzing & Generating AI Report..." : "Analyze Claim"}
                        </button>

                    </div>

                </form>
            </div>

            {result && (
                <ResultModal
                    result={result}
                    setResult={setResult}
                    onClose={() => setResult(null)}
                />
            )}
        </div>
    );
}

/* ------------------------- RESULT MODAL -------------------------- */

function ResultModal({ result, setResult, onClose }) {

    const [simulationValue, setSimulationValue] = useState(
        result.original_input?.AvgRevenuePerClaim || 0
    );

    const [showDownloadAnim, setShowDownloadAnim] = useState(false);

    const getRiskColor = () => {
        if (result.decision === "HIGH RISK") return "text-red-400";
        if (result.decision === "MEDIUM RISK") return "text-yellow-400";
        if (result.decision?.includes("CRITICAL")) return "text-red-600";
        return "text-green-400";
    };

    const simulateRisk = async () => {
        const updated = {
            ...result.original_input,
            AvgRevenuePerClaim: simulationValue
        };

        const res = await fetch("https://trustguard-backend-zzsk.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        });

        const newData = await res.json();
        newData.original_input = updated;
        setResult(newData);
    };

    const exportPDF = async () => {

        // Trigger animation
        setShowDownloadAnim(true);

        setTimeout(() => {
            setShowDownloadAnim(false);
        }, 700);


        const element = document.getElementById("pdf-content");

        const canvas = await html2canvas(element, {
            scale: 2
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save("TrustGuard_Fraud_Report.pdf");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className="relative bg-gray-900 border border-accent/40
        rounded-2xl p-8 max-w-3xl w-[95%]
        shadow-[0_0_40px_#65B15640] overflow-y-auto max-h-[90vh]"
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-accent"
                >
                    <X size={22} />
                </button>

                <div id="pdf-content">

                    <h2 className="text-2xl font-bold text-accent mb-6 text-center">
                        Fraud Risk Analysis Report
                    </h2>

                    <div className="text-center space-y-3 text-gray-300">
                        <p>
                            <span className="font-semibold">Risk Level:</span>{" "}
                            <span className={getRiskColor()}>
                                {result.decision}
                            </span>
                        </p>

                        {result.risk_score !== undefined && (
                            <>
                                <p>
                                    <span className="font-semibold">Fraud Probability:</span>{" "}
                                    {(result.risk_score * 100).toFixed(1)}%
                                </p>

                                <div className="mt-6 flex justify-center">
                                    <RiskGauge score={result.risk_score} />
                                </div>
                            </>
                        )}
                    </div>

                    {result.sorted_shap && (
                        <div className="mt-8">
                            <ShapWaterfall
                                baseValue={result.base_value}
                                shapValues={result.sorted_shap}
                            />
                        </div>
                    )}

                    {result.llm_explanation && (
                        <div className="mt-8 bg-gray-800 p-5 rounded-lg border border-accent/30">
                            <h3 className="text-accent font-semibold mb-3">
                                AI Risk Assessment
                            </h3>
                            <p className="text-gray-300 text-sm whitespace-pre-line">
                                {result.llm_explanation}
                            </p>
                        </div>
                    )}

                    {result.peer_comparison && Object.keys(result.peer_comparison).length > 0 && (
                        <div className="mt-8 bg-gray-800 p-5 rounded-lg border border-accent/30">
                            <h3 className="text-accent font-semibold mb-4">
                                Peer Benchmark Comparison
                            </h3>

                            {Object.entries(result.peer_comparison).map(([feature, values]) => {

                                const deviation =
                                    values.peer_mean
                                        ? ((values.provider - values.peer_mean) / values.peer_mean) * 100
                                        : 0;

                                const isHigh = deviation > 0;

                                return (
                                    <div key={feature} className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{feature}</span>
                                            <span className={isHigh ? "text-red-400" : "text-green-400"}>
                                                {deviation.toFixed(1)}%
                                            </span>
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            Provider: {values.provider?.toFixed(2)} | Peer Avg: {values.peer_mean?.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                <div className="mt-6 text-center relative">

                    <button
                        onClick={exportPDF}
                        className={`
        relative overflow-hidden
        px-6 py-2 rounded-md
        bg-accent text-black
        border border-accent
        transition-all duration-150
        hover:bg-transparent hover:text-accent

        ${showDownloadAnim ? "scale-95" : "scale-100"}
        `}
                    >
                        Export Report as PDF
                    </button>


                    {/* Floating Download Icon */}
                    {showDownloadAnim && (
                        <span
                            className="
            absolute left-1/2 -translate-x-1/2
            top-1/2
            animate-downloadFloat
            text-accent
            pointer-events-none
            "
                        >
                            <Download size={26} />
                        </span>
                    )}

                </div>

                {/* Risk Impact Simulator */}
                <div className="mt-8 bg-gray-800 p-5 rounded-lg border border-accent/30">
                    <h3 className="text-accent font-semibold mb-2">
                        Risk Impact Simulator
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Adjust billing intensity to see how fraud probability changes in real time.
                    </p>

                    <input
                        type="range"
                        min="0"
                        max="100000"
                        value={simulationValue}
                        onChange={(e) =>
                            setSimulationValue(parseFloat(e.target.value))
                        }
                        className="w-full"
                    />

                    <div className="text-gray-300 text-sm mt-2">
                        Simulated Avg Revenue Per Claim: {simulationValue}
                    </div>

                    <button
                        className="relative overflow-hidden
        px-6 py-2 rounded-md
        bg-accent text-black
        border border-accent
        transition-all duration-150
        hover:bg-transparent hover:text-accent mt-2"
                        onClick={simulateRisk}
                    >
                        Simulate Risk Change
                    </button>
                </div>

            </div>
        </div>
    );
}

/* ------------------------- SECTION -------------------------- */

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

/* ------------------------- INPUT -------------------------- */

function Input({ label, name, form, setForm, tooltip }) {
    return (
        <div className="flex flex-col relative">

            {/* Label Row */}
            <div className="flex items-center gap-1 mb-1">

                <label className="text-sm text-gray-400">
                    {label}
                </label>

                {/* Tooltip Icon */}
                {tooltip && (
                    <div className="group relative cursor-pointer">

                        <span
                            className="
              w-4 h-4 flex items-center justify-center
              rounded-full border border-gray-500
              text-[10px] text-gray-400
              hover:border-accent hover:text-accent
              transition
              "
                        >
                            i
                        </span>

                        {/* Tooltip Box */}
                        <div
                            className="
              absolute left-1/2 -translate-x-1/2
              bottom-full mb-2
              w-64
              bg-gray-900 border border-accent/40
              text-gray-300 text-xs
              rounded-md px-3 py-2
              opacity-0 group-hover:opacity-100
              pointer-events-none
              transition
              shadow-lg
              z-20
              "
                        >
                            {tooltip}
                        </div>

                    </div>
                )}

            </div>


            {/* Input */}
            <input
                type="number"
                step="any"
                required
                value={form[name] ?? ""}
                onChange={(e) =>
                    setForm({
                        ...form,
                        [name]: parseFloat(e.target.value)
                    })
                }
                className="
        bg-gray-900 border border-gray-700
        rounded-md px-3 py-2 text-white
        focus:outline-none focus:border-accent
        focus:ring-1 focus:ring-accent
        transition
        "
                placeholder={`Enter ${label}`}
            />

        </div>
    );
}