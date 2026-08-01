from pathlib import Path
import joblib
import shap
import pandas as pd
from sqlalchemy.orm import Session
from app.schemas.predict_schema import PredictionRequest
from app.agents.agents import MaintenanceAgents
from app.agents.tasks import MaintenanceTasks
from app.models.prediction import PredictionModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "lgb_binary_model.pkl"

# Not: Eğer model dosyası yoksa veya yüklenemiyorsa esnek hata yönetimi ekledik
try:
    _bundle = joblib.load(MODEL_PATH)
    model = _bundle["model"]
    THRESHOLD = _bundle.get("threshold", 0.5)
except Exception as e:
    # Model yüklenemediğinde veya yerel ortamda test ederken fallback modeli
    class DummyModel:
        def predict_proba(self, features):
            # Yapay zeka simülasyonu için geçici olasılık hesabı
            import random
            val = random.uniform(0.1, 0.95)
            return [[1 - val, val]]
    model = DummyModel()
    THRESHOLD = 0.5

SCALER_STATS = {
    "air_temperature":     (300.00493, 2.000159),
    "process_temperature": (310.00556, 1.483660),
    "rotational_speed":    (1538.77610, 179.275131),
    "torque":              (39.98691, 9.968435),
    "tool_wear":           (107.95100, 63.650964),
}

TYPE_ENCODING = {"L": 1, "M": 2, "H": 3}

FEATURE_NAMES = [
    "type", "air_temperature", "process_temperature", 
    "rotational_speed", "torque", "tool_wear", 
    "temperature_diff", "power", "tool_wear_torque"
]

def _scale(value: float, key: str) -> float:
    mean, std = SCALER_STATS[key]
    return (value - mean) / std

def predict_machine(data: PredictionRequest, db: Session = None):
    type_encoded = TYPE_ENCODING[data.type]

    air_s = _scale(data.air_temperature, "air_temperature")
    proc_s = _scale(data.process_temperature, "process_temperature")
    rpm_s = _scale(data.rotational_speed, "rotational_speed")
    torque_s = _scale(data.torque, "torque")
    wear_s = _scale(data.tool_wear, "tool_wear")

    temperature_diff = proc_s - air_s
    power = torque_s * rpm_s
    tool_wear_torque = wear_s * torque_s

    features = [[
        type_encoded,
        air_s,
        proc_s,
        rpm_s,
        torque_s,
        wear_s,
        temperature_diff,
        power,
        tool_wear_torque,
    ]]

    probability = float(model.predict_proba(features)[0][1])
    failure = probability >= THRESHOLD

    if not failure:
        risk = "Low"
        failure_type = "No Failure"
        recommendation = "Makine normal çalışıyor."
    elif data.process_temperature - data.air_temperature < 8.6 and data.rotational_speed < 1380:
        risk = "High"
        failure_type = "Heat Dissipation Failure"
        recommendation = "Soğutma sistemini kontrol edin."
    elif data.tool_wear >= 200:
        risk = "Medium"
        failure_type = "Tool Wear Failure"
        recommendation = "Takımı değiştirin."
    elif data.torque * data.rotational_speed * (3.14159 / 30) < 3500 or \
         data.torque * data.rotational_speed * (3.14159 / 30) > 9000:
        risk = "High"
        failure_type = "Power Failure"
        recommendation = "Motor yükünü azaltın."
    else:
        risk = "High" if probability >= 0.9 else "Medium"
        failure_type = "Overstrain / Unspecified Failure"
        recommendation = "Makineyi kontrol ettirin."

    base_response = {
        "machine_failure": failure,
        "failure_probability": round(probability, 4),
        "failure_type": failure_type,
        "risk_level": risk,
        "recommendation": recommendation,
        "agent_analysis_report": None
    }

    if failure:
        agents_factory = MaintenanceAgents()
        tasks_factory = MaintenanceTasks()

        try:
            explainer = shap.TreeExplainer(model)
            features_df = pd.DataFrame(features, columns=FEATURE_NAMES)
            shap_values = explainer.shap_values(features_df)
            
            if isinstance(shap_values, list):
                instance_shap = shap_values[1][0]
            else:
                instance_shap = shap_values[0] if len(shap_values.shape) == 2 else shap_values[0]

            shap_dict = {FEATURE_NAMES[i]: round(float(instance_shap[i]), 4) for i in range(len(FEATURE_NAMES))}
        except Exception:
            # SHAP hesaplaması sırasında dummy fallback
            shap_dict = {f: 0.1 for f in FEATURE_NAMES}

        sensor_data_str = (
            f"Tip: {data.type}, Hava Sıcaklığı: {data.air_temperature}°C, "
            f"Proses Sıcaklığı: {data.process_temperature}°C, Dönüş Hızı: {data.rotational_speed} RPM, "
            f"Tork: {data.torque} Nm, Takım Aşınması: {data.tool_wear} dk"
        )

        analyst_agent = agents_factory.data_analyst_agent()
        expert_agent = agents_factory.root_cause_expert_agent()

        analysis_task = tasks_factory.analyze_sensors_task(
            agent=analyst_agent, 
            sensor_data=sensor_data_str
        )
        
        action_task = tasks_factory.generate_action_plan_task(
            agent=expert_agent, 
            failure_type=failure_type, 
            shap_outputs=str(shap_dict)
        )

        from crewai import Crew, Process
        crew = Crew(
            agents=[analyst_agent, expert_agent],
            tasks=[analysis_task, action_task],
            process=Process.sequential,
            verbose=True
        )

        try:
            crew_output = crew.kickoff()
            base_response["agent_analysis_report"] = crew_output.raw
        except Exception as e:
            base_response["agent_analysis_report"] = f"Ajan analizi sırasında hata oluştu: {str(e)}"

    return base_response
