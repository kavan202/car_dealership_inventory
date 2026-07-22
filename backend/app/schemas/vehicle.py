from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

class VehicleBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=50, example="Toyota")
    model: str = Field(..., min_length=1, max_length=50, example="Camry")
    category: str = Field(..., min_length=1, max_length=50, example="Sedan")
    price: float = Field(..., gt=0, example=25000.0)
    quantity: int = Field(0, ge=0, example=5)

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class VehicleRestock(BaseModel):
    quantity_to_add: int = Field(..., gt=0, example=5)
