import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { uploadTrack } from '../store/slices/trackSlice';

function UploadTrack() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.track);
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCover(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('artist', artist);
            if (cover) formData.append('cover', cover);
            dispatch(uploadTrack(formData));
            setFile(null);
            setCover(null);
            setTitle('');
            setArtist('');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Upload Track
            </Typography>
            <input
                accept="audio/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" sx={{ mb: 2 }}>
                    Select File
                </Button>
            </label>
            {file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Selected file: {file.name}
                </Typography>
            )}
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-cover"
                type="file"
                onChange={handleCoverChange}
            />
            <label htmlFor="raised-button-cover">
                <Button variant="outlined" component="span" sx={{ mb: 2, ml: 2 }}>
                    Select Cover
                </Button>
            </label>
            {cover && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Selected cover: {cover.name}
                </Typography>
            )}
            <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                margin="normal"
                required
            />
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                disabled={!file || !title || !artist || loading}
                sx={{ mt: 2 }}
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Upload'
                )}
            </Button>
        </Box>
    );
}

export default UploadTrack; 