import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    CircularProgress,
    Box,
    TextField,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import { PlayArrow, Favorite, FavoriteBorder, MoreVert } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTracks, setTrack } from '../store/slices/trackSlice';
import { likeTrack, unlikeTrack, fetchLikedTracks } from '../store/slices/likesSlice';
import { fetchPlaylists, addTrackToPlaylist, createPlaylist } from '../store/slices/playlistsSlice';
import type { Track, Playlist } from '../types/index';

const TrackList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tracks, loading, error } = useAppSelector((state) => state.track);
    const { likedTrackIds } = useAppSelector((state) => state.likes);
    const { token } = useAppSelector((state) => state.auth);
    const { playlists } = useAppSelector((state) => state.playlists);
    const [search, setSearch] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [playlistMenuAnchorEl, setPlaylistMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        void dispatch(fetchTracks());
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            void dispatch(fetchLikedTracks());
            void dispatch(fetchPlaylists());
        }
    }, [dispatch, token]);

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

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, trackId: number) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedTrackId(trackId);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setSelectedTrackId(null);
    };

    const handleOpenPlaylistMenu = (event: React.MouseEvent<HTMLElement>) => {
        setPlaylistMenuAnchorEl(event.currentTarget);
    };

    const handleClosePlaylistMenu = () => {
        setPlaylistMenuAnchorEl(null);
    };

    const handleAddToPlaylist = (playlistId: number) => {
        if (selectedTrackId) {
            dispatch(addTrackToPlaylist({ playlistId, trackId: selectedTrackId }));
        }
        handleClosePlaylistMenu();
        handleCloseMenu();
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistTitle.trim()) return;
        setCreating(true);
        await dispatch(createPlaylist(newPlaylistTitle));
        setCreating(false);
        const updated = playlists.find(p => p.title === newPlaylistTitle.trim());
        if (updated && selectedTrackId) {
            dispatch(addTrackToPlaylist({ playlistId: updated.id, trackId: selectedTrackId }));
        }
        setNewPlaylistTitle('');
        handleClosePlaylistMenu();
        handleCloseMenu();
    };

    const filteredTracks = tracks.filter((track) => {
        const q = search.toLowerCase();
        return (
            track.title.toLowerCase().includes(q) ||
            track.artist.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" mt={4}>
                {error}
            </Typography>
        );
    }

    return (
        <Box>
            <TextField
                fullWidth
                placeholder="Search by title or artist..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 3, input: { color: '#fff' }, background: 'rgba(40,44,80,0.60)', borderRadius: 2 }}
                InputProps={{ style: { color: '#fff' } }}
            />
            <List sx={{
                background: 'rgba(40,44,80,0.60)',
                borderRadius: 4,
                boxShadow: '0 4px 24px 0 rgba(34,36,70,0.10)',
                p: 2,
            }}>
                {filteredTracks.map((track) => (
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
                            primary={<span style={{ color: '#fff', fontWeight: 500 }}>{track.title}</span>}
                            secondary={<span style={{ color: '#bfc0e0' }}>{track.artist}</span>}
                        />
                        <ListItemSecondaryAction>
                            {/* <IconButton
                                edge="end"
                                aria-label="like"
                                onClick={() => handleLike(track.id)}
                                sx={{ color: likedTrackIds.includes(track.id) ? '#e74c3c' : '#bfc0e0', mr: 1 }}
                                disabled={!token}
                            >
                                {likedTrackIds.includes(track.id) ? <Favorite /> : <FavoriteBorder />}
                            </IconButton> */}
                            <IconButton
                                edge="end"
                                aria-label="play"
                                onClick={() => handlePlay({ ...(track as any), file_path: (track as any).file_path || '', owner_id: (track as any).owner_id || 0 })}
                                sx={{ color: '#6e6cd8', background: 'rgba(255,255,255,0.10)', boxShadow: '0 2px 8px 0 rgba(34,36,70,0.10)', borderRadius: 2, '&:hover': { background: 'rgba(110,108,216,0.25)', color: '#fff' } }}
                            >
                                <PlayArrow />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="more"
                                onClick={(e) => handleOpenMenu(e, track.id)}
                                sx={{ color: '#6e6cd8', ml: 1 }}
                                disabled={!token}
                            >
                                <MoreVert />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleOpenPlaylistMenu}>Добавить в плейлист</MenuItem>
            </Menu>
            <Menu
                anchorEl={playlistMenuAnchorEl}
                open={Boolean(playlistMenuAnchorEl)}
                onClose={handleClosePlaylistMenu}
            >
                <Box px={2} py={1}>
                    <input
                        type="text"
                        placeholder="Новый плейлист"
                        value={newPlaylistTitle}
                        onChange={e => setNewPlaylistTitle(e.target.value)}
                        style={{ width: 180, marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                        disabled={creating}
                    />
                    <button
                        onClick={handleCreatePlaylist}
                        disabled={creating || !newPlaylistTitle.trim()}
                        style={{ padding: '4px 10px', borderRadius: 4, background: '#6e6cd8', color: '#fff', border: 'none', fontWeight: 500 }}
                    >
                        {creating ? '...' : 'Создать'}
                    </button>
                </Box>
                {playlists.map((playlist: Playlist) => (
                    <MenuItem key={playlist.id} onClick={() => handleAddToPlaylist(playlist.id)}>
                        {playlist.title}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default TrackList; 