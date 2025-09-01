import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }) => {
        const response = await authAPI.login(credentials.username, credentials.password);
        const token = response.access_token;
        localStorage.setItem('token', token);
        return token;
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (credentials: { username: string; password: string }) => {
        const response = await authAPI.register(credentials.username, credentials.password);
        // После регистрации автоматически логинимся
        const loginResponse = await authAPI.login(credentials.username, credentials.password);
        const token = loginResponse.access_token;
        localStorage.setItem('token', token);
        return token;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 