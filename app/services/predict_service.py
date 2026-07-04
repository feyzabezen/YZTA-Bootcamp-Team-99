from app.schemas.predict_schema import PredictionRequest


def predict_machine(data: PredictionRequest):

    risk = "Low"
    probability = 0.12
    failure = False
    failure_type = "No Failure"
    recommendation = "Makine normal çalışıyor."

    if data.process_temperature > 310:
        risk = "High"
        probability = 0.91
        failure = True
        failure_type = "Heat Dissipation Failure"
        recommendation = "Soğutma sistemini kontrol edin."

    elif data.tool_wear > 180:
        risk = "Medium"
        probability = 0.68
        failure = True
        failure_type = "Tool Wear Failure"
        recommendation = "Takımı değiştirin."

    elif data.torque > 65:
        risk = "High"
        probability = 0.84
        failure = True
        failure_type = "Power Failure"
        recommendation = "Motor yükünü azaltın."

    return {
        "machine_failure": failure,
        "failure_probability": probability,
        "failure_type": failure_type,
        "risk_level": risk,
        "recommendation": recommendation
    }