import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { albumsAPI } from '../../services/api';
import type { Album } from '../../types/index';

interface AlbumsState {
    albums: Album[];
    loading: boolean;
    error: string | null;
}

const initialState: AlbumsState = {
    albums: [],
    loading: false,
    error: null,
};

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async () => {
    const data = await albumsAPI.getAlbums();
    return data;
});

const albumsSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAlbums.fulfilled, (state, action) => {
                state.loading = false;
                state.albums = action.payload;
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch albums';
            });
    },
});

export default albumsSlice.reducer; 