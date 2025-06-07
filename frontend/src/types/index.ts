export interface User {
    id: number;
    username: string;
}

export interface Track {
    id: number;
    title: string;
    artist: string;
    file_path: string;
    owner_id: number;
    cover_url?: string | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    progress: number;
}

export interface Album {
    id: number;
    title: string;
    cover_url?: string | null;
    tracks: Track[];
}

export interface Playlist {
    id: number;
    title: string;
    tracks: Track[];
} 