from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status, Depends

from .auth import create_access_token, get_current_user, hash_password, verify_password
from .models import UserCreate, UserLogin, UserPublic

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def get_db():
    import app.main as main
    return main.db


def public_user(user: dict) -> dict:
    return {
        "_id": user.get("_id"),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "user"),
    }


@router.post("/register", status_code=201)
async def register(user: UserCreate):
    db = get_db()
    email = user.email.strip().lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "name": user.name.strip(),
        "email": email,
        "password_hash": hash_password(user.password),
        "role": "user",
        "created_at": now,
        "updated_at": now,
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)

    token = create_access_token({"sub": user_doc["_id"], "role": user_doc["role"]})
    return {
        "user": UserPublic.model_validate(public_user(user_doc)).model_dump(by_alias=True),
        "access_token": token,
        "token_type": "bearer",
    }


@router.post("/login")
async def login(credentials: UserLogin):
    db = get_db()
    email = credentials.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user["_id"] = str(user["_id"])
    token = create_access_token({"sub": user["_id"], "role": user.get("role", "user")})
    return {
        "user": UserPublic.model_validate(public_user(user)).model_dump(by_alias=True),
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return UserPublic.model_validate(public_user(current_user)).model_dump(by_alias=True)
