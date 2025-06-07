import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, Track } from '../../types';

const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    progress: 0,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<Track>) => {
            state.currentTrack = action.payload;
            state.isPlaying = true;
            state.progress = 0;
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
    },
});

export const { setTrack, play, pause, setVolume, setProgress } = playerSlice.actions;
export default playerSlice.reducer; 