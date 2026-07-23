from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional, Any
import os
import json

from backend.optimizer import optimize_trip_budget, load_dataset

app = FastAPI(
    title="TripBudget AI - Optimization API",
    description="Intelligent Linear Programming Budget Engine for Vietnam Travel",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PreferencesInput(BaseModel):
    stay: Optional[float] = Field(default=1.0, ge=0.1, le=3.0, description="Stay weight preference")
    food: Optional[float] = Field(default=1.0, ge=0.1, le=3.0, description="Food weight preference")
    transport: Optional[float] = Field(default=1.0, ge=0.1, le=3.0, description="Transport weight preference")
    activities: Optional[float] = Field(default=1.0, ge=0.1, le=3.0, description="Activities weight preference")

class OptimizeBudgetRequest(BaseModel):
    total_budget: float = Field(..., gt=0, description="Total budget in VND")
    num_days: int = Field(..., ge=1, le=30, description="Number of travel days")
    destination_id: str = Field(..., description="Destination identifier (e.g. ha-noi, da-nang, phu-quoc)")
    preferences: Optional[PreferencesInput] = Field(default_factory=PreferencesInput)

@app.get("/")
def read_root():
    return {
        "app": "TripBudget AI API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/v1/destinations")
def get_destinations():
    data = load_dataset()
    return {
        "status": "success",
        "count": len(data["destinations"]),
        "destinations": data["destinations"]
    }

@app.post("/api/v1/optimize-budget")
def api_optimize_budget(req: OptimizeBudgetRequest):
    try:
        prefs = req.preferences.dict() if req.preferences else {}
        result = optimize_trip_budget(
            total_budget=req.total_budget,
            num_days=req.num_days,
            destination_id=req.destination_id,
            preferences=prefs
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
