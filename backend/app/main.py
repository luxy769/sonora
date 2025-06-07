from fastapi import FastAPI, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from .models import User
from .auth import hash_password, verify_password, create_token, decode_token

app = FastAPI()
init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=username, hashed_password=hash_password(password))
    db.add(new_user)
    db.commit()
    return {"msg": "registered"}

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.id)
    return {"access_token": token}



#download && return media
from fastapi import UploadFile, File
import shutil
from fastapi.responses import StreamingResponse
import os

MEDIA_FOLDER = "media"

@app.post("/upload")
def upload_track(token: str = Form(...), title: str = Form(...), artist: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    filename = f"{MEDIA_FOLDER}/{file.filename}"
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    from models import Track
    track = Track(title=title, artist=artist, file_path=filename, owner_id=user_id)
    db.add(track)
    db.commit()
    return {"msg": "uploaded", "track_id": track.id}

@app.get("/track/{track_id}")
def stream_track(track_id: int, db: Session = Depends(get_db)):
    from models import Track
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track or not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Track not found")
    
    def iterfile():
        with open(track.file_path, mode="rb") as f:
            yield from f
    return StreamingResponse(iterfile(), media_type="audio/mpeg")

