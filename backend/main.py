from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import shap
import numpy as np
import json
import os
import google.generativeai as genai
import uvicorn
from utils.rule_engine import rule_engine
from pydantic import BaseModel
from typing import Dict, Any
from dotenv import load_dotenv

# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# -----------------------------
# Initialize FastAPI
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load ML Model
# -----------------------------
model = joblib.load("../ml/notebooks/trustguard.pkl")

scaler = model.named_steps["scaler"]
lr_model = model.named_steps["model"]

feature_names = model.feature_names_in_

# SHAP Explainer
background = np.zeros((1, len(feature_names)))
explainer = shap.LinearExplainer(lr_model, background)

# -----------------------------
# Load Peer Stats
# -----------------------------
try:
    with open("peer_stats.json") as f:
        peer_stats = json.load(f)
except Exception:
    peer_stats = {}

# -----------------------------
# LLM Service (Gemini)
# -----------------------------
def generate_llm_summary(decision, risk_score, top_drivers):

    if not GEMINI_API_KEY:
        return None

    prompt = f"""
    You are a healthcare fraud audit AI.

    Risk Level: {decision}
    Risk Score: {risk_score}

    Top Risk Drivers:
    {top_drivers}

    Respond in plain text only.
    Do NOT use markdown, bold formatting, or special characters.

    Provide:
    - Brief professional explanation (3-4 lines)
    - Recommended action
    - Whether manual audit is advised
    """

    try:
        model_llm = genai.GenerativeModel("models/gemini-2.5-flash")
        response = model_llm.generate_content(prompt)
        print("Gemini raw response:", response)
        print("Gemini text:", response.text)
        return response.text
    except Exception as e:
        print("Gemini error:", str(e))
        return None


# -----------------------------
# Input Schema
# -----------------------------
class ProviderFeatures(BaseModel):
    ClaimAfterDeathCount: float = 0
    InpatientRatio: float = 0
    AvgLengthOfStay: float = 0
    RevenuePerBeneficiary: float = 0
    AvgChronicBurden: float = 0
    HighCostRatio: float = 0
    ClaimsPerPatient: float = 0
    RevenueStd: float = 0
    TotalClaims: float = 0
    RevenueMedianGap: float = 0
    AvgDiagnosisCount: float = 0
    DeductibleRatio: float = 0
    TotalRevenue: float = 0
    UniquePatients: float = 0
    ShortNoteRatio: float = 0
    MedicalTermDensity: float = 0
    AvgWordCount: float = 0
    AvgRevenuePerClaim: float = 0
    AgeStd: float = 0
    AvgProcedureCount: float = 0
    HighCostShortNoteRatio: float = 0


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
def predict(data: ProviderFeatures) -> Dict[str, Any]:

    df = pd.DataFrame([data.model_dump()])

    # -------------------------
    # 1️⃣ RULE ENGINE
    # -------------------------
    rule_result = rule_engine(df.iloc[0])
    rule_override = None

    # Only override if CRITICAL
    if isinstance(rule_result, str) and rule_result.startswith("CRITICAL"):
        rule_override = rule_result

    # -------------------------
    # 2️⃣ ML LAYER
    # -------------------------
    df = df.reindex(columns=feature_names, fill_value=0)

    risk_score = model.predict_proba(df)[0][1]

    if risk_score > 0.8:
        decision = "HIGH RISK"
    elif risk_score > 0.6:
        decision = "MEDIUM RISK"
    else:
        decision = "LOW RISK"

    # -------------------------
    # 3️⃣ SHAP EXPLAINABILITY
    # -------------------------
    X_scaled = scaler.transform(df)
    shap_values = explainer.shap_values(X_scaled)

    shap_dict = dict(zip(feature_names, shap_values[0]))
    base_value = float(explainer.expected_value)

    sorted_shap = sorted(
        shap_dict.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # -------------------------
    # 4️⃣ Risk Category Breakdown
    # -------------------------
    financial = ["TotalRevenue","AvgRevenuePerClaim","RevenuePerBeneficiary",
                 "RevenueStd","RevenueMedianGap","DeductibleRatio"]

    claims = ["TotalClaims","UniquePatients","ClaimsPerPatient",
              "InpatientRatio","HighCostRatio","ClaimAfterDeathCount"]

    medical = ["AvgDiagnosisCount","AvgProcedureCount",
               "AvgLengthOfStay","AvgChronicBurden","AgeStd"]

    text = ["ShortNoteRatio","HighCostShortNoteRatio",
            "MedicalTermDensity","AvgWordCount"]

    risk_breakdown = {
        "Financial": float(sum(shap_dict.get(f, 0) for f in financial)),
        "Claims": float(sum(shap_dict.get(f, 0) for f in claims)),
        "Medical": float(sum(shap_dict.get(f, 0) for f in medical)),
        "Text": float(sum(shap_dict.get(f, 0) for f in text))
    }

    # -------------------------
    # 5️⃣ Peer Comparison
    # -------------------------
    peer_comparison = {}

    if peer_stats:
        peer_comparison = {
            "AvgRevenuePerClaim": {
                "provider": float(df["AvgRevenuePerClaim"].iloc[0]),
                "peer_mean": peer_stats.get("AvgRevenuePerClaim")
            },
            "HighCostRatio": {
                "provider": float(df["HighCostRatio"].iloc[0]),
                "peer_mean": peer_stats.get("HighCostRatio")
            },
            "ClaimsPerPatient": {
                "provider": float(df["ClaimsPerPatient"].iloc[0]),
                "peer_mean": peer_stats.get("ClaimsPerPatient")
            }
        }

    # -------------------------
    # 6️⃣ LLM Summary
    # -------------------------
    llm_summary = generate_llm_summary(
        decision,
        float(risk_score),
        sorted_shap[:5]
    )

    # -------------------------
    # Final Response
    # -------------------------
    return {
        "decision": rule_override if rule_override else decision,
        "risk_score": float(risk_score),
        "source": "ML_MODEL",

        "base_value": base_value,
        "shap_values": shap_dict,
        "sorted_shap": sorted_shap,
        "risk_breakdown": risk_breakdown,
        "top_risk_drivers": sorted_shap[:3],

        "peer_comparison": peer_comparison,
        "llm_explanation": llm_summary,
        "rule_flag": rule_result if rule_result != "PASS" else None,

        "original_input": data.model_dump()
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)