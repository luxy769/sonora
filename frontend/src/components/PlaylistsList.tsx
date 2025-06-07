import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
} from '@mui/material';
import { useAppSelector } from '../store/hooks';

const PlaylistsList: React.FC = () => {
    const navigate = useNavigate();
    const { playlists, loading } = useAppSelector((state) => state.playlists);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 500 }}>
                Playlists
            </Typography>
            <Grid container spacing={3}>
                {playlists.map((playlist) => (
                    <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                        <Card
                            sx={{
                                background: 'rgba(40,44,80,0.60)',
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 32px 0 rgba(34,36,70,0.15)',
                                },
                            }}
                            onClick={() => navigate(`/playlists/${playlist.id}`)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={playlist.tracks[0]?.cover_url ? `http://127.0.0.1:8001${playlist.tracks[0].cover_url}` : '/media/covers/placeholder.jpg'}
                                alt={playlist.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
                                    {playlist.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#bfc0e0' }}>
                                    {playlist.tracks.length} tracks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PlaylistsList; 