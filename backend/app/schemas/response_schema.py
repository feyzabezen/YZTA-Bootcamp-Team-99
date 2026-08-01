from pydantic import BaseModel
from typing import Optional

class PredictionResponse(BaseModel):
    machine_failure: bool
    failure_probability: float
    failure_type: str
    risk_level: str
    recommendation: str
    agent_analysis_report: Optional[str] = None
