import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1DB954', // Spotify green
        },
        background: {
            default: '#121212',
            paper: '#181818',
        },
    },
});

export default theme; 