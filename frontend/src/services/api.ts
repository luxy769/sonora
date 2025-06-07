import axios from 'axios';
import type { Track } from '../types';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await api.post('/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await api.post('/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export const tracksAPI = {
    getTracks: async () => {
        const response = await api.get('/tracks');
        return response.data;
    },

    uploadTrack: async (file: File, title: string, artist: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('token', localStorage.getItem('token') || '');
        
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getTrack: async (trackId: number) => {
        const response = await api.get(`/track/${trackId}`);
        return response.data;
    },
};

export const albumsAPI = {
    getAlbums: async () => {
        const response = await api.get('/albums');
        return response.data;
    },
};

export const playlistsAPI = {
    getPlaylists: async () => {
        const response = await api.get('/playlists');
        return response.data;
    },
    createPlaylist: async (title: string) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('token', localStorage.getItem('token') || '');
        const response = await api.post('/playlists/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    addTrackToPlaylist: async (playlistId: number, trackId: number) => {
        const formData = new FormData();
        formData.append('track_id', trackId.toString());
        formData.append('token', localStorage.getItem('token') || '');
        const response = await api.post(`/playlists/${playlistId}/add_track`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export const likesAPI = {
    likeTrack: async (trackId: number) => {
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token') || '');
        formData.append('track_id', trackId.toString());
        const response = await api.post(`/tracks/${trackId}/like`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    unlikeTrack: async (trackId: number) => {
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token') || '');
        formData.append('track_id', trackId.toString());
        const response = await api.post(`/tracks/${trackId}/unlike`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    getLikedTracks: async () => {
        const token = localStorage.getItem('token') || '';
        const response = await api.get(`/liked_tracks?token=${token}`);
        return response.data;
    },
};

export default api; 