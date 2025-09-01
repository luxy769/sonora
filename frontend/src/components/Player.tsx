import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Slider,
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    SkipNext,
    SkipPrevious,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { API_BASE_URL } from '../config';

function Player() {
    const { currentTrack } = useAppSelector((state) => state.track);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(false);
            setCurrentTime(0);
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentTrack]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (audioRef.current && typeof newValue === 'number') {
            audioRef.current.currentTime = newValue;
            setCurrentTime(newValue);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                zIndex: 1000,
                background: 'rgba(40,44,80,0.85)',
                boxShadow: '0 -4px 32px 0 rgba(34,36,70,0.15)',
                borderRadius: '24px 24px 0 0',
                backdropFilter: 'blur(12px)',
            }}
        >
            <audio
                ref={audioRef}
                src={`${API_BASE_URL}/track/${currentTrack.id}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ flexGrow: 1, color: '#fff', fontWeight: 500 }}>
                    {currentTrack.title} - {currentTrack.artist}
                </Typography>
                <IconButton sx={{ color: '#bfc0e0', mx: 1 }}>
                    <SkipPrevious />
                </IconButton>
                <IconButton onClick={handlePlayPause} sx={{
                    color: isPlaying ? '#fff' : '#6e6cd8',
                    background: isPlaying ? 'rgba(110,108,216,0.25)' : 'rgba(255,255,255,0.10)',
                    borderRadius: 2,
                    mx: 1,
                    '&:hover': {
                        background: 'rgba(110,108,216,0.35)',
                        color: '#fff',
                    },
                }}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton sx={{ color: '#bfc0e0', mx: 1 }}>
                    <SkipNext />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1, color: '#bfc0e0' }}>
                    {formatTime(currentTime)}
                </Typography>
                <Slider
                    value={currentTime}
                    max={duration}
                    onChange={handleSliderChange}
                    sx={{
                        flexGrow: 1,
                        color: '#6e6cd8',
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#fff',
                        },
                        '& .MuiSlider-rail': {
                            backgroundColor: '#bfc0e0',
                        },
                    }}
                />
                <Typography variant="body2" sx={{ ml: 1, color: '#bfc0e0' }}>
                    {formatTime(duration)}
                </Typography>
            </Box>
        </Paper>
    );
}

export default Player; 