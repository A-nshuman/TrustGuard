from fastapi import FastAPI
import joblib
import pandas as pd
import shap
from utils.rule_engine import rule_engine
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

# -----------------------------
# Load trained pipeline model
# -----------------------------

model = joblib.load("../ml/notebooks/trustguard.pkl")

# Extract components
scaler = model.named_steps["scaler"]
lr_model = model.named_steps["model"]

# Use small synthetic background for SHAP
# (only needed once at startup)
background = pd.DataFrame(
    [[0] * len(model.feature_names_in_)],
    columns=model.feature_names_in_
)

background_scaled = scaler.transform(background)

explainer = shap.LinearExplainer(
    lr_model,
    background_scaled
)


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

    if rule_result != "PASS":
        return {
            "decision": rule_result,
            "risk_score": None,
            "source": "RULE_ENGINE",
            "explanation": "Flagged by deterministic rule layer"
        }

    # -------------------------
    # 2️⃣ ML LAYER
    # -------------------------

    df = df.reindex(columns=model.feature_names_in_, fill_value=0)

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

    scaled_df = scaler.transform(df)

    shap_values = explainer.shap_values(scaled_df)

    shap_array = shap_values[0]
    base_value = explainer.expected_value

    feature_names = model.feature_names_in_

    shap_contrib = dict(zip(feature_names, shap_array))

    top_features = sorted(
        shap_contrib.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:3]

    # Round for clean UI
    shap_contrib = {k: round(v, 6) for k, v in shap_contrib.items()}
    top_features = [(k, round(v, 6)) for k, v in top_features]

    return {
        "decision": decision,
        "risk_score": float(risk_score),
        "source": "ML_MODEL",
        "base_value": float(base_value),
        "shap_values": shap_contrib,
        "top_risk_drivers": top_features
    }