from pydantic import BaseModel
from typing import Literal, Optional

class PredictionRequest(BaseModel):
    type: Literal["L", "M", "H"]
    air_temperature: float
    process_temperature: float
    rotational_speed: int
    torque: float
    tool_wear: int

class PredictionResponse(BaseModel):
    machine_failure: bool
    failure_probability: float
    failure_type: str
    risk_level: str
    recommendation: str
    agent_analysis_report: Optional[str] = None
