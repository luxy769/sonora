import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import { MusicNote, PlaylistPlay, Album } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchTracks } from './store/slices/trackSlice';
import { fetchAlbums } from './store/slices/albumsSlice';
import { fetchPlaylists } from './store/slices/playlistsSlice';
import TrackList from './components/TrackList';
import Auth from './components/Auth';
import Player from './components/Player';
import PlaylistsList from './components/PlaylistsList';
import AlbumsList from './components/AlbumsList';
import PlaylistView from './components/PlaylistView';
import AlbumView from './components/AlbumView';

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        void dispatch(fetchTracks());
        void dispatch(fetchAlbums());
        if (token) {
            void dispatch(fetchPlaylists());
        }
    }, [dispatch, token]);

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1b4b 0%, #2a2d6e 100%)' }}>
            <Router>
                <AppBar position="static" sx={{ background: 'rgba(40,44,80,0.60)', backdropFilter: 'blur(12px)' }}>
                    <Toolbar>
                        <IconButton
                            component={Link}
                            to="/"
                            sx={{ color: '#fff', mr: 2 }}
                        >
                            <MusicNote />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                            Sonora
                        </Typography>
                        <Button
                            component={Link}
                            to="/"
                            color="inherit"
                            startIcon={<MusicNote />}
                            sx={{ mr: 2 }}
                        >
                            Tracks
                        </Button>
                        <Button
                            component={Link}
                            to="/playlists"
                            color="inherit"
                            startIcon={<PlaylistPlay />}
                            sx={{ mr: 2 }}
                        >
                            Playlists
                        </Button>
                        <Button
                            component={Link}
                            to="/albums"
                            color="inherit"
                            startIcon={<Album />}
                            sx={{ mr: 2 }}
                        >
                            Albums
                        </Button>
                        {!token && (
                            <Button
                                component={Link}
                                to="/login"
                                color="inherit"
                                variant="outlined"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        background: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                <Container component="main" sx={{
                    flex: 1,
                    py: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}>
                    <Box sx={{
                        width: '100%',
                        maxWidth: 1200,
                        background: 'rgba(255,255,255,0.10)',
                        borderRadius: 6,
                        boxShadow: '0 8px 32px 0 rgba(34,36,70,0.10)',
                        backdropFilter: 'blur(8px)',
                        p: 4,
                    }}>
                        <Routes>
                            <Route path="/" element={<TrackList />} />
                            <Route path="/playlists" element={<PlaylistsList />} />
                            <Route path="/playlists/:id" element={<PlaylistView />} />
                            <Route path="/albums" element={<AlbumsList />} />
                            <Route path="/albums/:id" element={<AlbumView />} />
                            <Route path="/login" element={<Auth />} />
                        </Routes>
                    </Box>
                </Container>

                <Player />
            </Router>
        </Box>
    );
};

export default App;
