from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

# Hatalı olan 'from app.database.base_class import Base' satırı yerine bunu yaz:
Base = declarative_base()

class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    machine_type = Column(String(5))
    air_temperature = Column(Float)
    process_temperature = Column(Float)
    rotational_speed = Column(Integer)
    torque = Column(Float)
    tool_wear = Column(Integer)
    
    machine_failure = Column(Boolean)
    failure_probability = Column(Float)
    failure_type = Column(String(100))
    risk_level = Column(String(20))
    recommendation = Column(Text)
    
    agent_analysis_report = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())