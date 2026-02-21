import { useState } from "react";
import { X } from "lucide-react";
import RiskGauge from "../components/RiskGauge";
import ShapWaterfall from "../components/ShapWaterfall";

export default function Analyze() {

  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
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
          Claim Analysis
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
            <Input label="Short Note Ratio" name="ShortNoteRatio" form={form} setForm={setForm} />
            <Input label="High Cost Short Note Ratio" name="HighCostShortNoteRatio" form={form} setForm={setForm} />
            <Input label="Average Word Count" name="AvgWordCount" form={form} setForm={setForm} />
            <Input label="Medical Term Density" name="MedicalTermDensity" form={form} setForm={setForm} />
          </Section>

          <div className="text-center pt-4">
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
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}


/* -------------------------
   RESULT MODAL
--------------------------*/

function ResultModal({ result, onClose }) {

  const [simulationValue, setSimulationValue] = useState(
    result.original_input?.AvgRevenuePerClaim || 0
  );

  const getRiskColor = () => {
    if (result.decision === "HIGH RISK") return "text-red-400";
    if (result.decision === "MEDIUM RISK") return "text-yellow-400";
    if (result.decision?.includes("CRITICAL")) return "text-red-600";
    return "text-green-400";
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

        <h2 className="text-2xl font-bold text-accent mb-6 text-center">
          Analysis Result
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
                <span className="font-semibold">Fraud Score:</span>{" "}
                {result.risk_score.toFixed(3)}
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

        {/* LLM Explanation */}
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

        {/* Peer Comparison */}
        {result.peer_comparison && (
          <div className="mt-8 bg-gray-800 p-5 rounded-lg border border-accent/30">
            <h3 className="text-accent font-semibold mb-4">
              Peer Comparison
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

        {/* What-If Simulation */}
        <div className="mt-8 bg-gray-800 p-5 rounded-lg border border-accent/30">
          <h3 className="text-accent font-semibold mb-3">
            What-If Simulation
          </h3>

          <label className="text-sm text-gray-400">
            Adjust Average Revenue Per Claim
          </label>

          <input
            type="range"
            min="0"
            max="100000"
            value={simulationValue}
            onChange={(e) =>
              setSimulationValue(parseFloat(e.target.value))
            }
            className="w-full mt-2"
          />

          <div className="text-gray-300 text-sm mt-2">
            Simulated Value: {simulationValue}
          </div>

          <button
            className="mt-4 px-4 py-2 bg-accent text-black rounded"
            onClick={async () => {
              const updated = {
                ...result.original_input,
                AvgRevenuePerClaim: simulationValue
              };

              const res = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
              });

              const newData = await res.json();
              window.location.reload();
            }}
          >
            Recalculate Risk
          </button>
        </div>

      </div>
    </div>
  );
}


/* -------------------------
   SECTION
--------------------------*/

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


/* -------------------------
   INPUT
--------------------------*/

function Input({ label, name, form, setForm }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-400 mb-1">
        {label}
      </label>
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
        className="bg-gray-900 border border-gray-700
        rounded-md px-3 py-2 text-white
        focus:outline-none focus:border-accent
        focus:ring-1 focus:ring-accent"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}