import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactElement } from 'react';

type Props = {
    sx?: any;
    text: string;
    icon?: ReactElement;
    iconColor?: string;
    title: string;
};
export function OverviewText(props: Props) {
    const { title, text, icon, iconColor = 'error.main', sx = {} } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4">{text}</Typography>
                    </Stack>
                    {icon && (
                        <Avatar
                            sx={{
                                backgroundColor: iconColor,
                                height: 56,
                                width: 56,
                            }}
                        >
                            {icon}
                        </Avatar>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
