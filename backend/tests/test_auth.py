import pytest
from fastapi import status

def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "speedracer",
            "email": "speed@example.com",
            "password": "fastpassword123",
            "role": "user"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["username"] == "speedracer"
    assert data["email"] == "speed@example.com"
    assert data["role"] == "user"
    assert "id" in data

def test_register_duplicate_username(client):
    user_payload = {
        "username": "duplicate_user",
        "email": "user1@example.com",
        "password": "password123"
    }
    res1 = client.post("/api/auth/register", json=user_payload)
    assert res1.status_code == status.HTTP_201_CREATED

    user_payload["email"] = "user2@example.com"
    res2 = client.post("/api/auth/register", json=user_payload)
    assert res2.status_code == status.HTTP_400_BAD_REQUEST
    assert "Username already registered" in res2.json()["detail"]

def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "correctpassword"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "username": "loginuser",
            "password": "correctpassword"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "loginuser"

def test_login_invalid_credentials(client):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "nonexistent",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
