import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trackReducer from './slices/trackSlice';
import albumsReducer from './slices/albumsSlice';
import playlistsReducer from './slices/playlistsSlice';
import likesReducer from './slices/likesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        track: trackReducer,
        albums: albumsReducer,
        playlists: playlistsReducer,
        likes: likesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 