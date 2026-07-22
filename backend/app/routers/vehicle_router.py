from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user, get_current_admin_user
from app.models.user import User
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    VehicleRestock,
)
from app.services.vehicle_service import VehicleService

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

# Step 8: Search API (Declared before /{id})
@router.get("/search", response_model=List[VehicleResponse])
def search_vehicles(
    make: Optional[str] = Query(None, description="Make of vehicle"),
    model: Optional[str] = Query(None, description="Model of vehicle"),
    category: Optional[str] = Query(None, description="Category of vehicle"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.search_vehicles(
        db=db,
        make=make,
        model=model,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )

# Step 7: List Vehicles
@router.get("", response_model=List[VehicleResponse])
def list_vehicles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.get_vehicles(db=db, skip=skip, limit=limit)

# Step 7: Add Vehicle
@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.create_vehicle(db=db, vehicle_in=vehicle_in)

# Get vehicle by ID
@router.get("/{id}", response_model=VehicleResponse)
def get_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.get_vehicle_by_id(db=db, vehicle_id=id)

# Step 7: Update Vehicle
@router.put("/{id}", response_model=VehicleResponse)
def update_vehicle(
    id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.update_vehicle(db=db, vehicle_id=id, vehicle_in=vehicle_in)

# Step 7: Delete Vehicle (Admin only)
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    VehicleService.delete_vehicle(db=db, vehicle_id=id)
    return None

# Step 9: Purchase API
@router.post("/{id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VehicleService.purchase_vehicle(db=db, vehicle_id=id)

# Step 10: Restock API (Admin only)
@router.post("/{id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    id: int,
    restock_in: VehicleRestock,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    return VehicleService.restock_vehicle(
        db=db, vehicle_id=id, quantity_to_add=restock_in.quantity_to_add
    )
