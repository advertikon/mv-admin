import { Button, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import PlayPauseIcon from '@heroicons/react/24/solid/PlayPauseIcon';
import StopIcon from '@heroicons/react/24/solid/StopIcon';

type Props = {
    sx: any;
    start: () => void;
    stop: () => void;
    resume: () => void;
    isRunning: boolean;
    isStopped: boolean;
    isFinished: boolean;
};

export function IndexControls(props: Props) {
    const { sx, start, stop, resume, isRunning, isStopped, isFinished = true } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack alignItems="flex-start" direction="column" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            Controls
                        </Typography>
                    </Stack>
                    <Stack flexDirection="row" justifyContent="space-evenly" sx={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={start}
                            className={isRunning ? 'hidden' : ''}
                            title="Start"
                        >
                            <SvgIcon>
                                <PlayIcon />
                            </SvgIcon>
                        </Button>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={resume}
                            className={isRunning || isFinished ? 'hidden' : ''}
                            title="Resume"
                        >
                            <SvgIcon>
                                <PlayPauseIcon />
                            </SvgIcon>
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={stop}
                            className={isStopped || isFinished ? 'hidden' : ''}
                            title="Stop"
                        >
                            <SvgIcon>
                                <StopIcon />
                            </SvgIcon>
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
