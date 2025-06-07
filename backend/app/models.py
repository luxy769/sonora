from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from .base import Base

# Association table for tracks in playlists
playlist_tracks = Table(
    'playlist_tracks',
    Base.metadata,
    Column('playlist_id', Integer, ForeignKey('playlists.id')),
    Column('track_id', Integer, ForeignKey('tracks.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    tracks = relationship("Track", back_populates="owner")
    albums = relationship("Album", back_populates="owner")
    playlists = relationship("Playlist", back_populates="owner")
    likes = relationship("Like", back_populates="user")

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    file_path = Column(String)
    cover_path = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    owner = relationship("User", back_populates="tracks")
    album = relationship("Album", back_populates="tracks")
    playlists = relationship("Playlist", secondary=playlist_tracks, back_populates="tracks")
    likes = relationship("Like", back_populates="track")

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    cover_path = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="albums")
    tracks = relationship("Track", back_populates="album")

class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="playlists")
    tracks = relationship("Track", secondary=playlist_tracks, back_populates="playlists")

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(Integer, ForeignKey("tracks.id"))

    user = relationship("User", back_populates="likes")
    track = relationship("Track", back_populates="likes")

