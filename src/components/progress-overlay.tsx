import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function ProgressOverlay() {
    return (
        <Box
            sx={{
                position: 'absolute',
                height: '100%',
                top: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'all',
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default ProgressOverlay;
