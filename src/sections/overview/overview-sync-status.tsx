import { Box, Button, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SYNC_START, SYNC_STATUS } from '@saga/indexing.saga';
import { getSyncIsStarting, getSyncStatus } from '@slice/indexing.slice';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';

export function OverviewSyncStatus() {
    const dispatch = useDispatch();
    const { deleted, status, processed, required, total } = useSelector(getSyncStatus);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState('');
    const isSyncStarting = useSelector(getSyncIsStarting);
    const [isSyncStarted, setIsSyncStarted] = useState(false);

    const getStatus = () => dispatch({ type: SYNC_STATUS });

    useEffect(() => {
        getStatus();
    }, []);

    useEffect(() => {
        setProgress((processed / total) * 100);
    }, [processed, total]);

    useEffect(() => {
        if (status) {
            setTitle('Syncing in progress');
        } else if (required) {
            setTitle('Orphaned products found');
        } else {
            setTitle('No orphaned products found');
        }
    }, [status, required]);

    useEffect(() => {
        let interval;
        if (status || isSyncStarted) {
            interval = setInterval(() => {
                getStatus();
            }, 5000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [status, isSyncStarting]);

    const runSync = () => {
        dispatch({ type: SYNC_START });
        setIsSyncStarted(true);
        getStatus();
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            {title}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack alignItems="center">
                    {status && (
                        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                            <CircularProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    backgroundColor: '#d1dfff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                }}
                                size={80}
                            />
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {deleted}
                            </Typography>
                        </Box>
                    )}
                    {!status && required && (
                        <Button
                            variant="contained"
                            color="info"
                            sx={{ borderRadius: '50%', padding: '17px 20px' }}
                            onClick={runSync}
                            disabled={status || isSyncStarting}
                        >
                            <SvgIcon>
                                <PlayIcon />
                            </SvgIcon>
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
