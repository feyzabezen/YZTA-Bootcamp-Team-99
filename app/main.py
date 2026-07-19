import os
from dotenv import load_dotenv

# Importlardan önce çalışmalı
load_dotenv()

from fastapi import FastAPI
from app.schemas.predict_schema import PredictionRequest, PredictionResponse
from app.services.predict_service import predict_machine

app = FastAPI(
    title="Predictive Maintenance API",
    version="1.0.0"
)

# db=None parametresi vererek get_db bağımlılığını kaldırdık
@app.post("/api/v1/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(payload: PredictionRequest):
    result = predict_machine(payload, db=None)
    return result

@app.get("/")
def home():
    return {
        "message": "Predictive Maintenance API is running."
    }