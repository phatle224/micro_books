import pytest
from datetime import timedelta
from jose import jwt
from app.auth import hash_password, verify_password, create_access_token, ALGORITHM, JWT_SECRET

def test_password_hashing():
    """Kiểm tra chức năng băm mật khẩu và xác thực mật khẩu"""
    password = "secret_password"
    hashed = hash_password(password)
    
    # Mật khẩu sau khi băm phải khác mật khẩu gốc
    assert hashed != password
    # Kiểm tra xác thực đúng mật khẩu
    assert verify_password(password, hashed) is True
    # Kiểm tra xác thực sai mật khẩu
    assert verify_password("wrong_password", hashed) is False

def test_create_access_token():
    """Kiểm tra chức năng tạo JWT Token"""
    data = {"sub": "user123", "role": "admin"}
    token = create_access_token(data)
    assert isinstance(token, str) # Token phải là một chuỗi ký tự
    
    # Giải mã (Decode) và kiểm tra nội dung bên trong token
    payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "user123"
    assert payload["role"] == "admin"
    assert "exp" in payload # Token phải có thời gian hết hạn

def test_token_expiration():
    """Kiểm tra tính hợp lệ của token ngay sau khi tạo (trước khi hết hạn)"""
    data = {"sub": "test_user"}
    expires_delta = timedelta(seconds=1)
    token = create_access_token(data, expires_delta=expires_delta)
    
    # Token phải vẫn còn hiệu lực ngay lập tức
    payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == "test_user"
