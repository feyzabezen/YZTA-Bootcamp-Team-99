import os
from dotenv import load_dotenv

# Env yüklemesi ve çakışma yaratan anahtarın temizlenmesi en başta çalışmalı
load_dotenv()

if "GOOGLE_API_KEY" in os.environ:
    del os.environ["GOOGLE_API_KEY"]

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.predict_schema import PredictionRequest, PredictionResponse
from app.services.predict_service import predict_machine

app = FastAPI(
    title="Predictive Maintenance API",
    version="1.0.0"
)

# FRONTEND BAĞLANTISI İÇİN CORS MİDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(payload: PredictionRequest):
    result = predict_machine(payload, db=None)
    return result

@app.get("/")
def home():
    return {
        "message": "Predictive Maintenance API is running."
    }
