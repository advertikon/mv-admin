import { Button, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import PlayPauseIcon from '@heroicons/react/24/solid/PlayPauseIcon';
import StopIcon from '@heroicons/react/24/solid/StopIcon';

export function IndexControls(props) {
    const { sx } = props;

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
                        <Button variant="contained" color="success">
                            <SvgIcon>
                                <PlayIcon />
                            </SvgIcon>
                        </Button>
                        <Button variant="contained" color="info">
                            <SvgIcon>
                                <PlayPauseIcon />
                            </SvgIcon>
                        </Button>
                        <Button variant="contained" color="error">
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
