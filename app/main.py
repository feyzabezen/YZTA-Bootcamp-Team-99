from fastapi import FastAPI

from app.api.predict import router as predict_router

app = FastAPI(
    title="Predictive Maintenance API",
    version="1.0.0"
)

app.include_router(
    predict_router,
    prefix="/api/v1",
    tags=["Prediction"]
)


@app.get("/")
def home():
    return {
        "message": "Predictive Maintenance API is running."
    }