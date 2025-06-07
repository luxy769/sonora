from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from passlib.hash import bcrypt
from datetime import datetime, timedelta

SECRET_KEY = "SUPERSECRET"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)

def create_token(user_id: int):
    expire = datetime.utcnow() + timedelta(hours=1)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

