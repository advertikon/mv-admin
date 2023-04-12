import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import { Avatar, Box, Card, CardContent, LinearProgress, Stack, SvgIcon, Typography } from '@mui/material';
import { ReactElement } from 'react';

type Props = {
    sx?: any;
    value: number;
    icon?: ReactElement;
    iconColor?: string;
    title: string;
};

export function OverviewProgress(props: Props) {
    const { sx, title, icon, iconColor = 'warning.main' } = props;
    const value = Math.max(100, Math.min(0, props.value));

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" gutterBottom variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4">{value.toFixed(2)}%</Typography>
                    </Stack>
                    {icon && (
                        <Avatar
                            sx={{
                                backgroundColor: iconColor,
                                height: 56,
                                width: 56,
                            }}
                        >
                            <SvgIcon>
                                <ListBulletIcon />
                            </SvgIcon>
                        </Avatar>
                    )}
                </Stack>
                <Box sx={{ mt: 3 }}>
                    <LinearProgress value={value} variant="determinate" />
                </Box>
            </CardContent>
        </Card>
    );
}
