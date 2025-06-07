import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Track {
    id: number;
    title: string;
    artist: string;
    owner_id: number;
    cover_url?: string | null;
}

interface TrackState {
    tracks: Track[];
    currentTrack: Track | null;
    loading: boolean;
    error: string | null;
}

const initialState: TrackState = {
    tracks: [],
    currentTrack: null,
    loading: false,
    error: null,
};

export const fetchTracks = createAsyncThunk('track/fetchTracks', async () => {
    const response = await api.get('/tracks');
    return response.data;
});

export const uploadTrack = createAsyncThunk(
    'track/uploadTrack',
    async (data: FormData, { dispatch }) => {
        await api.post('/upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // После загрузки обновляем список
        await dispatch(fetchTracks());
    }
);

const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTracks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTracks.fulfilled, (state, action) => {
                state.loading = false;
                state.tracks = action.payload;
            })
            .addCase(fetchTracks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tracks';
            })
            .addCase(uploadTrack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadTrack.fulfilled, (state) => {
                state.loading = false;
                // Не пушим вручную, fetchTracks обновит список
            })
            .addCase(uploadTrack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to upload track';
            });
    },
});

export const { setTrack } = trackSlice.actions;
export default trackSlice.reducer; 