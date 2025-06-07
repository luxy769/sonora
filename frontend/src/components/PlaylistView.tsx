import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Avatar,
} from '@mui/material';
import { PlayArrow, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTrack } from '../store/slices/trackSlice';
import { likeTrack, unlikeTrack, fetchLikedTracks } from '../store/slices/likesSlice';
import type { Track } from '../types';

const PlaylistView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { playlists } = useAppSelector((state) => state.playlists);
    const { likedTrackIds } = useAppSelector((state) => state.likes);
    const { token } = useAppSelector((state) => state.auth);
    const playlist = playlists.find(p => p.id === Number(id));

    useEffect(() => {
        if (token) {
            void dispatch(fetchLikedTracks());
        }
    }, [dispatch, token]);

    if (!playlist) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    const handlePlay = (track: Track) => {
        dispatch(setTrack(track));
    };

    const handleLike = (trackId: number) => {
        if (!token) return;
        if (likedTrackIds.includes(trackId)) {
            dispatch(unlikeTrack(trackId));
        } else {
            dispatch(likeTrack(trackId));
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 500 }}>
                {playlist.title}
            </Typography>
            <List sx={{
                background: 'rgba(40,44,80,0.60)',
                borderRadius: 4,
                boxShadow: '0 4px 24px 0 rgba(34,36,70,0.10)',
                p: 2,
            }}>
                {playlist.tracks.map((track) => (
                    <ListItem key={track.id} divider sx={{
                        borderRadius: 3,
                        mb: 1,
                        transition: 'background 0.2s',
                        '&:hover': {
                            background: 'rgba(110,108,216,0.15)',
                        },
                    }}>
                        <Avatar
                            src={track.cover_url ? `http://127.0.0.1:8001${track.cover_url}` : '/media/covers/placeholder.jpg'}
                            alt={track.title}
                            sx={{ width: 56, height: 56, mr: 2, boxShadow: '0 2px 8px 0 rgba(34,36,70,0.10)' }}
                        />
                        <ListItemText
                            primary={track.title}
                            secondary={track.artist}
                            primaryTypographyProps={{ color: '#fff' }}
                            secondaryTypographyProps={{ color: '#bfc0e0' }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={() => handlePlay(track)}
                                sx={{ color: '#6e6cd8', mr: 1 }}
                            >
                                <PlayArrow />
                            </IconButton>
                            {token && (
                                <IconButton
                                    edge="end"
                                    onClick={() => handleLike(track.id)}
                                    sx={{ color: likedTrackIds.includes(track.id) ? '#ff4d4d' : '#bfc0e0' }}
                                >
                                    {likedTrackIds.includes(track.id) ? <Favorite /> : <FavoriteBorder />}
                                </IconButton>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default PlaylistView; 