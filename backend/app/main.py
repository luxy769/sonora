from fastapi import FastAPI, Depends, HTTPException, Form, Path
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from .models import User, Track, Album, Playlist, Like
from .auth import hash_password, verify_password, create_token, decode_token
import os
import shutil
from fastapi import UploadFile, File
from fastapi.responses import StreamingResponse, FileResponse
import mimetypes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
init_db()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MEDIA_FOLDER = "media"
ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"]

# Create media folder if it doesn't exist
os.makedirs(MEDIA_FOLDER, exist_ok=True)

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

@app.post("/upload")
def upload_track(
    token: str = Form(...),
    title: str = Form(...),
    artist: str = Form(...),
    file: UploadFile = File(...),
    cover: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    try:
        user_id = decode_token(token)
        # Validate file type
        content_type = file.content_type
        if content_type not in ALLOWED_AUDIO_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only audio files are allowed.")
        # Create unique filename for audio
        filename = f"{MEDIA_FOLDER}/{file.filename}"
        # Save audio file
        try:
            with open(filename, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
        # Save cover if provided
        cover_path = None
        if cover:
            covers_folder = os.path.join(MEDIA_FOLDER, "covers")
            os.makedirs(covers_folder, exist_ok=True)
            cover_ext = os.path.splitext(cover.filename)[1]
            cover_filename = f"cover_{title}_{artist}_{file.filename}{cover_ext}"
            cover_path = os.path.join(covers_folder, cover_filename)
            try:
                with open(cover_path, "wb") as buffer:
                    shutil.copyfileobj(cover.file, buffer)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error saving cover: {str(e)}")
        track = Track(title=title, artist=artist, file_path=filename, owner_id=user_id, cover_path=cover_path)
        db.add(track)
        db.commit()
        return {"msg": "uploaded", "track_id": track.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/track/{track_id}")
def stream_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track or not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Track not found")
    
    def iterfile():
        with open(track.file_path, mode="rb") as f:
            yield from f
    return StreamingResponse(iterfile(), media_type="audio/mpeg")

@app.get("/cover/{track_id}")
def get_cover(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track or not track.cover_path or not os.path.exists(track.cover_path):
        # Можно вернуть заглушку
        placeholder = os.path.join(MEDIA_FOLDER, "covers", "placeholder.jpg")
        if os.path.exists(placeholder):
            return FileResponse(placeholder, media_type="image/jpeg")
        raise HTTPException(status_code=404, detail="Cover not found")
    mime = mimetypes.guess_type(track.cover_path)[0] or "image/jpeg"
    return FileResponse(track.cover_path, media_type=mime)

@app.get("/tracks")
def get_tracks(db: Session = Depends(get_db)):
    tracks = db.query(Track).all()
    return [
        {
            "id": track.id,
            "title": track.title,
            "artist": track.artist,
            "owner_id": track.owner_id,
            "cover_url": f"/cover/{track.id}" if track.cover_path else None
        }
        for track in tracks
    ]

@app.post("/albums/create")
def create_album(token: str = Form(...), title: str = Form(...), cover: UploadFile = File(None), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    cover_path = None
    if cover:
        covers_folder = os.path.join(MEDIA_FOLDER, "covers")
        os.makedirs(covers_folder, exist_ok=True)
        cover_ext = os.path.splitext(cover.filename)[1]
        cover_filename = f"album_cover_{title}_{user_id}{cover_ext}"
        cover_path = os.path.join(covers_folder, cover_filename)
        with open(cover_path, "wb") as buffer:
            shutil.copyfileobj(cover.file, buffer)
    album = Album(title=title, cover_path=cover_path, owner_id=user_id)
    db.add(album)
    db.commit()
    return {"msg": "album created", "album_id": album.id}

@app.get("/albums")
def get_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).all()
    return [
        {
            "id": album.id,
            "title": album.title,
            "cover_url": f"/album_cover/{album.id}" if album.cover_path else None,
            "tracks": [
                {"id": t.id, "title": t.title, "artist": t.artist, "cover_url": f"/cover/{t.id}" if t.cover_path else None}
                for t in album.tracks
            ]
        }
        for album in albums
    ]

@app.get("/album_cover/{album_id}")
def get_album_cover(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album or not album.cover_path or not os.path.exists(album.cover_path):
        placeholder = os.path.join(MEDIA_FOLDER, "covers", "placeholder.jpg")
        if os.path.exists(placeholder):
            return FileResponse(placeholder, media_type="image/jpeg")
        raise HTTPException(status_code=404, detail="Cover not found")
    mime = mimetypes.guess_type(album.cover_path)[0] or "image/jpeg"
    return FileResponse(album.cover_path, media_type=mime)

@app.post("/playlists/create")
def create_playlist(token: str = Form(...), title: str = Form(...), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    playlist = Playlist(title=title, owner_id=user_id)
    db.add(playlist)
    db.commit()
    return {"msg": "playlist created", "playlist_id": playlist.id}

@app.post("/playlists/{playlist_id}/add_track")
def add_track_to_playlist(
    playlist_id: int = Path(...),
    token: str = Form(...),
    track_id: int = Form(...),
    db: Session = Depends(get_db)
):
    user_id = decode_token(token)
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.owner_id == user_id).first()
    track = db.query(Track).filter(Track.id == track_id).first()
    if not playlist or not track:
        raise HTTPException(status_code=404, detail="Playlist or track not found")
    playlist.tracks.append(track)
    db.commit()
    return {"msg": "track added to playlist"}

@app.get("/playlists")
def get_playlists(db: Session = Depends(get_db)):
    playlists = db.query(Playlist).all()
    return [
        {
            "id": playlist.id,
            "title": playlist.title,
            "tracks": [
                {"id": t.id, "title": t.title, "artist": t.artist, "cover_url": f"/cover/{t.id}" if t.cover_path else None}
                for t in playlist.tracks
            ]
        }
        for playlist in playlists
    ]

@app.post("/tracks/{track_id}/like")
def like_track(
    track_id: int = Path(...),
    token: str = Form(...),
    db: Session = Depends(get_db)
):
    user_id = decode_token(token)
    like = db.query(Like).filter(Like.user_id == user_id, Like.track_id == track_id).first()
    if like:
        raise HTTPException(status_code=400, detail="Already liked")
    like = Like(user_id=user_id, track_id=track_id)
    db.add(like)
    db.commit()
    return {"msg": "liked"}

@app.post("/tracks/{track_id}/unlike")
def unlike_track(
    track_id: int = Path(...),
    token: str = Form(...),
    db: Session = Depends(get_db)
):
    user_id = decode_token(token)
    like = db.query(Like).filter(Like.user_id == user_id, Like.track_id == track_id).first()
    if not like:
        raise HTTPException(status_code=400, detail="Not liked yet")
    db.delete(like)
    db.commit()
    return {"msg": "unliked"}

@app.get("/liked_tracks")
def get_liked_tracks(token: str, db: Session = Depends(get_db)):
    user_id = decode_token(token)
    likes = db.query(Like).filter(Like.user_id == user_id).all()
    return [
        {
            "id": like.track.id,
            "title": like.track.title,
            "artist": like.track.artist,
            "cover_url": f"/cover/{like.track.id}" if like.track.cover_path else None
        }
        for like in likes
    ]

