import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { playlistsAPI } from '../../services/api';
import type { Playlist } from '../../types/index';

interface PlaylistsState {
    playlists: Playlist[];
    loading: boolean;
    error: string | null;
}

const initialState: PlaylistsState = {
    playlists: [],
    loading: false,
    error: null,
};

export const fetchPlaylists = createAsyncThunk('playlists/fetchPlaylists', async () => {
    const data = await playlistsAPI.getPlaylists();
    return data;
});

export const createPlaylist = createAsyncThunk('playlists/createPlaylist', async (title: string, { dispatch }) => {
    await playlistsAPI.createPlaylist(title);
    await dispatch(fetchPlaylists());
});

export const addTrackToPlaylist = createAsyncThunk('playlists/addTrackToPlaylist', async ({playlistId, trackId}: {playlistId: number, trackId: number}, { dispatch }) => {
    await playlistsAPI.addTrackToPlaylist(playlistId, trackId);
    await dispatch(fetchPlaylists());
});

const playlistsSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch playlists';
            })
            .addCase(createPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlaylist.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create playlist';
            })
            .addCase(addTrackToPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTrackToPlaylist.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addTrackToPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add track to playlist';
            });
    },
});

export default playlistsSlice.reducer; 