import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { uploadTrack } from '../store/slices/trackSlice';

const UploadTrack: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const { loading, error } = useAppSelector((state) => state.track);
    
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setFile(files[0]);
        }
    };

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setCover(files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title || !artist) return;

        try {
            await dispatch(uploadTrack({ file, title, artist, cover }));
            setSuccess(true);
            setTitle('');
            setArtist('');
            setFile(null);
            setCover(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    if (!token) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="h6" color="error">
                    Please login to upload tracks
                </Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{
            p: 3,
            maxWidth: 600,
            mx: 'auto',
            background: 'rgba(40,44,80,0.85)',
            boxShadow: '0 8px 32px 0 rgba(34,36,70,0.15)',
            borderRadius: 6,
            backdropFilter: 'blur(8px)',
        }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#fff', fontWeight: 500 }}>
                Upload New Track
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Track uploaded successfully!
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Track Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    required
                    sx={{ 
                        input: { color: '#fff' }, 
                        label: { color: '#bfc0e0' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    margin="normal"
                    required
                    sx={{ 
                        input: { color: '#fff' }, 
                        label: { color: '#bfc0e0' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        }
                    }}
                />

                <Box sx={{ mt: 2, mb: 2 }}>
                    <input
                        accept="audio/*"
                        style={{ display: 'none' }}
                        id="audio-file"
                        type="file"
                        onChange={handleFileChange}
                        required
                    />
                    <label htmlFor="audio-file">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    background: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            {file ? file.name : 'Choose Audio File'}
                        </Button>
                    </label>
                </Box>

                <Box sx={{ mt: 2, mb: 2 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="cover-file"
                        type="file"
                        onChange={handleCoverChange}
                    />
                    <label htmlFor="cover-file">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    background: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            {cover ? cover.name : 'Choose Cover Image (Optional)'}
                        </Button>
                    </label>
                </Box>

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading || !file || !title || !artist}
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
                        '&:disabled': {
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)',
                        }
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Upload Track'
                    )}
                </Button>
            </Box>
        </Paper>
    );
};

export default UploadTrack; 