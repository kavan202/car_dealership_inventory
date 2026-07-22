import pytest
from fastapi import status
from app.auth import create_access_token
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle

@pytest.fixture
def normal_user_headers(db_session):
    user = User(
        username="normaluser",
        email="normal@example.com",
        hashed_password="hashed_password",
        role=UserRole.USER.value
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_user_headers(db_session):
    admin = User(
        username="adminboss",
        email="adminboss@example.com",
        hashed_password="hashed_password",
        role=UserRole.ADMIN.value
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    token = create_access_token(data={"sub": admin.username, "role": admin.role})
    return {"Authorization": f"Bearer {token}"}

# Test CRUD: Create Vehicle
def test_create_vehicle(client, normal_user_headers):
    payload = {
        "make": "Tesla",
        "model": "Model 3",
        "category": "Electric",
        "price": 42000.0,
        "quantity": 5
    }
    res = client.post("/api/vehicles", json=payload, headers=normal_user_headers)
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data["make"] == "Tesla"
    assert data["model"] == "Model 3"
    assert data["quantity"] == 5
    assert "id" in data

# Test CRUD: List Vehicles
def test_list_vehicles(client, normal_user_headers, db_session):
    v1 = Vehicle(make="Ford", model="Mustang", category="Sports", price=55000.0, quantity=2)
    v2 = Vehicle(make="BMW", model="M3", category="Sports", price=75000.0, quantity=1)
    db_session.add_all([v1, v2])
    db_session.commit()

    res = client.get("/api/vehicles", headers=normal_user_headers)
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert len(data) >= 2

# Test CRUD: Update Vehicle
def test_update_vehicle(client, normal_user_headers, db_session):
    v = Vehicle(make="Honda", model="Civic", category="Sedan", price=22000.0, quantity=3)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    update_payload = {"price": 24000.0, "quantity": 4}
    res = client.put(f"/api/vehicles/{v.id}", json=update_payload, headers=normal_user_headers)
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["price"] == 24000.0
    assert data["quantity"] == 4

# Test CRUD & RBAC: Delete Vehicle
def test_delete_vehicle_forbidden_for_normal_user(client, normal_user_headers, db_session):
    v = Vehicle(make="Audi", model="A4", category="Luxury", price=40000.0, quantity=1)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    res = client.delete(f"/api/vehicles/{v.id}", headers=normal_user_headers)
    assert res.status_code == status.HTTP_403_FORBIDDEN

def test_delete_vehicle_success_for_admin(client, admin_user_headers, db_session):
    v = Vehicle(make="Audi", model="A4", category="Luxury", price=40000.0, quantity=1)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    res = client.delete(f"/api/vehicles/{v.id}", headers=admin_user_headers)
    assert res.status_code == status.HTTP_204_NO_CONTENT

# Test Search API
def test_search_vehicles_filtering(client, normal_user_headers, db_session):
    v1 = Vehicle(make="Toyota", model="Corolla", category="Sedan", price=20000.0, quantity=10)
    v2 = Vehicle(make="Toyota", model="RAV4", category="SUV", price=32000.0, quantity=5)
    v3 = Vehicle(make="Porsche", model="911", category="Sports", price=120000.0, quantity=1)
    db_session.add_all([v1, v2, v3])
    db_session.commit()

    # Search by make
    res = client.get("/api/vehicles/search?make=Toyota", headers=normal_user_headers)
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert len(data) == 2

    # Multi-filter search (category & max_price)
    res2 = client.get("/api/vehicles/search?category=SUV&max_price=35000", headers=normal_user_headers)
    assert res2.status_code == status.HTTP_200_OK
    data2 = res2.json()
    assert len(data2) == 1
    assert data2[0]["model"] == "RAV4"

# Test Purchase API
def test_purchase_vehicle_success(client, normal_user_headers, db_session):
    v = Vehicle(make="Chevrolet", model="Tahoe", category="SUV", price=60000.0, quantity=2)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    res = client.post(f"/api/vehicles/{v.id}/purchase", headers=normal_user_headers)
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["quantity"] == 1

def test_purchase_vehicle_out_of_stock(client, normal_user_headers, db_session):
    v = Vehicle(make="Nissan", model="Leaf", category="Electric", price=28000.0, quantity=0)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    res = client.post(f"/api/vehicles/{v.id}/purchase", headers=normal_user_headers)
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "out of stock" in res.json()["detail"]

# Test Restock API
def test_restock_vehicle_admin_only(client, normal_user_headers, admin_user_headers, db_session):
    v = Vehicle(make="Hyundai", model="Elantra", category="Sedan", price=21000.0, quantity=1)
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)

    # Normal user should be rejected
    res_user = client.post(f"/api/vehicles/{v.id}/restock", json={"quantity_to_add": 5}, headers=normal_user_headers)
    assert res_user.status_code == status.HTTP_403_FORBIDDEN

    # Admin user should succeed
    res_admin = client.post(f"/api/vehicles/{v.id}/restock", json={"quantity_to_add": 5}, headers=admin_user_headers)
    assert res_admin.status_code == status.HTTP_200_OK
    assert res_admin.json()["quantity"] == 6
