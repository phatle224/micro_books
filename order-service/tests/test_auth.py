import pytest
from datetime import timedelta
from jose import jwt
from app.auth import hash_password, verify_password, create_access_token, ALGORITHM, JWT_SECRET

def test_password_hashing():
    password = "secret_password"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_create_access_token():
    data = {"sub": "user123", "role": "admin"}
    token = create_access_token(data)
    assert isinstance(token, str)
    
    # Decode and verify
    payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "user123"
    assert payload["role"] == "admin"
    assert "exp" in payload

def test_token_expiration():
    data = {"sub": "test_user"}
    expires_delta = timedelta(seconds=1)
    token = create_access_token(data, expires_delta=expires_delta)
    
    # Payload should still be valid immediately
    payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "test_user"
