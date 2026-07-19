from fastapi import APIRouter

from app.schemas.predict_schema import PredictionRequest
from app.schemas.response_schema import PredictionResponse
from app.services.predict_service import predict_machine

router = APIRouter()

@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: PredictionRequest):
    result = predict_machine(data)
    return result