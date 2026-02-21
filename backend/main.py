from fastapi import FastAPI
import joblib
import pandas as pd
from utils.rule_engine import rule_engine
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

# Load trained pipeline model
model = joblib.load("../ml/notebooks/trustguard.pkl")


# -----------------------------
# Input Schema (Validated)
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

    # Convert validated input to DataFrame
    df = pd.DataFrame([data.model_dump()])

    # -------------------------
    # 1️⃣ RULE ENGINE LAYER
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

    # Align features with training schema
    df = df.reindex(columns=model.feature_names_in_, fill_value=0)

    # Predict probability
    risk_score = model.predict_proba(df)[0][1]

    if risk_score > 0.8:
        decision = "HIGH RISK"
    elif risk_score > 0.6:
        decision = "MEDIUM RISK"
    else:
        decision = "LOW RISK"

    # -------------------------
    # 3️⃣ EXPLAINABILITY
    # -------------------------

    # Extract logistic regression coefficients
    lr_model = model.named_steps["model"]
    coefs = lr_model.coef_[0]
    feature_names = model.feature_names_in_

    # Compute feature contributions
    feature_values = df.iloc[0].values
    contributions = feature_values * coefs

    feature_contrib = dict(zip(feature_names, contributions))

    # Get top 3 drivers
    top_features = sorted(
        feature_contrib.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:3]

    return {
        "decision": decision,
        "risk_score": float(risk_score),
        "source": "ML_MODEL",
        "top_risk_drivers": top_features
    }