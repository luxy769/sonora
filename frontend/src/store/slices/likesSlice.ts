import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { likesAPI } from '../../services/api';

interface LikesState {
    likedTrackIds: number[];
    loading: boolean;
    error: string | null;
}

const initialState: LikesState = {
    likedTrackIds: [],
    loading: false,
    error: null,
};

export const fetchLikedTracks = createAsyncThunk('likes/fetchLikedTracks', async () => {
    const data = await likesAPI.getLikedTracks();
    // data: [{id, ...}]
    return data.map((track: any) => track.id);
});

export const likeTrack = createAsyncThunk('likes/likeTrack', async (trackId: number, { dispatch }) => {
    await likesAPI.likeTrack(trackId);
    await dispatch(fetchLikedTracks());
});

export const unlikeTrack = createAsyncThunk('likes/unlikeTrack', async (trackId: number, { dispatch }) => {
    await likesAPI.unlikeTrack(trackId);
    await dispatch(fetchLikedTracks());
});

const likesSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikedTracks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLikedTracks.fulfilled, (state, action) => {
                state.loading = false;
                state.likedTrackIds = action.payload;
            })
            .addCase(fetchLikedTracks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch liked tracks';
            });
    },
});

export default likesSlice.reducer; 