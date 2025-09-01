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

const AlbumsList: React.FC = () => {
    const navigate = useNavigate();
    const { albums, loading } = useAppSelector((state) => state.albums);

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
                Albums
            </Typography>
            <Grid container spacing={3}>
                {albums.map((album) => (
                    <Grid xs={12} sm={6} md={4} key={album.id}>
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
                            onClick={() => navigate(`/albums/${album.id}`)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={album.cover_url ? `http://localhost:8001${album.cover_url}` : '/media/covers/placeholder.jpg'}
                                alt={album.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
                                    {album.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#bfc0e0' }}>
                                    {album.tracks.length} tracks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AlbumsList; 