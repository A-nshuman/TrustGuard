def rule_engine(row):

    # -------------------- CRITICAL --------------------

    if row.get("ClaimAfterDeathCount", 0) > 0:
        return "CRITICAL: Billing After Death"

    if row.get("InpatientRatio", 0) > 0.98 and row.get("AvgLengthOfStay", 0) < 1:
        return "CRITICAL: Impossible Stay Pattern"

    if row.get("RevenuePerBeneficiary", 0) > 100000 and row.get("AvgChronicBurden", 0) < 0.2:
        return "CRITICAL: Extreme Billing With Low Severity"

    if row.get("HighCostRatio", 0) > 0.95:
        return "CRITICAL: Nearly All Claims High Cost"


    # -------------------- HIGH --------------------

    if row.get("ClaimsPerPatient", 0) > 12:
        return "HIGH: Extreme Repeat Billing"

    if row.get("RevenueStd", 0) == 0 and row.get("TotalClaims", 0) > 20:
        return "HIGH: Identical Billing Pattern"

    if row.get("RevenueMedianGap", 0) > 25000:
        return "HIGH: Severe Cost Skew"

    if row.get("InpatientRatio", 0) > 0.85 and row.get("AvgDiagnosisCount", 0) < 2:
        return "HIGH: Too Many Admissions Low Diagnosis"

    if row.get("DeductibleRatio", 1) < 0.01 and row.get("TotalRevenue", 0) > 500000:
        return "HIGH: Suspicious Deductible Pattern"

    if row.get("UniquePatients", 0) < 10 and row.get("TotalClaims", 0) > 200:
        return "HIGH: Few Patients Too Many Claims"


    # -------------------- MEDIUM --------------------

    if row.get("ShortNoteRatio", 0) > 0.75:
        return "MEDIUM: Weak Documentation"

    if row.get("MedicalTermDensity", 0) < 1.5:
        return "MEDIUM: Low Clinical Language"

    if row.get("AvgWordCount", 0) < 10 and row.get("AvgRevenuePerClaim", 0) > 20000:
        return "MEDIUM: Expensive Claims Poor Notes"

    if row.get("AgeStd", 0) < 2 and row.get("TotalClaims", 0) > 100:
        return "MEDIUM: Unnatural Patient Demographics"

    if row.get("AvgProcedureCount", 0) > 6 and row.get("AvgDiagnosisCount", 0) < 2:
        return "MEDIUM: Too Many Procedures Few Diagnoses"

    if row.get("RevenuePerBeneficiary", 0) > 50000 and row.get("ClaimsPerPatient", 0) > 6:
        return "MEDIUM: High Spending + High Frequency"

    if row.get("AvgLengthOfStay", 0) > 15:
        return "MEDIUM: Long Stay Pattern"

    if row.get("HighCostRatio", 0) > 0.6 and row.get("AvgChronicBurden", 0) < 0.3:
        return "MEDIUM: High Cost Low Complexity"


    # -------------------- PASS --------------------

    return "PASS"
