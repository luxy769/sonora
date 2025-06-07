import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register } from '../store/slices/authSlice';

function Auth() {
    const dispatch = useAppDispatch();
    const { loading, error, token } = useAppSelector((state) => state.auth);
    const [tab, setTab] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tab === 0) {
            dispatch(login({ username, password }));
        } else {
            dispatch(register({ username, password }));
        }
    };

    return (
        <Paper sx={{
            p: 3,
            maxWidth: 400,
            mx: 'auto',
            background: 'rgba(40,44,80,0.85)',
            boxShadow: '0 8px 32px 0 rgba(34,36,70,0.15)',
            borderRadius: 6,
            backdropFilter: 'blur(8px)',
        }}>
            <Tabs value={tab} onChange={handleTabChange} centered
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    mb: 2,
                    '.Mui-selected': { color: '#6e6cd8 !important' },
                }}
            >
                <Tab label="Login" />
                <Tab label="Register" />
            </Tabs>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    required
                    sx={{ input: { color: '#fff' }, label: { color: '#bfc0e0' } }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    sx={{ input: { color: '#fff' }, label: { color: '#bfc0e0' } }}
                />
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        mt: 3,
                        background: 'linear-gradient(90deg, #6e6cd8 0%, #232946 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        letterSpacing: 1,
                        boxShadow: '0 4px 16px 0 rgba(34,36,70,0.10)',
                        borderRadius: 4,
                        '&:hover': {
                            background: 'linear-gradient(90deg, #232946 0%, #6e6cd8 100%)',
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : tab === 0 ? (
                        'Login'
                    ) : (
                        'Register'
                    )}
                </Button>
            </Box>
        </Paper>
    );
}

export default Auth; 