from pydantic import BaseModel


class PredictionResponse(BaseModel):
    machine_failure: bool
    failure_probability: float
    failure_type: str
    risk_level: str
    recommendation: str